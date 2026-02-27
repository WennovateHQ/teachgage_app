import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../../components/common/Breadcrumb'
import { useAuth } from '../../../../contexts/AuthContext'
import { surveyAPI, questionnaireAPI, courseAPI } from '../../../../utils/api'
import { 
  ArrowLeft,
  Save,
  X,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
  ClipboardList,
  ExternalLink,
  Edit3
} from 'lucide-react'
import { format } from 'date-fns'

export default function EditSurveyPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [survey, setSurvey] = useState(null)
  const [questionnaire, setQuestionnaire] = useState(null)
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    courseId: '',
    startDate: '',
    endDate: '',
    anonymousResponses: true,
    showResultsToInstructor: true
  })

  useEffect(() => {
    const loadData = async () => {
      if (!router.isReady || !id) return;
      setIsLoading(true);
      try {
        // Load survey
        const surveyResponse = await surveyAPI.getSurvey(id);
        const surveyData = surveyResponse.data?.survey || surveyResponse.data?.data || surveyResponse.data;
        
        if (surveyData) {
          setSurvey({ ...surveyData, id: surveyData.id || surveyData._id });
          setFormData({
            title: surveyData.title || '',
            description: surveyData.description || '',
            status: surveyData.status || 'draft',
            courseId: surveyData.courseId || '',
            startDate: surveyData.startDate ? surveyData.startDate.split('T')[0] : '',
            endDate: surveyData.endDate ? surveyData.endDate.split('T')[0] : '',
            anonymousResponses: surveyData.anonymousResponses !== false,
            showResultsToInstructor: surveyData.showResultsToInstructor !== false
          });
          
          // Load linked questionnaire if exists
          if (surveyData.questionnaireId) {
            try {
              const qResponse = await questionnaireAPI.getQuestionnaire(surveyData.questionnaireId);
              const qData = qResponse.data?.data || qResponse.data;
              setQuestionnaire(qData);
            } catch (qErr) {
              console.error('Failed to load questionnaire:', qErr);
            }
          }
        }
        
        // Load courses for dropdown
        try {
          const coursesResponse = await courseAPI.getCourses();
          const coursesData = coursesResponse.data?.data || coursesResponse.data?.courses || [];
          setCourses(Array.isArray(coursesData) ? coursesData : []);
        } catch (cErr) {
          console.error('Failed to load courses:', cErr);
        }
      } catch (error) {
        console.error('Failed to load survey:', error);
        setMessage({ type: 'error', text: 'Failed to load survey data.' });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router.isReady, id])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth/signin')
    return null
  }

  if (!survey) {
    return (
      <DashboardLayout title="Survey Not Found">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-teachgage-blue mb-2">Survey Not Found</h2>
          <p className="text-teachgage-navy mb-6">The survey you're trying to edit doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard/feedback-forms">
            <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </button>
          </Link>
        </div>
      </DashboardLayout>
    )
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

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        courseId: formData.courseId || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        anonymousResponses: formData.anonymousResponses,
        showResultsToInstructor: formData.showResultsToInstructor
      }
      
      await surveyAPI.updateSurvey(id, updateData);
      setMessage({ type: 'success', text: 'Survey updated successfully!' });
      
      setTimeout(() => {
        router.push(`/dashboard/feedback-forms/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to update survey:', error);
      const errMsg = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update survey.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setIsSaving(false);
    }
  }

  const breadcrumbItems = [
    { name: 'Surveys', href: '/dashboard/feedback-forms', icon: MessageSquare },
    { name: survey.title, href: `/dashboard/feedback-forms/${id}` },
    { name: 'Edit' }
  ]

  return (
    <>
      <Head>
        <title>Edit {survey.title} - TeachGage</title>
        <meta name="description" content={`Edit survey: ${survey.description}`} />
      </Head>

      <DashboardLayout title={`Edit ${survey.title}`}>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-teachgage-blue">Edit Survey</h1>
                <p className="text-teachgage-navy">Update survey settings and configuration</p>
              </div>
              <Link href={`/dashboard/feedback-forms/${id}`}>
                <button className="inline-flex items-center px-4 py-2 text-teachgage-navy border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </Link>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-teachgage-blue mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Survey Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    placeholder="Enter survey title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
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

              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  placeholder="Enter survey description"
                />
              </div>
            </div>

            {/* Course & Schedule */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-teachgage-blue mb-4">Course & Schedule</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    id="courseId"
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id || course.id} value={course._id || course.id}>
                        {course.name || course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Response Settings */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-teachgage-blue mb-4">Response Settings</h2>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="anonymousResponses"
                    checked={formData.anonymousResponses}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Anonymous responses (recommended)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showResultsToInstructor"
                    checked={formData.showResultsToInstructor}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show results to instructor</span>
                </label>
              </div>
            </div>

            {/* Linked Questionnaire */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-teachgage-blue">Linked Questionnaire</h2>
                {questionnaire && (
                  <Link href={`/dashboard/questionnaires/${questionnaire._id || questionnaire.id}`}>
                    <button type="button" className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Questions
                    </button>
                  </Link>
                )}
              </div>

              {questionnaire ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ClipboardList className="w-6 h-6 text-teachgage-blue" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{questionnaire.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{questionnaire.description || 'No description'}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {questionnaire.questions?.length || 0} questions
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            questionnaire.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {questionnaire.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/dashboard/questionnaires/${questionnaire._id || questionnaire.id}`}>
                      <span className="text-teachgage-blue hover:underline text-sm flex items-center">
                        View <ExternalLink className="w-3 h-3 ml-1" />
                      </span>
                    </Link>
                  </div>

                  {/* Questions preview */}
                  {questionnaire.questions && questionnaire.questions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Questions Preview:</p>
                      <ul className="space-y-2">
                        {questionnaire.questions.slice(0, 5).map((q, idx) => (
                          <li key={q.questionId || idx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-gray-400 mr-2">{idx + 1}.</span>
                            <span>{q.text || q.question}</span>
                            {q.required && <span className="text-red-500 ml-1">*</span>}
                          </li>
                        ))}
                        {questionnaire.questions.length > 5 && (
                          <li className="text-sm text-gray-500 italic">
                            ... and {questionnaire.questions.length - 5} more questions
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No questionnaire linked to this survey</p>
                  <Link href="/dashboard/questionnaires/create">
                    <button type="button" className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors">
                      Create Questionnaire
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-6 py-3 bg-teachgage-green text-white rounded-lg hover:bg-teachgage-green/90 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  )
}
