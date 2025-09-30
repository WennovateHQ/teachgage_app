import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { demoCourses } from '../../../data/demoData'
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  GripVertical,
  Star,
  MessageSquare,
  CheckSquare,
  ToggleLeft,
  Hash,
  Calendar,
  AlertCircle,
  CheckCircle,
  Eye
} from 'lucide-react'

export default function CreateSurveyPage() {
  const router = useRouter()
  const { courseId } = router.query
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [previewMode, setPreviewMode] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: courseId || '',
    status: 'draft',
    anonymous: true,
    allowMultipleResponses: false,
    startDate: '',
    endDate: '',
    questions: []
  })

  const questionTypes = [
    { id: 'rating', name: 'Rating Scale', icon: Star, description: '1-5 star rating' },
    { id: 'multiple_choice', name: 'Multiple Choice', icon: CheckSquare, description: 'Select one option' },
    { id: 'checkbox', name: 'Checkboxes', icon: CheckSquare, description: 'Select multiple options' },
    { id: 'text', name: 'Text Response', icon: MessageSquare, description: 'Open-ended text' },
    { id: 'textarea', name: 'Long Text', icon: MessageSquare, description: 'Multi-line text' },
    { id: 'number', name: 'Number', icon: Hash, description: 'Numeric input' },
    { id: 'date', name: 'Date', icon: Calendar, description: 'Date picker' },
    { id: 'yes_no', name: 'Yes/No', icon: ToggleLeft, description: 'Binary choice' }
  ]

  if (isLoading) {
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: '',
      required: false,
      options: getDefaultOptions(type)
    }
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const getDefaultOptions = (type) => {
    switch (type) {
      case 'rating':
        return { scale: 5, labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] }
      case 'multiple_choice':
      case 'checkbox':
        return { choices: ['Option 1', 'Option 2', 'Option 3'] }
      case 'likert':
        return { 
          statements: ['Statement 1'],
          scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }
      case 'text':
      case 'textarea':
        return { placeholder: 'Enter your response...' }
      case 'number':
        return { min: 0, max: 100 }
      default:
        return {}
    }
  }

  const updateQuestion = (questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const deleteQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    // Basic validation
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Form title is required.' })
      setIsSaving(false)
      return
    }

    if (formData.questions.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one question.' })
      setIsSaving(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMessage({ type: 'success', text: 'Feedback form created successfully!' })
      
      // Redirect after successful save
      setTimeout(() => {
        router.push('/dashboard/feedback-forms')
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create form. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const renderQuestionEditor = (question, index) => {
    return (
      <div key={question.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-teachgage-navy">Question {index + 1}</span>
          </div>
          <button
            onClick={() => deleteQuestion(question.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-teachgage-navy mb-2">
              Question Text
            </label>
            <input
              type="text"
              value={question.question}
              onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id={`required-${question.id}`}
              checked={question.required}
              onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
              className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
            />
            <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-teachgage-navy">
              Required question
            </label>
          </div>

          {/* Question-specific options */}
          {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
            <div>
              <label className="block text-sm font-medium text-teachgage-navy mb-2">
                Options
              </label>
              <div className="space-y-2">
                {question.options.choices.map((choice, choiceIndex) => (
                  <div key={choiceIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={choice}
                      onChange={(e) => {
                        const newChoices = [...question.options.choices]
                        newChoices[choiceIndex] = e.target.value
                        updateQuestion(question.id, 'options', { ...question.options, choices: newChoices })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const newChoices = question.options.choices.filter((_, i) => i !== choiceIndex)
                        updateQuestion(question.id, 'options', { ...question.options, choices: newChoices })
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newChoices = [...question.options.choices, `Option ${question.options.choices.length + 1}`]
                    updateQuestion(question.id, 'options', { ...question.options, choices: newChoices })
                  }}
                  className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue"
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}

          {question.type === 'rating' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teachgage-navy mb-2">
                  Scale (1-10)
                </label>
                <select
                  value={question.options.scale}
                  onChange={(e) => updateQuestion(question.id, 'options', { ...question.options, scale: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {(question.type === 'text' || question.type === 'textarea') && (
            <div>
              <label className="block text-sm font-medium text-teachgage-navy mb-2">
                Placeholder Text
              </label>
              <input
                type="text"
                value={question.options.placeholder}
                onChange={(e) => updateQuestion(question.id, 'options', { ...question.options, placeholder: e.target.value })}
                placeholder="Enter placeholder text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <DashboardLayout title="Preview Form">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teachgage-blue">Form Preview</h1>
            <button
              onClick={() => setPreviewMode(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-teachgage-blue mb-2">{formData.title || 'Untitled Form'}</h2>
              <p className="text-teachgage-navy">{formData.description || 'No description provided.'}</p>
            </div>

            <div className="space-y-8">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="text-lg font-medium text-teachgage-blue">
                    {index + 1}. {question.question || 'Question text'}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  
                  {/* Preview question based on type */}
                  {question.type === 'rating' && (
                    <div className="flex space-x-2">
                      {Array.from({ length: question.options.scale }, (_, i) => (
                        <Star key={i} className="w-6 h-6 text-gray-300 border border-gray-300 rounded p-1" />
                      ))}
                    </div>
                  )}
                  
                  {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
                    <div className="space-y-2">
                      {question.options.choices.map((choice, choiceIndex) => (
                        <div key={choiceIndex} className="flex items-center">
                          <input
                            type={question.type === 'multiple_choice' ? 'radio' : 'checkbox'}
                            disabled
                            className="h-4 w-4 text-teachgage-blue border-gray-300"
                          />
                          <label className="ml-2 text-teachgage-navy">{choice}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <input
                      type="text"
                      placeholder={question.options.placeholder}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  )}
                  
                  {question.type === 'textarea' && (
                    <textarea
                      placeholder={question.options.placeholder}
                      disabled
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Create Survey - TeachGage</title>
        <meta name="description" content="Create a new survey for your course" />
      </Head>

      <DashboardLayout title="Create Survey">
        <div className="max-w-6xl mx-auto space-y-6">
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
              <p className="text-teachgage-navy">Build a custom survey for your course</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setPreviewMode(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <Link href="/dashboard/feedback-forms">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </Link>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Builder */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-teachgage-blue mb-4">Basic Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Form Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="Enter form title"
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
                      placeholder="Describe the purpose of this feedback form..."
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
                        {demoCourses.map(course => (
                          <option key={course.id} value={course.id}>{course.title}</option>
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
                </form>
              </div>

              {/* Questions */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-teachgage-blue">Questions</h2>
                  <span className="text-sm text-teachgage-navy">{formData.questions.length} questions</span>
                </div>

                <div className="space-y-6">
                  {formData.questions.map((question, index) => renderQuestionEditor(question, index))}
                  
                  {formData.questions.length === 0 && (
                    <div className="text-center py-8 text-teachgage-navy">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="mb-4">No questions added yet. Choose a question type to get started.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Creating...' : 'Create Form'}
                </button>
              </div>
            </div>

            {/* Question Types Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Add Questions</h3>
                <div className="space-y-3">
                  {questionTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => addQuestion(type.id)}
                        className="w-full flex items-start p-3 border border-gray-200 rounded-lg hover:border-teachgage-blue hover:bg-gray-50 transition-colors text-left"
                      >
                        <Icon className="w-5 h-5 text-teachgage-blue mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium text-teachgage-navy">{type.name}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-teachgage-blue mb-2">Tips</h4>
                <ul className="text-sm text-teachgage-navy space-y-1">
                  <li>• Keep questions clear and concise</li>
                  <li>• Use rating scales for quantitative feedback</li>
                  <li>• Include open-ended questions for detailed insights</li>
                  <li>• Mark important questions as required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
