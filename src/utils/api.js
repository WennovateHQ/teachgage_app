import axios from 'axios'

/**
 * Production API Configuration
 * Direct connection to backend API
 * 
 * IMPORTANT: All demo data has been removed for production.
 * This file now makes direct calls to the backend API.
 */

// Get API URL - use NEXT_PUBLIC_API_URL for client-side, fallback to localhost for development
const getApiUrl = () => {
  // Client-side: Use NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  }
  // Server-side: Use BACKEND_URL
  return process.env.BACKEND_URL || 'http://localhost:5000'
}

// Create axios instance
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('teachgage_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('teachgage_refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${getApiUrl()}/api/auth/refresh`, {
            refreshToken
          })

          const { token, refreshToken: newRefreshToken } = response.data.data
          
          // Update tokens
          localStorage.setItem('teachgage_token', token)
          if (newRefreshToken) {
            localStorage.setItem('teachgage_refresh_token', newRefreshToken)
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('teachgage_token')
        localStorage.removeItem('teachgage_refresh_token')
        localStorage.removeItem('teachgage_user')
        window.location.href = '/auth/signin'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data?.message)
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data?.message)
    }

    if (!error.response) {
      console.error('Network error: Unable to connect to server')
    }

    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  // Regular user authentication
  register: (data) => api.post('/api/auth/register', {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    role: data.role || 'instructor',
    accountTier: data.accountTier || 'basic',
    organizationId: data.organizationId
  }),
  login: (data) => api.post('/api/auth/login', {
    email: data.email,
    password: data.password
  }),
  signout: () => api.post('/api/auth/signout'),
  refreshToken: () => api.post('/api/auth/refresh'),
  requestPasswordReset: (email) => api.post('/api/auth/password-reset-request', { email }),
  resetPassword: (data) => api.post('/api/auth/password-reset', {
    token: data.token,
    password: data.password
  }),
  verifyEmail: (token) => api.get(`/api/auth/verify/${token}`),
}

export const adminAuthAPI = {
  // Admin authentication
  login: (data) => api.post('/api/platform/login', {
    email: data.email,
    password: data.password,
    adminType: data.adminType || 'platform'
  }),
  requestPasswordReset: (email) => api.post('/api/platform/reset-password', { email }),
  resetPassword: (data) => api.post(`/api/platform/reset-password/${data.token}`, {
    password: data.password
  }),
}

export const userAPI = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
  changePassword: (data) => api.put('/api/user/change-password', data),
  deleteAccount: () => api.delete('/api/user/account'),
}

export const courseAPI = {
  getCourses: (params) => api.get('/api/courses', { params }),
  getCourse: (id) => api.get(`/api/courses/${id}`),
  createCourse: (data) => api.post('/api/courses', {
    title: data.title,
    description: data.description,
    objectives: data.objectives || [],
    prerequisites: data.prerequisites || [],
    instructorId: data.instructorId,
    departmentId: data.departmentId,
    startDate: data.startDate,
    endDate: data.endDate,
    maxStudents: data.maxStudents
  }),
  updateCourse: (id, data) => api.put(`/api/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
  duplicateCourse: (id) => api.post(`/api/courses/${id}/duplicate`),
  batchUpload: (file, options) => {
    const formData = new FormData()
    formData.append('coursesFile', file)
    if (options) {
      Object.keys(options).forEach(key => {
        formData.append(key, JSON.stringify(options[key]))
      })
    }
    return api.post('/api/courses/batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  assignInstructor: (courseId, data) => api.post(`/api/courses/${courseId}/instructors`, {
    instructorId: data.instructorId,
    role: data.role || 'primary'
  }),
  removeInstructor: (courseId, instructorId) => api.delete(`/api/courses/${courseId}/instructors/${instructorId}`),
  getCourseAnalytics: (courseId, params) => api.get(`/api/courses/${courseId}/analytics`, { params }),
  updateSchedule: (courseId, data) => api.put(`/api/courses/${courseId}/schedule`, {
    startDate: data.startDate,
    endDate: data.endDate,
    sessions: data.sessions || []
  }),
}

export const feedbackAPI = {
  getForms: (params) => api.get('/api/feedback-forms', { params }),
  getForm: (id) => api.get(`/api/feedback-forms/${id}`),
  createForm: (data) => api.post('/api/feedback-forms', data),
  updateForm: (id, data) => api.put(`/api/feedback-forms/${id}`, data),
  deleteForm: (id) => api.delete(`/api/feedback-forms/${id}`),
  getResponses: (formId, params) => api.get(`/api/feedback-forms/${formId}/responses`, { params }),
  submitResponse: (formId, data) => api.post(`/api/feedback-forms/${formId}/responses`, data),
  getAnalytics: (formId) => api.get(`/api/feedback-forms/${formId}/analytics`),
}

