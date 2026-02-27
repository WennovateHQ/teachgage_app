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
    console.log('\n========== AXIOS REQUEST ==========');
    console.log('URL:', config.baseURL + config.url);
    console.log('Method:', config.method?.toUpperCase());
    console.log('Headers:', JSON.stringify(config.headers, null, 2));
    if (config.data) {
      console.log('Data:', JSON.stringify(config.data, null, 2));
    }
    console.log('===================================\n');
    
    const token = localStorage.getItem('teachgage_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('\n========== AXIOS REQUEST ERROR ==========');
    console.error('Error:', error);
    console.error('=========================================\n');
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    console.log('\n========== AXIOS RESPONSE ==========');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    console.log('====================================\n');
    return response;
  },
  async (error) => {
    console.error('\n========== AXIOS RESPONSE ERROR ==========');
    console.error('URL:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Error Message:', error.message);
    console.error('==========================================\n');
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
  signout: () => api.post('/api/auth/logout'),
  refreshToken: () => api.post('/api/auth/refresh'),
  getSession: () => api.get('/api/auth/session'),
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
  getUsers: (params) => api.get('/api/users', { params }),
  getUser: (id) => api.get(`/api/users/${id}`),
  getProfile: () => api.get('/api/auth/session'),
  updateProfile: (id, data) => api.patch(`/api/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  createInstructor: (data) => api.post('/api/users/instructors', data),
  batchImportInstructors: (data) => api.post('/api/users/instructors/batch', data),
  createDepartmentAdmin: (data) => api.post('/api/users/department-admins', data),
}

export const courseAPI = {
  getCourses: (params) => api.get('/api/courses', { params }),
  getCourse: (id) => api.get(`/api/courses/${id}`),
  createCourse: (data) => api.post('/api/courses', {
    name: data.name || data.title,
    description: data.description,
    objectives: data.objectives || [],
    prerequisites: data.prerequisites || [],
    instructorId: data.instructorId,
    departmentId: data.departmentId,
    startDate: data.startDate,
    endDate: data.endDate,
    capacity: data.maxStudents || data.capacity,
    status: data.status || 'draft'
  }),
  updateCourse: (id, data) => api.put(`/api/courses/${id}`, {
    name: data.name || data.title,
    code: data.code,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    capacity: data.capacity || data.maxStudents,
    status: data.status,
    // Store additional fields in metadata if needed
    ...(data.category && { tags: [data.category] }),
    ...(data.prerequisites && { metadata: { prerequisites: data.prerequisites } }),
    ...(data.learningObjectives && { metadata: { ...data.metadata, learningObjectives: data.learningObjectives } })
  }),
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
  
  // Enrollments
  enrollStudent: (courseId, data) => api.post(`/api/courses/${courseId}/enrollments`, data),
  getCourseEnrollments: (courseId, params) => api.get(`/api/courses/${courseId}/enrollments`, { params }),
  unenrollStudent: (courseId, enrollmentId) => api.delete(`/api/courses/${courseId}/enrollments/${enrollmentId}`),
  batchEnrollStudents: (courseId, students) => api.post(`/api/courses/${courseId}/enrollments/batch`, { students }),
}

export const feedbackAPI = {
  // Feedback forms map to surveys on backend - no separate /api/feedback-forms endpoint
  getForms: (params) => api.get('/api/surveys', { params }),
  getForm: (id) => api.get(`/api/surveys/${id}`),
  createForm: (data) => api.post('/api/surveys', data),
  updateForm: (id, data) => api.put(`/api/surveys/${id}`, data),
  deleteForm: (id) => api.delete(`/api/surveys/${id}`),
  getResponses: (surveyId, params) => api.get(`/api/surveys/${surveyId}/responses`, { params }),
  submitResponse: (surveyId, data) => api.post(`/api/surveys/${surveyId}/responses`, data),
  getResponseRate: (surveyId) => api.get(`/api/surveys/${surveyId}/response-rate`),
}

export const questionnaireAPI = {
  // Questionnaire CRUD
  getQuestionnaires: (params) => api.get('/api/questionnaires', { params }),
  getQuestionnaire: (id) => api.get(`/api/questionnaires/${id}`),
  createQuestionnaire: (data) => api.post('/api/questionnaires', data),
  updateQuestionnaire: (id, data) => api.put(`/api/questionnaires/${id}`, data),
  deleteQuestionnaire: (id) => api.delete(`/api/questionnaires/${id}`),
  
  // Versioning and cloning
  createVersion: (id, data) => api.post(`/api/questionnaires/${id}/versions`, data),
  cloneQuestionnaire: (id, data) => api.post(`/api/questionnaires/${id}/clone`, data),
  
  // Question management within a questionnaire
  addQuestion: (id, data) => api.post(`/api/questionnaires/${id}/questions`, data),
  updateQuestion: (id, questionId, data) => api.put(`/api/questionnaires/${id}/questions/${questionId}`, data),
  deleteQuestion: (id, questionId) => api.delete(`/api/questionnaires/${id}/questions/${questionId}`),
  reorderQuestions: (id, order) => api.put(`/api/questionnaires/${id}/questions/reorder`, { order }),
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
  getResponseById: (responseId) => api.get(`/api/surveys/responses/${responseId}`),
  updateResponse: (responseId, data) => api.put(`/api/surveys/responses/${responseId}`, data),
  cloneSurvey: (id) => api.post(`/api/surveys/${id}/clone`),
  getSurveyStatistics: (id) => api.get(`/api/surveys/${id}/statistics`),
  
  // Survey invitations
  validateInvitation: (token) => api.get(`/api/surveys/invitations/by-token/${token}`),
  getInvitations: (surveyId, params) => api.get(`/api/surveys/${surveyId}/invitations`, { params }),
  createInvitations: (surveyId, data) => api.post(`/api/surveys/${surveyId}/invitations`, data),
  resendInvitation: (invitationId) => api.post(`/api/surveys/invitations/${invitationId}/resend`),
  
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
  getOverview: (params) => api.get('/api/analytics/overview', { params }),
  getCourseAnalytics: (courseId, params) => api.get(`/api/analytics/course/${courseId}`, { params }),
  getSurveyAnalytics: (surveyId, params) => api.get(`/api/analytics/survey/${surveyId}`, { params }),
  getUserAnalytics: (userId, params) => api.get(`/api/analytics/user/${userId}`, { params }),
  getDepartmentAnalytics: (deptId, params) => api.get(`/api/analytics/department/${deptId}`, { params }),
  getSurveyPerformance: (params) => api.get('/api/analytics/survey-performance', { params }),
  getCourseAnalyticsMetrics: (params) => api.get('/api/analytics/course-analytics', { params }),
  getUserEngagement: (params) => api.get('/api/analytics/user-engagement', { params }),
  getTrends: (metricName, params) => api.get(`/api/analytics/trends/${metricName}`, { params }),
  getResponseTrends: (params) => api.get('/api/analytics/trends/responses', { params }),
  getFormAnalytics: (formId, params) => api.get(`/api/analytics/survey/${formId}`, { params }),
  getComparison: (params) => api.get('/api/analytics/comparison', { params }),
  getRealTime: () => api.get('/api/analytics/real-time'),
  getPipelineMetrics: (params) => api.get('/api/analytics/pipeline-metrics', { params }),
  getUsageMetrics: (params) => api.get('/api/analytics/usage-metrics', { params }),
  exportData: (params) => api.get('/api/analytics/export', { params, responseType: 'blob' }),
  generateCustomReport: (data) => api.post('/api/analytics/reports/custom', data),
}

export const organizationAPI = {
  // Organization management
  getOrganizations: (params) => api.get('/api/organizations', { params }),
  getOrganization: (id) => api.get(`/api/organizations/${id}`),
  createOrganization: (data) => api.post('/api/organizations', data),
  updateOrganization: (id, data) => api.put(`/api/organizations/${id}`, data),
  deleteOrganization: (id) => api.delete(`/api/organizations/${id}`),
  
  // Organization administrators
  addAdministrator: (orgId, data) => api.post(`/api/organizations/${orgId}/administrators`, data),
  removeAdministrator: (orgId, userId) => api.delete(`/api/organizations/${orgId}/administrators/${userId}`),
  
  // Organization settings
  updateSettings: (orgId, data) => api.put(`/api/organizations/${orgId}/settings`, data),
  updateSubscription: (orgId, data) => api.put(`/api/organizations/${orgId}/subscription`, data),
  
  // Academic terms
  addAcademicTerm: (orgId, data) => api.post(`/api/organizations/${orgId}/academic-terms`, data),
  updateAcademicTerm: (orgId, termId, data) => api.put(`/api/organizations/${orgId}/academic-terms/${termId}`, data),
  removeAcademicTerm: (orgId, termId) => api.delete(`/api/organizations/${orgId}/academic-terms/${termId}`),
  
  // Organization users (via /api/users endpoint)
  getUsers: (params) => api.get('/api/users', { params }),
  inviteUser: (data) => api.post('/api/invitations', data),
  batchInvite: (data) => api.post('/api/invitations/batch', data),
}

export const departmentAPI = {
  // Department management
  getDepartments: (params) => api.get('/api/departments', { params }),
  getDepartment: (id) => api.get(`/api/departments/${id}`),
  searchDepartments: (name) => api.get('/api/departments/search', { params: { name } }),
  createDepartment: (data) => api.post('/api/departments', data),
  updateDepartment: (id, data) => api.put(`/api/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/api/departments/${id}`),
  bulkCreateDepartments: (data) => api.post('/api/departments/bulk/create', data),
  createDefaultDepartment: (data) => api.post('/api/departments/default/create', data),
  transferMembers: (deptId, data) => api.post(`/api/departments/${deptId}/transfer-members`, data),
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
  
  // Pipeline lifecycle
  clonePipeline: (id, data) => api.post(`/api/pipelines/${id}/clone`, data),
  activatePipeline: (id) => api.put(`/api/pipelines/${id}/activate`),
  archivePipeline: (id) => api.put(`/api/pipelines/${id}/archive`),

  // Pipeline triggers
  getTriggers: (params) => api.get('/api/pipeline-triggers', { params }),
  getTriggersByPipeline: (pipelineId, params) => api.get(`/api/pipeline-triggers/pipeline/${pipelineId}`, { params }),
  createTrigger: (data) => api.post('/api/pipeline-triggers', data),
  getTrigger: (triggerId) => api.get(`/api/pipeline-triggers/${triggerId}`),
  updateTrigger: (triggerId, data) => api.put(`/api/pipeline-triggers/${triggerId}`, data),
  deleteTrigger: (triggerId) => api.delete(`/api/pipeline-triggers/${triggerId}`),
  toggleTrigger: (triggerId, enabled) => api.patch(`/api/pipeline-triggers/${triggerId}/toggle`, { enabled }),
  executeTrigger: (triggerId, context) => api.post(`/api/pipeline-triggers/${triggerId}/execute`, { context }),
  getTriggerHistory: (triggerId, params) => api.get(`/api/pipeline-triggers/${triggerId}/history`, { params }),
}

export const notificationAPI = {
  // User notifications
  getNotifications: (params) => api.get('/api/notifications', { params }),
  getNotification: (id) => api.get(`/api/notifications/${id}`),
  getUnreadCount: () => api.get('/api/notifications/unread/count'),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/api/notifications/read/all'),
  archiveNotification: (id) => api.patch(`/api/notifications/${id}/archive`),
  deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
  deleteAllNotifications: () => api.delete('/api/notifications'),
  
  // Create notifications (admin)
  createNotification: (data) => api.post('/api/notifications', data),
  createBulkNotifications: (data) => api.post('/api/notifications/bulk', data),
  createFromTemplate: (data) => api.post('/api/notifications/template', data),
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
  bulkExport: (data) => api.post('/api/admin/bulk-operations/export', data, {
    responseType: 'blob'
  }),
  
  // Audit logs
  getAuditLogs: (params) => api.get('/api/audit-logs', { params }),
  
  // Import rollback
  getImportHistory: (params) => api.get('/api/admin/imports', { params }),
  getImportBatch: (batchId) => api.get(`/api/admin/imports/${batchId}`),
  rollbackImport: (batchId) => api.post(`/api/admin/imports/${batchId}/rollback`),
  
  // Question bank management
  uploadQuestions: (file) => {
    const formData = new FormData()
    formData.append('questionsFile', file)
    return api.post('/api/admin/question-bank/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export const aiAPI = {
  // Growth Plans
  generateGrowthPlan: (data) => api.post('/api/ai/growth-plans', data),
  generateForInstructor: (instructorId, data) => api.post(`/api/ai/growth-plans/${instructorId}`, data),
  getGrowthPlans: (params) => api.get('/api/ai/growth-plans', { params }),
  getInstructorPlans: (instructorId, params) => api.get(`/api/ai/growth-plans/instructor/${instructorId}`, { params }),
  getGrowthPlan: (planId) => api.get(`/api/ai/growth-plans/${planId}`),
  updateMilestone: (planId, milestoneIndex, status) => api.patch(`/api/ai/growth-plans/${planId}/milestones/${milestoneIndex}`, { status }),

  // Sentiment Analysis
  analyzeSentiment: (data) => api.post('/api/ai/sentiment', data),

  // Organization AI Analytics
  getOrgAIAnalytics: () => api.get('/api/ai/organization-analytics'),
  getOrgAIAnalyticsById: (orgId) => api.get(`/api/ai/organization-analytics/${orgId}`),
}

export const billingAPI = {
  // Subscription management
  getSubscription: () => api.get('/api/billing/subscription'),
  upgradeSubscription: (data) => api.put('/api/billing/subscription/upgrade', data),
  downgradeSubscription: (data) => api.put('/api/billing/subscription/downgrade', data),
  cancelSubscription: () => api.put('/api/billing/subscription/cancel'),
  
  // Payment methods
  getPaymentMethods: () => api.get('/api/billing/payment-methods'),
  addPaymentMethod: (data) => api.post('/api/billing/payment-methods', data),
  deletePaymentMethod: (id) => api.delete(`/api/billing/payment-methods/${id}`),
  
  // Invoices
  getInvoices: (params) => api.get('/api/billing/invoices', { params }),
  getInvoice: (id) => api.get(`/api/billing/invoices/${id}`),
  downloadInvoice: (id) => api.get(`/api/billing/invoices/${id}/pdf`, { responseType: 'blob' }),
}

export default api
