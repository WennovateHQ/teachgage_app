import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { questionnaireAPI } from '../../../utils/api'
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
  Type,
  List,
  AlignLeft,
  Sliders,
  Grid3X3,
  ArrowUpDown,
  Image,
  Calendar,
  Upload,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

const QUESTION_TYPES = [
  { id: 'multiple_choice', label: 'Multiple Choice', icon: CheckSquare, description: 'Single or multiple answer selection' },
  { id: 'single_choice', label: 'Single Choice', icon: List, description: 'Select one answer from options' },
  { id: 'likert_scale', label: 'Likert Scale', icon: Sliders, description: 'Agreement scale (Strongly Disagree to Strongly Agree)' },
  { id: 'rating', label: 'Rating', icon: Star, description: 'Star or numeric rating' },
  { id: 'text', label: 'Open Text', icon: Type, description: 'Short or long text response' },
  { id: 'dropdown', label: 'Dropdown', icon: List, description: 'Select from dropdown list' },
  { id: 'matrix', label: 'Matrix', icon: Grid3X3, description: 'Grid of questions with same options' },
  { id: 'ranking', label: 'Ranking', icon: ArrowUpDown, description: 'Rank items in order' },
  { id: 'slider', label: 'Slider', icon: Sliders, description: 'Numeric slider input' },
]

const PURPOSE_OPTIONS = [
  { value: 'teaching_assessment', label: 'Teaching Assessment' },
  { value: 'coaching_feedback', label: 'Coaching Feedback' },
  { value: 'peer_review', label: 'Peer Review' },
  { value: 'self_assessment', label: 'Self Assessment' },
  { value: 'student_feedback', label: 'Student Feedback' },
  { value: 'custom', label: 'Custom' },
]