export const surveyAPI = {
  // Survey management
  getSurveys: (params) => api.get('/api/surveys', { params }),
  getSurvey: (id) => api.get(`/api/surveys/${id}`),
  createSurvey: (data) => api.post('/api/surveys', data),
  updateSurvey: (id, data) => api.put(`/api/surveys/${id}`, data),
  deleteSurvey: (id) => api.delete(`/api/surveys/${id}`),
  getResponses: (surveyId, params) => api.get(`/api/surveys/${surveyId}/responses`, { params }),
  submitResponse: (surveyId, data) => api.post(`/api/surveys/${surveyId}/responses`, data),
  
  // Survey builder
  getDrafts: (params) => api.get('/api/survey/drafts', { params }),
  getDraft: (id) => api.get(`/api/survey/drafts/${id}`),
  createDraft: (data) => api.post('/api/survey/drafts', {
    title: data.title,
    description: data.description,
    courseId: data.courseId,
    questions: data.questions || []
  }),
  updateDraft: (id, data) => api.put(`/api/survey/drafts/${id}`, data),
  deleteDraft: (id) => api.delete(`/api/survey/drafts/${id}`),
  publishDraft: (id) => api.post(`/api/survey/drafts/${id}/publish`),
  createVersion: (id) => api.post(`/api/survey/drafts/${id}/versions`),
  
  // Templates
  getTemplates: (params) => api.get('/api/survey/templates', { params }),
  getTemplate: (id) => api.get(`/api/survey/templates/${id}`),
  createTemplate: (data) => api.post('/api/survey/templates', {
    title: data.title,
    role: data.role,
    category: data.category,
    questions: data.questions || []
  }),
  updateTemplate: (id, data) => api.put(`/api/survey/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/api/survey/templates/${id}`),
  createDraftFromTemplate: (templateId, data) => api.post(`/api/survey/templates/${templateId}/create-draft`, data),
  createTemplateFromDraft: (draftId, data) => api.post(`/api/survey/drafts/${draftId}/create-template`, data),
  
  // Question bank
  getQuestions: (params) => api.get('/api/survey/question-bank', { params }),
  createQuestion: (data) => api.post('/api/survey/question-bank', data),
  updateQuestion: (id, data) => api.put(`/api/survey/question-bank/${id}`, data),
  deleteQuestion: (id) => api.delete(`/api/survey/question-bank/${id}`),
}

export const analyticsAPI = {
  getDashboardStats: () => api.get('/api/analytics/dashboard'),
  getCourseAnalytics: (courseId, params) => api.get(`/api/analytics/courses/${courseId}`, { params }),
  getFormAnalytics: (formId, params) => api.get(`/api/analytics/forms/${formId}`, { params }),
  getResponseTrends: (params) => api.get('/api/analytics/trends', { params }),
  exportData: (type, params) => api.get(`/api/analytics/export/${type}`, { 
    params, 
    responseType: 'blob' 
  }),
}

export const organizationAPI = {
  // Organization management
  getOrganization: () => api.get('/api/organizations'),
  createOrganization: (data) => api.post('/api/organizations', {
    name: data.name,
    type: data.type,
    address: data.address,
    contactInfo: data.contactInfo,
    subscriptionTier: data.subscriptionTier,
    maxUsers: data.maxUsers
  }),
  updateOrganization: (id, data) => api.put(`/api/organizations/${id}`, data),
  deleteOrganization: (id) => api.delete(`/api/organizations/${id}`),
  
  // Organization users
  getUsers: (orgId, params) => api.get(`/api/organizations/${orgId}/users`, { params }),
  inviteUser: (orgId, data) => api.post(`/api/organizations/${orgId}/users/invite`, {
    email: data.email,
    role: data.role,
    departmentId: data.departmentId
  }),
  removeUser: (orgId, userId) => api.delete(`/api/organizations/${orgId}/users/${userId}`),
  updateUserRole: (orgId, userId, role) => api.put(`/api/organizations/${orgId}/users/${userId}/role`, { role }),
  
  // Organization settings
  getSettings: (orgId) => api.get(`/api/organizations/${orgId}/settings`),
  updateSettings: (orgId, data) => api.put(`/api/organizations/${orgId}/settings`, data),
  
  // Organization analytics
  getAnalytics: (orgId, params) => api.get(`/api/organizations/${orgId}/analytics`, { params }),
}

