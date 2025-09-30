import { useState, useCallback } from 'react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import { 
  Plus, 
  Save, 
  Eye, 
  Settings, 
  Copy,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import QuestionTypeSelector from './QuestionTypeSelector'
import QuestionEditor from './QuestionEditor'
import SurveyPreview from './SurveyPreview'

export default function SurveyBuilder({ surveyId = null, initialData = null }) {
  const [survey, setSurvey] = useState(initialData || {
    title: 'Untitled Survey',
    description: '',
    questions: []
  })
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showQuestionTypes, setShowQuestionTypes] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const questionTypes = [
    { id: 'multiple_choice', name: 'Multiple Choice', icon: '☑️' },
    { id: 'likert_scale', name: 'Likert Scale', icon: '📊' },
    { id: 'rating', name: 'Rating Scale', icon: '⭐' },
    { id: 'slider', name: 'Slider', icon: '🎚️' },
    { id: 'open_ended', name: 'Open Ended', icon: '📝' },
    { id: 'dropdown', name: 'Dropdown', icon: '📋' },
    { id: 'matrix', name: 'Matrix', icon: '🔢' },
    { id: 'rank_order', name: 'Rank Order', icon: '🔢' },
    { id: 'dichotomous', name: 'Yes/No', icon: '✅' },
    { id: 'opinion_scale', name: 'Opinion Scale', icon: '💭' }
  ]

  const addQuestion = useCallback((type) => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      type,
      question: `New ${questionTypes.find(qt => qt.id === type)?.name} Question`,
      required: false,
      order: survey.questions.length,
      ...getDefaultQuestionConfig(type)
    }

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    
    setActiveQuestion(newQuestion.id)
    setShowQuestionTypes(false)
    toast.success('Question added successfully!')
  }, [survey.questions.length])

  const updateQuestion = useCallback((questionId, updates) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }))
  }, [])

  const deleteQuestion = useCallback((questionId) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
    
    if (activeQuestion === questionId) {
      setActiveQuestion(null)
    }
    
    toast.success('Question deleted successfully!')
  }, [activeQuestion])

  const duplicateQuestion = useCallback((questionId) => {
    const questionToDuplicate = survey.questions.find(q => q.id === questionId)
    if (!questionToDuplicate) return

    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: `q_${Date.now()}`,
      question: `${questionToDuplicate.question} (Copy)`,
      order: survey.questions.length
    }

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, duplicatedQuestion]
    }))
    
    toast.success('Question duplicated successfully!')
  }, [survey.questions])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setSurvey(prev => {
        const oldIndex = prev.questions.findIndex(q => q.id === active.id)
        const newIndex = prev.questions.findIndex(q => q.id === over.id)
        
        const newQuestions = arrayMove(prev.questions, oldIndex, newIndex)
        
        // Update order property
        return {
          ...prev,
          questions: newQuestions.map((q, index) => ({ ...q, order: index }))
        }
      })
    }
  }, [])

  const saveSurvey = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Survey saved successfully!')
    } catch (error) {
      toast.error('Failed to save survey')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleCollapse = (questionId) => {
    setIsCollapsed(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  if (showPreview) {
    return (
      <SurveyPreview 
        survey={survey} 
        onClose={() => setShowPreview(false)}
        onEdit={() => setShowPreview(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={survey.title}
              onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              placeholder="Survey Title"
            />
            <textarea
              value={survey.description}
              onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
              className="mt-2 text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 w-full resize-none"
              placeholder="Survey description (optional)"
              rows={2}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button
              onClick={saveSurvey}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Survey'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext 
              items={survey.questions.map(q => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {survey.questions.map((question, index) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    index={index}
                    isActive={activeQuestion === question.id}
                    isCollapsed={isCollapsed[question.id]}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                    onDuplicate={duplicateQuestion}
                    onToggleCollapse={toggleCollapse}
                    onSetActive={setActiveQuestion}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add Question Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowQuestionTypes(true)}
              className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>

          {/* Empty State */}
          {survey.questions.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first question</p>
              <button
                onClick={() => setShowQuestionTypes(true)}
                className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Question
              </button>
            </div>
          )}
        </div>

        {/* Question Types Sidebar */}
        {showQuestionTypes && (
          <QuestionTypeSelector
            questionTypes={questionTypes}
            onSelectType={addQuestion}
            onClose={() => setShowQuestionTypes(false)}
          />
        )}
      </div>
    </div>
  )
}

function getDefaultQuestionConfig(type) {
  const configs = {
    multiple_choice: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      allowMultiple: false
    },
    likert_scale: {
      statements: ['Statement 1'],
      scale: {
        min: 1,
        max: 5,
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      }
    },
    rating: {
      scale: {
        min: 1,
        max: 5,
        step: 1,
        labels: { 1: 'Poor', 5: 'Excellent' }
      }
    },
    slider: {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50
    },
    open_ended: {
      placeholder: 'Enter your response...',
      maxLength: 500
    },
    dropdown: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      placeholder: 'Select an option...'
    },
    matrix: {
      rows: ['Row 1', 'Row 2'],
      columns: ['Column 1', 'Column 2', 'Column 3']
    },
    rank_order: {
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
    },
    dichotomous: {
      yesLabel: 'Yes',
      noLabel: 'No'
    },
    opinion_scale: {
      scale: {
        min: 1,
        max: 10,
        leftLabel: 'Strongly Disagree',
        rightLabel: 'Strongly Agree'
      }
    }
  }
  
  return configs[type] || {}
}
