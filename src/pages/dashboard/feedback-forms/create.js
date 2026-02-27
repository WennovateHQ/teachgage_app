import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { courseAPI, surveyAPI, questionnaireAPI } from '../../../utils/api'
import { 
  ArrowLeft,
  ArrowRight,
  Save,
  Plus,
  ClipboardList,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Search,
  Check
} from 'lucide-react'

export default function CreateSurveyPage() {
  const router = useRouter()
  const { courseId, questionnaireId: qIdFromQuery } = router.query
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [step, setStep] = useState(1) // Step 1: Select Questionnaire, Step 2: Configure Survey
  
  const [courses, setCourses] = useState([])
  const [questionnaires, setQuestionnaires] = useState([])
  const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questionnaireId: qIdFromQuery || '',
    courseId: courseId || '',
    status: 'active',
    anonymous: true,
    allowMultipleResponses: false,
    startDate: '',
    endDate: '',
    surveyType: 'custom'
  })

  // Load courses and questionnaires
  useEffect(() => {
    if (isAuthenticated) {
      loadCourses()
      loadQuestionnaires()
    }
  }, [isAuthenticated])

  // If questionnaireId is passed via query, auto-select it and go to step 2
  useEffect(() => {
    if (qIdFromQuery && questionnaires.length > 0) {
      const q = questionnaires.find(q => (q._id || q.id) === qIdFromQuery)
      if (q) {
        setSelectedQuestionnaire(q)
        setFormData(prev => ({ ...prev, questionnaireId: qIdFromQuery, title: `Survey: ${q.title}` }))
        setStep(2)
      }
    }
  }, [qIdFromQuery, questionnaires])

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getCourses()
      const coursesData = Array.isArray(response.data?.data) 
        ? response.data.data 
        : (response.data?.courses || [])
      setCourses(coursesData)
    } catch (error) {
      console.error('Failed to load courses:', error)
      setCourses([])
    }
  }

  const loadQuestionnaires = async () => {
    try {
      setLoadingQuestionnaires(true)
      const response = await questionnaireAPI.getQuestionnaires()
      const data = Array.isArray(response.data?.data) 
        ? response.data.data 
        : (response.data?.questionnaires || [])
      setQuestionnaires(data)
    } catch (error) {
      console.error('Failed to load questionnaires:', error)
      setQuestionnaires([])
    } finally {
      setLoadingQuestionnaires(false)
    }
  }

  const filteredQuestionnaires = questionnaires.filter(q =>
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectQuestionnaire = (q) => {
    setSelectedQuestionnaire(q)
    setFormData(prev => ({ 
      ...prev, 
      questionnaireId: q._id || q.id,
      title: prev.title || `Survey: ${q.title}`
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Survey title is required.' })
      setIsSaving(false)
      return
    }

    if (!formData.questionnaireId) {
      setMessage({ type: 'error', text: 'Please select a questionnaire first.' })
      setIsSaving(false)
      setStep(1)
      return
    }

    try {
      // Find course name for the selected course
      const selectedCourse = courses.find(c => (c.id || c._id) === formData.courseId)
      const submitData = {
        ...formData,
        courseName: selectedCourse?.name || selectedCourse?.title || 'General',
        instructorId: user?.id,
        instructorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Instructor'
      }

      await surveyAPI.createSurvey(submitData)
      setMessage({ type: 'success', text: 'Survey created successfully!' })
      
      setTimeout(() => {
        router.push('/dashboard/feedback-forms')
      }, 1500)
    } catch (error) {
      console.error('Failed to create survey:', error)
      setMessage({ type: 'error', text: error.response?.data?.error?.message || error.response?.data?.message || 'Failed to create survey. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Create Survey">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth/signin')
    return null
  }

  return (
    <>
      <Head>
        <title>Create Survey - TeachGage</title>
      </Head>

      <DashboardLayout title="Create Survey">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-teachgage-navy">
            <Link href="/dashboard" className="hover:text-teachgage-blue">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/feedback-forms" className="hover:text-teachgage-blue">Surveys</Link>
            <span>/</span>
            <span className="text-teachgage-blue font-medium">Create</span>
          </nav>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Create Survey</h1>
              <p className="text-teachgage-navy">Select a questionnaire and configure your survey</p>
            </div>
            <Link href="/dashboard/feedback-forms">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </Link>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === 1 ? 'bg-teachgage-blue text-white' : 'bg-green-100 text-green-700'}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : <span>1</span>}
              Select Questionnaire
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === 2 ? 'bg-teachgage-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
              <span>2</span>
              Configure Survey
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
              {message.text}
            </div>
          )}

          {/* Step 1: Select Questionnaire */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Search + Create New */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search questionnaires..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>
                <Link
                  href="/dashboard/questionnaires/create"
                  className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Questionnaire
                </Link>
              </div>

              {/* Questionnaire List */}
              {loadingQuestionnaires ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
                </div>
              ) : filteredQuestionnaires.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questionnaires available</h3>
                  <p className="text-gray-500 mb-6">
                    You need to create a questionnaire before creating a survey.
                  </p>
                  <Link
                    href="/dashboard/questionnaires/create"
                    className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Questionnaire
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredQuestionnaires.map((q) => {
                    const qId = q._id || q.id
                    const isSelected = selectedQuestionnaire && (selectedQuestionnaire._id || selectedQuestionnaire.id) === qId
                    return (
                      <button
                        key={qId}
                        onClick={() => selectQuestionnaire(q)}
                        className={`w-full text-left bg-white rounded-xl border-2 p-5 transition-all ${
                          isSelected 
                            ? 'border-teachgage-blue bg-blue-50/50 shadow-md' 
                            : 'border-gray-200 hover:border-teachgage-blue/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-base font-semibold text-gray-900 truncate">{q.title}</h3>
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-teachgage-blue text-white rounded-full">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                              {q.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {q.questions?.length || 0} questions
                              </span>
                              {q.purpose && (
                                <span className="capitalize">{q.purpose.replace(/_/g, ' ')}</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                            isSelected ? 'border-teachgage-blue bg-teachgage-blue' : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Next Button */}
              {selectedQuestionnaire && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors"
                  >
                    Continue to Survey Settings
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Configure Survey */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Selected Questionnaire Summary */}
              {selectedQuestionnaire && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Selected Questionnaire</div>
                    <div className="font-semibold text-gray-900">{selectedQuestionnaire.title}</div>
                    <div className="text-sm text-gray-500">{selectedQuestionnaire.questions?.length || 0} questions</div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-teachgage-blue hover:text-teachgage-dark-blue underline"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Survey Settings Form */}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-teachgage-blue">Survey Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-teachgage-navy mb-2">
                    Survey Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    placeholder="Enter survey title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-teachgage-navy mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    placeholder="Describe this survey..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Course
                    </label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="">Select a course (optional)</option>
                      {courses.map(course => (
                        <option key={course.id || course._id} value={course.id || course._id}>
                          {course.name || course.title || 'Untitled Course'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-2 text-sm text-teachgage-navy">
                      Anonymous responses
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowMultipleResponses"
                      name="allowMultipleResponses"
                      checked={formData.allowMultipleResponses}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                    />
                    <label htmlFor="allowMultipleResponses" className="ml-2 text-sm text-teachgage-navy">
                      Allow multiple responses from same user
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Creating...' : 'Create Survey'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}
