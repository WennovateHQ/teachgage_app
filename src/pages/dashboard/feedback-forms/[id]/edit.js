import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../../components/common/Breadcrumb'
import { useAuth } from '../../../../contexts/AuthContext'
import { demoSurveys } from '../../../../data/demoData'
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  GripVertical,
  Star,
  CheckSquare,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function EditSurveyPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [survey, setSurvey] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    questions: []
  })

  useEffect(() => {
    if (id) {
      // Simulate API call to get survey details
      setTimeout(() => {
        const surveyData = demoSurveys.find(survey => survey.id === id)
        if (surveyData) {
          setSurvey(surveyData)
          setFormData({
            title: surveyData.title || '',
            description: surveyData.description || '',
            status: surveyData.status || 'draft',
            questions: surveyData.questions || []
          })
        }
        setIsLoading(false)
      }, 500)
    }
  }, [id])

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
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleQuestionChange = (questionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) => 
        index === questionIndex 
          ? { ...question, [field]: value }
          : question
      )
    }))
  }

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'text',
      required: false,
      options: []
    }
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const removeQuestion = (questionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }))
  }

  const addOption = (questionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) => 
        index === questionIndex 
          ? { ...question, options: [...(question.options || []), ''] }
          : question
      )
    }))
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) => 
        index === questionIndex 
          ? { 
              ...question, 
              options: question.options.map((option, oIndex) => 
                oIndex === optionIndex ? value : option
              )
            }
          : question
      )
    }))
  }

  const removeOption = (questionIndex, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) => 
        index === questionIndex 
          ? { 
              ...question, 
              options: question.options.filter((_, oIndex) => oIndex !== optionIndex)
            }
          : question
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    // Basic validation
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Survey title is required.' })
      setIsSaving(false)
      return
    }

    if (formData.questions.length === 0) {
      setMessage({ type: 'error', text: 'At least one question is required.' })
      setIsSaving(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Updating survey:', formData)
      setMessage({ type: 'success', text: 'Survey updated successfully!' })
      
      // Redirect back to survey detail page after a short delay
      setTimeout(() => {
        router.push(`/dashboard/feedback-forms/${id}`)
      }, 1500)
    } catch (error) {
      console.error('Failed to update survey:', error)
      setMessage({ type: 'error', text: 'Failed to update survey. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const breadcrumbItems = [
    { name: 'Surveys', href: '/dashboard/feedback-forms', icon: MessageSquare },
    { name: survey.title, href: `/dashboard/feedback-forms/${id}` },
    { name: 'Edit' }
  ]

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'rating': return Star
      case 'multiple_choice': return CheckSquare
      case 'text': return MessageSquare
      default: return FileText
    }
  }

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
                <p className="text-teachgage-navy">Make changes to your survey questions and settings</p>
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

            {/* Questions */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-teachgage-blue">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((question, questionIndex) => {
                  const Icon = getQuestionTypeIcon(question.type)
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                          <Icon className="w-4 h-4 text-teachgage-blue mr-2" />
                          <span className="text-sm font-medium text-teachgage-navy">
                            Question {questionIndex + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Text *
                          </label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                            placeholder="Enter your question"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => handleQuestionChange(questionIndex, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          >
                            <option value="text">Text</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="rating">Rating</option>
                          </select>
                        </div>
                      </div>

                      {question.type === 'multiple_choice' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options
                          </label>
                          <div className="space-y-2">
                            {(question.options || []).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOption(questionIndex, optionIndex)}
                                  className="ml-2 p-1 text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(questionIndex)}
                              className="text-sm text-teachgage-blue hover:text-teachgage-orange"
                            >
                              + Add Option
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => handleQuestionChange(questionIndex, 'required', e.target.checked)}
                            className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Required question</span>
                        </label>
                      </div>
                    </div>
                  )
                })}

                {formData.questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No questions added yet. Click "Add Question" to get started.</p>
                  </div>
                )}
              </div>
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