export default function CreateQuestionnairePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [previewMode, setPreviewMode] = useState(false)
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purpose: 'custom',
    visibility: 'private',
    status: 'draft',
    questions: []
  })

  const addQuestion = (type) => {
    const questionId = `q_${Date.now()}`
    const newQuestion = {
      questionId,
      text: '',
      type,
      category: 'general',
      required: true,
      order: formData.questions.length + 1,
      options: type === 'multiple_choice' || type === 'single_choice' || type === 'dropdown'
        ? [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]
        : [],
      scale: type === 'likert_scale' || type === 'rating' || type === 'slider'
        ? { min: 1, max: 5, minLabel: 'Poor', maxLabel: 'Excellent' }
        : undefined,
      rows: type === 'matrix'
        ? [{ id: 'r1', text: 'Row 1' }]
        : undefined
    }
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setShowQuestionTypeSelector(false)
  }

  const updateQuestion = (questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.questionId === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const deleteQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.questionId !== questionId)
        .map((q, i) => ({ ...q, order: i + 1 }))
    }))
  }

  const addOption = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.questionId === questionId) {
          const newIndex = (q.options?.length || 0) + 1
          return {
            ...q,
            options: [...(q.options || []), { value: String(newIndex), label: `Option ${newIndex}` }]
          }
        }
        return q
      })
    }))
  }

  const updateOption = (questionId, optionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.questionId === questionId) {
          const newOptions = [...(q.options || [])]
          newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value }
          return { ...q, options: newOptions }
        }
        return q
      })
    }))
  }

  const removeOption = (questionId, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.questionId === questionId) {
          return { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
        }
        return q
      })
    }))
  }

  const handleSubmit = async (e, overrideStatus = null) => {
    e?.preventDefault()
    
    // Prevent double submission
    if (isSaving) return
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    // Use override status if provided, otherwise use formData status
    const submitData = overrideStatus 
      ? { ...formData, status: overrideStatus }
      : formData

    if (!submitData.title.trim()) {
      setMessage({ type: 'error', text: 'Questionnaire title is required.' })
      setIsSaving(false)
      return
    }

    if (submitData.questions.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one question.' })
      setIsSaving(false)
      return
    }

    // Validate all questions have text
    const emptyQuestions = submitData.questions.filter(q => !q.text?.trim())
    if (emptyQuestions.length > 0) {
      setMessage({ type: 'error', text: 'All questions must have text.' })
      setIsSaving(false)
      return
    }

    try {
      await questionnaireAPI.createQuestionnaire(submitData)
      setMessage({ type: 'success', text: 'Questionnaire created successfully!' })
      setTimeout(() => {
        router.push('/dashboard/questionnaires')
      }, 1500)
    } catch (error) {
      console.error('Failed to create questionnaire:', error)
      setMessage({ type: 'error', text: error.response?.data?.error?.message || error.response?.data?.message || 'Failed to create questionnaire.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAsDraft = () => {
    if (isSaving) return
    handleSubmit(null, 'draft')
  }

  const handlePublish = () => {
    if (isSaving) return
    handleSubmit(null, 'published')
  }

  const renderQuestionEditor = (question, index) => {
    const TypeIcon = QUESTION_TYPES.find(t => t.id === question.type)?.icon || Type
    const hasOptions = ['multiple_choice', 'single_choice', 'dropdown'].includes(question.type)
    const hasScale = ['likert_scale', 'rating', 'slider'].includes(question.type)

    return (
      <div key={question.questionId} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-teachgage-blue/30 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="cursor-grab text-gray-300 hover:text-gray-500">
              <GripVertical className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-teachgage-navy bg-blue-50 px-2 py-1 rounded">
              Q{index + 1}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              <TypeIcon className="w-3 h-3" />
              {QUESTION_TYPES.find(t => t.id === question.type)?.label || question.type}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(question.questionId, 'required', e.target.checked)}
                className="rounded border-gray-300 text-teachgage-blue focus:ring-teachgage-blue"
              />
              Required
            </label>
            <button
              onClick={() => deleteQuestion(question.questionId)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <input
            type="text"
            value={question.text}
            onChange={(e) => updateQuestion(question.questionId, 'text', e.target.value)}
            placeholder="Enter your question text..."
            className="w-full text-base font-medium border-0 border-b-2 border-gray-200 focus:border-teachgage-blue focus:ring-0 px-0 py-2 placeholder-gray-400"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <select
            value={question.category}
            onChange={(e) => updateQuestion(question.questionId, 'category', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:ring-2 focus:ring-teachgage-blue"
          >
            <option value="general">General</option>
            <option value="content_delivery">Content Delivery</option>
            <option value="communication">Communication</option>
            <option value="emotional_intelligence">Emotional Intelligence</option>
            <option value="engagement">Student Engagement</option>
            <option value="feedback_motivation">Feedback & Motivation</option>
            <option value="session_structure">Session Structure</option>
          </select>
        </div>

        {/* Options (for multiple choice, single choice, dropdown) */}
        {hasOptions && (
          <div className="space-y-2 mb-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Options</label>
            {(question.options || []).map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                <input
                  type="text"
                  value={opt.label}
                  onChange={(e) => updateOption(question.questionId, optIdx, 'label', e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teachgage-blue"
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => removeOption(question.questionId, optIdx)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addOption(question.questionId)}
              className="flex items-center gap-1.5 text-sm text-teachgage-blue hover:text-teachgage-dark-blue"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>
        )}

        {/* Scale Settings (for likert, rating, slider) */}
        {hasScale && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-xs text-gray-500">Min</label>
              <input
                type="number"
                value={question.scale?.min || 1}
                onChange={(e) => updateQuestion(question.questionId, 'scale', { ...question.scale, min: parseInt(e.target.value) })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teachgage-blue"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max</label>
              <input
                type="number"
                value={question.scale?.max || 5}
                onChange={(e) => updateQuestion(question.questionId, 'scale', { ...question.scale, max: parseInt(e.target.value) })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teachgage-blue"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Min Label</label>
              <input
                type="text"
                value={question.scale?.minLabel || ''}
                onChange={(e) => updateQuestion(question.questionId, 'scale', { ...question.scale, minLabel: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teachgage-blue"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max Label</label>
              <input
                type="text"
                value={question.scale?.maxLabel || ''}
                onChange={(e) => updateQuestion(question.questionId, 'scale', { ...question.scale, maxLabel: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teachgage-blue"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Create Questionnaire">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Create Questionnaire">
      <Head>
        <title>Create Questionnaire | TeachGage</title>
      </Head>

      <form id="questionnaire-form" onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/questionnaires"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create Questionnaire</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {previewMode ? <EyeOff className="w-4 h-4 mr-1.5" /> : <Eye className="w-4 h-4 mr-1.5" />}
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 text-sm bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {isSaving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {/* Questionnaire Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Questionnaire Details</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., End of Semester Teaching Evaluation"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose of this questionnaire..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  {PURPOSE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="private">Private (Only you)</option>
                  <option value="organization">Organization</option>
                  <option value="department">Department</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Questions ({formData.questions.length})
            </h2>
          </div>

          {formData.questions.map((question, index) => renderQuestionEditor(question, index))}

          {/* Add Question Button */}
          {showQuestionTypeSelector ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-teachgage-blue/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Select Question Type</h3>
                <button
                  type="button"
                  onClick={() => setShowQuestionTypeSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {QUESTION_TYPES.map(type => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => addQuestion(type.id)}
                      className="flex items-start gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-teachgage-blue hover:bg-blue-50/50 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-teachgage-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowQuestionTypeSelector(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-teachgage-blue hover:text-teachgage-blue hover:bg-blue-50/30 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          )}
        </div>
      </form>
    </DashboardLayout>
  )
}
