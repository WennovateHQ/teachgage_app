import axios from 'axios'

// Demo data
const demoData = {
  courses: [
    {
      id: '1',
      title: 'Introduction to Photography',
      description: 'Learn the basics of photography including composition, lighting, and camera settings.',
      status: 'active',
      studentCount: 24,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      instructor: 'Demo Teacher',
      duration: '8 weeks',
      category: 'Arts'
    },
    {
      id: '2',
      title: 'Advanced Digital Marketing',
      description: 'Master digital marketing strategies including SEO, social media, and content marketing.',
      status: 'active',
      studentCount: 18,
      createdAt: '2024-02-01T09:00:00Z',
      updatedAt: '2024-02-05T16:45:00Z',
      instructor: 'Demo Teacher',
      duration: '12 weeks',
      category: 'Business'
    },
    {
      id: '3',
      title: 'Web Development Fundamentals',
      description: 'Build modern websites using HTML, CSS, JavaScript, and React.',
      status: 'draft',
      studentCount: 0,
      createdAt: '2024-02-10T11:00:00Z',
      updatedAt: '2024-02-10T11:00:00Z',
      instructor: 'Demo Teacher',
      duration: '16 weeks',
      category: 'Technology'
    }
  ],
  feedbackForms: [
    {
      id: '1',
      title: 'Mid-Course Photography Feedback',
      description: 'Collect feedback on photography course progress and teaching methods.',
      courseId: '1',
      courseName: 'Introduction to Photography',
      status: 'active',
      responseCount: 18,
      createdAt: '2024-01-25T10:00:00Z',
      questions: [
        { id: '1', type: 'rating', question: 'How would you rate the course content?', required: true },
        { id: '2', type: 'text', question: 'What aspects of the course do you find most valuable?', required: false },
        { id: '3', type: 'rating', question: 'How clear are the instructor\'s explanations?', required: true }
      ]
    },
    {
      id: '2',
      title: 'Digital Marketing Course Evaluation',
      description: 'End-of-course evaluation for digital marketing students.',
      courseId: '2',
      courseName: 'Advanced Digital Marketing',
      status: 'active',
      responseCount: 12,
      createdAt: '2024-02-15T14:00:00Z',
      questions: [
        { id: '1', type: 'rating', question: 'Overall course satisfaction', required: true },
        { id: '2', type: 'multiple-choice', question: 'Which topic was most useful?', options: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'], required: true },
        { id: '3', type: 'text', question: 'Suggestions for improvement', required: false }
      ]
    }
  ],
  analytics: {
    dashboardStats: {
      totalCourses: 8,
      activeForms: 12,
      totalResponses: 247,
      averageRating: 4.6
    },
    responseTrends: [
      { date: '2024-01-01', responses: 15 },
      { date: '2024-01-02', responses: 23 },
      { date: '2024-01-03', responses: 18 },
      { date: '2024-01-04', responses: 31 },
      { date: '2024-01-05', responses: 27 }
    ]
  }
}

// Check if user is demo user (always return true for demo mode)
const isDemoUser = async () => {
  // For now, always return true to use demo data
  // In production, this would check if the user has a demo account
  return true
}

// Create axios instance
const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/auth/signin'
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
  getCourses: async (params) => {
    if (await isDemoUser()) {
      // Return demo courses data
      let courses = [...demoData.courses]
      
      // Apply filters if provided
      if (params?.search) {
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(params.search.toLowerCase()) ||
          course.description.toLowerCase().includes(params.search.toLowerCase())
        )
      }
      
      if (params?.status && params.status !== 'all') {
        courses = courses.filter(course => course.status === params.status)
      }
      
      return { 
        data: {
          courses,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: courses.length,
            totalPages: Math.ceil(courses.length / (params?.limit || 10))
          }
        }
      }
    }
    return api.get('/api/courses', { params })
  },
  getCourse: async (id) => {
    if (await isDemoUser()) {
      const course = demoData.courses.find(c => c.id === id)
      return { data: course }
    }
    return api.get(`/api/courses/${id}`)
  },
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
  getForms: async (params) => {
    if (await isDemoUser()) {
      let forms = [...demoData.feedbackForms]
      
      // Apply filters if provided
      if (params?.search) {
        forms = forms.filter(form => 
          form.title.toLowerCase().includes(params.search.toLowerCase()) ||
          form.description.toLowerCase().includes(params.search.toLowerCase())
        )
      }
      
      if (params?.status && params.status !== 'all') {
        forms = forms.filter(form => form.status === params.status)
      }
      
      return { data: forms }
    }
    return api.get('/api/feedback-forms', { params })
  },
  getForm: async (id) => {
    if (await isDemoUser()) {
      const form = demoData.feedbackForms.find(f => f.id === id)
      return { data: form }
    }
    return api.get(`/api/feedback-forms/${id}`)
  },
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
  getDashboardStats: async () => {
    if (await isDemoUser()) {
      return { data: demoData.analytics.dashboardStats }
    }
    return api.get('/api/analytics/dashboard')
  },
  getCourseAnalytics: async (courseId, params) => {
    if (await isDemoUser()) {
      // Return demo analytics for the specific course
      return { 
        data: {
          courseId,
          totalStudents: 24,
          averageRating: 4.5,
          completionRate: 85,
          feedbackCount: 18,
          trends: demoData.analytics.responseTrends
        }
      }
    }
    return api.get(`/api/analytics/courses/${courseId}`, { params })
  },
  getFormAnalytics: async (formId, params) => {
    if (await isDemoUser()) {
      const form = demoData.feedbackForms.find(f => f.id === formId)
      return { 
        data: {
          formId,
          responseCount: form?.responseCount || 0,
          averageRating: 4.3,
          completionRate: 92,
          trends: demoData.analytics.responseTrends
        }
      }
    }
    return api.get(`/api/analytics/forms/${formId}`, { params })
  },
  getResponseTrends: async (params) => {
    if (await isDemoUser()) {
      return { data: demoData.analytics.responseTrends }
    }
    return api.get('/api/analytics/trends', { params })
  },
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
