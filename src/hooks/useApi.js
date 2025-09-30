import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authAPI, userAPI, courseAPI, feedbackAPI, analyticsAPI } from '../utils/api'
import toast from 'react-hot-toast'

// Auth hooks
export const useProfile = () => {
  return useQuery('profile', userAPI.getProfile, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation(userAPI.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('profile')
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })
}

// Course hooks
export const useCourses = (params = {}) => {
  return useQuery(['courses', params], () => courseAPI.getCourses(params), {
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCourse = (id) => {
  return useQuery(['course', id], () => courseAPI.getCourse(id), {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient()
  
  return useMutation(courseAPI.createCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries('courses')
      toast.success('Course created successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create course')
    },
  })
}

export const useUpdateCourse = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }) => courseAPI.updateCourse(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['course', id])
        queryClient.invalidateQueries('courses')
        toast.success('Course updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update course')
      },
    }
  )
}

export const useDeleteCourse = () => {
  const queryClient = useQueryClient()
  
  return useMutation(courseAPI.deleteCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries('courses')
      toast.success('Course deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete course')
    },
  })
}

// Feedback Form hooks
export const useFeedbackForms = (params = {}) => {
  return useQuery(['feedback-forms', params], () => feedbackAPI.getForms(params), {
    staleTime: 2 * 60 * 1000,
  })
}

export const useFeedbackForm = (id) => {
  return useQuery(['feedback-form', id], () => feedbackAPI.getForm(id), {
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateFeedbackForm = () => {
  const queryClient = useQueryClient()
  
  return useMutation(feedbackAPI.createForm, {
    onSuccess: () => {
      queryClient.invalidateQueries('feedback-forms')
      toast.success('Feedback form created successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create feedback form')
    },
  })
}

export const useUpdateFeedbackForm = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }) => feedbackAPI.updateForm(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['feedback-form', id])
        queryClient.invalidateQueries('feedback-forms')
        toast.success('Feedback form updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update feedback form')
      },
    }
  )
}

export const useDeleteFeedbackForm = () => {
  const queryClient = useQueryClient()
  
  return useMutation(feedbackAPI.deleteForm, {
    onSuccess: () => {
      queryClient.invalidateQueries('feedback-forms')
      toast.success('Feedback form deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete feedback form')
    },
  })
}

// Feedback Responses hooks
export const useFeedbackResponses = (formId, params = {}) => {
  return useQuery(
    ['feedback-responses', formId, params],
    () => feedbackAPI.getResponses(formId, params),
    {
      enabled: !!formId,
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  )
}

export const useSubmitFeedbackResponse = () => {
  return useMutation(
    ({ formId, data }) => feedbackAPI.submitResponse(formId, data),
    {
      onSuccess: () => {
        toast.success('Feedback submitted successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit feedback')
      },
    }
  )
}

// Analytics hooks
export const useDashboardStats = () => {
  return useQuery('dashboard-stats', analyticsAPI.getDashboardStats, {
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export const useCourseAnalytics = (courseId, params = {}) => {
  return useQuery(
    ['course-analytics', courseId, params],
    () => analyticsAPI.getCourseAnalytics(courseId, params),
    {
      enabled: !!courseId,
      staleTime: 2 * 60 * 1000,
    }
  )
}

export const useFormAnalytics = (formId, params = {}) => {
  return useQuery(
    ['form-analytics', formId, params],
    () => analyticsAPI.getFormAnalytics(formId, params),
    {
      enabled: !!formId,
      staleTime: 2 * 60 * 1000,
    }
  )
}

export const useResponseTrends = (params = {}) => {
  return useQuery(['response-trends', params], () => analyticsAPI.getResponseTrends(params), {
    staleTime: 5 * 60 * 1000,
  })
}

// Export data hook
export const useExportData = () => {
  return useMutation(
    ({ type, params }) => analyticsAPI.exportData(type, params),
    {
      onSuccess: (response, { type }) => {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${type}-export-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        toast.success('Data exported successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to export data')
      },
    }
  )
}