export const departmentAPI = {
  // Department management
  getDepartments: (params) => api.get('/api/departments', { params }),
  getDepartment: (id) => api.get(`/api/departments/${id}`),
  createDepartment: (data) => api.post('/api/departments', {
    name: data.name,
    code: data.code,
    description: data.description,
    organizationId: data.organizationId,
    adminId: data.adminId,
    settings: data.settings
  }),
  updateDepartment: (id, data) => api.put(`/api/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/api/departments/${id}`),
  
  // Department users
  getUsers: (deptId, params) => api.get(`/api/departments/${deptId}/users`, { params }),
  assignUser: (deptId, userId) => api.post(`/api/departments/${deptId}/users`, { userId }),
  removeUser: (deptId, userId) => api.delete(`/api/departments/${deptId}/users/${userId}`),
  
  // Department analytics
  getAnalytics: (deptId, params) => api.get(`/api/departments/${deptId}/analytics`, { params }),
}

export const pipelineAPI = {
  // Pipeline management
  getPipelines: (params) => api.get('/api/pipelines', { params }),
  getPipeline: (id) => api.get(`/api/pipelines/${id}`),
  createPipeline: (data) => api.post('/api/pipelines', {
    name: data.name,
    description: data.description,
    stages: data.stages || []
  }),
  updatePipeline: (id, data) => api.put(`/api/pipelines/${id}`, data),
  deletePipeline: (id) => api.delete(`/api/pipelines/${id}`),
  
  // Pipeline stages
  createStage: (pipelineId, data) => api.post(`/api/pipelines/${pipelineId}/stages`, data),
  updateStage: (pipelineId, stageId, data) => api.put(`/api/pipelines/${pipelineId}/stages/${stageId}`, data),
  deleteStage: (pipelineId, stageId) => api.delete(`/api/pipelines/${pipelineId}/stages/${stageId}`),
  
  // Pipeline evaluations
  getEvaluations: (pipelineId, params) => api.get(`/api/pipelines/${pipelineId}/evaluations`, { params }),
  createEvaluation: (pipelineId, data) => api.post(`/api/pipelines/${pipelineId}/evaluations`, data),
  updateEvaluation: (pipelineId, evalId, data) => api.put(`/api/pipelines/${pipelineId}/evaluations/${evalId}`, data),
  moveEvaluation: (pipelineId, evalId, stageId) => api.put(`/api/pipelines/${pipelineId}/evaluations/${evalId}/move`, { stageId }),
}

export const notificationAPI = {
  // Notification management
  getTemplates: (params) => api.get('/api/notifications/templates', { params }),
  getTemplate: (id) => api.get(`/api/notifications/templates/${id}`),
  createTemplate: (data) => api.post('/api/notifications/templates', data),
  updateTemplate: (id, data) => api.put(`/api/notifications/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/api/notifications/templates/${id}`),
  
  // Send notifications
  send: (data) => api.post('/api/notifications/send', {
    templateId: data.templateId,
    recipients: data.recipients,
    variables: data.variables,
    scheduledFor: data.scheduledFor
  }),
  
  // Notification logs
  getLogs: (params) => api.get('/api/notifications/logs', { params }),
  getDeliveryStats: (params) => api.get('/api/notifications/delivery-stats', { params }),
}

export const adminAPI = {
  // Platform admin operations
  getSystemStats: () => api.get('/api/admin/system/stats'),
  getSystemHealth: () => api.get('/api/admin/system/health'),
  
  // User management
  searchUsers: (params) => api.get('/api/admin/users/search', { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  
  // Bulk operations
  bulkImport: (file, options) => {
    const formData = new FormData()
    formData.append('file', file)
    if (options) {
      Object.keys(options).forEach(key => {
        formData.append(key, JSON.stringify(options[key]))
      })
    }
    return api.post('/api/admin/bulk-operations/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  bulkExport: (params) => api.get('/api/admin/bulk-operations/export', { 
    params,
    responseType: 'blob'
  }),
  
  // Audit logs
  getAuditLogs: (params) => api.get('/api/admin/audit-logs', { params }),
  
  // Question bank management
  uploadQuestions: (file) => {
    const formData = new FormData()
    formData.append('questionsFile', file)
    return api.post('/api/admin/question-bank/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export const billingAPI = {
  // Subscription management
  getSubscription: () => api.get('/api/billing/subscription'),
  updateSubscription: (data) => api.put('/api/billing/subscription', data),
  cancelSubscription: () => api.post('/api/billing/subscription/cancel'),
  
  // Payment methods
  getPaymentMethods: () => api.get('/api/billing/payment-methods'),
  addPaymentMethod: (data) => api.post('/api/billing/payment-methods', data),
  deletePaymentMethod: (id) => api.delete(`/api/billing/payment-methods/${id}`),
  
  // Invoices
  getInvoices: (params) => api.get('/api/billing/invoices', { params }),
  getInvoice: (id) => api.get(`/api/billing/invoices/${id}`),
  downloadInvoice: (id) => api.get(`/api/billing/invoices/${id}/download`, { responseType: 'blob' }),
}

export default api
