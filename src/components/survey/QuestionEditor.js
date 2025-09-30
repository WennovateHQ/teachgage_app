import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  GripVertical, 
  Settings, 
  Copy, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Plus,
  X
} from 'lucide-react'

export default function QuestionEditor({ 
  question, 
  index, 
  isActive, 
  isCollapsed,
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onToggleCollapse,
  onSetActive 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleQuestionChange = (field, value) => {
    onUpdate(question.id, { [field]: value })
  }

  const addOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`]
    handleQuestionChange('options', newOptions)
  }

  const updateOption = (index, value) => {
    const newOptions = [...(question.options || [])]
    newOptions[index] = value
    handleQuestionChange('options', newOptions)
  }

  const removeOption = (index) => {
    const newOptions = (question.options || []).filter((_, i) => i !== index)
    handleQuestionChange('options', newOptions)
  }

  const addStatement = () => {
    const newStatements = [...(question.statements || []), `Statement ${(question.statements?.length || 0) + 1}`]
    handleQuestionChange('statements', newStatements)
  }

  const updateStatement = (index, value) => {
    const newStatements = [...(question.statements || [])]
    newStatements[index] = value
    handleQuestionChange('statements', newStatements)
  }

  const removeStatement = (index) => {
    const newStatements = (question.statements || []).filter((_, i) => i !== index)
    handleQuestionChange('statements', newStatements)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border-2 transition-colors ${
        isActive ? 'border-teachgage-blue' : 'border-gray-200'
      } ${isDragging ? 'shadow-lg' : 'shadow-sm'}`}
    >
      {/* Question Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          
          <span className="text-sm font-medium text-gray-500">
            Question {index + 1}
          </span>
          
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {getQuestionTypeName(question.type)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleCollapse(question.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => onDuplicate(question.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Duplicate Question"
          >
            <Copy className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(question.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question Content */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Question Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              value={question.question}
              onChange={(e) => handleQuestionChange('question', e.target.value)}
              onClick={() => onSetActive(question.id)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent resize-none"
              rows={2}
              placeholder="Enter your question..."
            />
          </div>

          {/* Question-specific Configuration */}
          <div className="space-y-4">
            {renderQuestionConfig(question, {
              handleQuestionChange,
              addOption,
              updateOption,
              removeOption,
              addStatement,
              updateStatement,
              removeStatement
            })}
          </div>

          {/* Question Settings */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => handleQuestionChange('required', e.target.checked)}
                  className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Required question</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getQuestionTypeName(type) {
  const names = {
    multiple_choice: 'Multiple Choice',
    likert_scale: 'Likert Scale',
    rating: 'Rating',
    slider: 'Slider',
    open_ended: 'Open Ended',
    dropdown: 'Dropdown',
    matrix: 'Matrix',
    rank_order: 'Rank Order',
    dichotomous: 'Yes/No',
    opinion_scale: 'Opinion Scale'
  }
  
  return names[type] || 'Unknown'
}

function renderQuestionConfig(question, handlers) {
  const { 
    handleQuestionChange, 
    addOption, 
    updateOption, 
    removeOption,
    addStatement,
    updateStatement,
    removeStatement
  } = handlers

  switch (question.type) {
    case 'multiple_choice':
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Options</label>
            <button
              onClick={addOption}
              className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </button>
          </div>
          <div className="space-y-2">
            {(question.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  placeholder={`Option ${index + 1}`}
                />
                {question.options.length > 1 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={question.allowMultiple}
                onChange={(e) => handleQuestionChange('allowMultiple', e.target.checked)}
                className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Allow multiple selections</span>
            </label>
          </div>
        </div>
      )

    case 'likert_scale':
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Statements</label>
            <button
              onClick={addStatement}
              className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Statement
            </button>
          </div>
          <div className="space-y-2 mb-4">
            {(question.statements || []).map((statement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={statement}
                  onChange={(e) => updateStatement(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  placeholder={`Statement ${index + 1}`}
                />
                {question.statements.length > 1 && (
                  <button
                    onClick={() => removeStatement(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scale Min</label>
              <input
                type="number"
                value={question.scale?.min || 1}
                onChange={(e) => handleQuestionChange('scale', { 
                  ...question.scale, 
                  min: parseInt(e.target.value) 
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scale Max</label>
              <input
                type="number"
                value={question.scale?.max || 5}
                onChange={(e) => handleQuestionChange('scale', { 
                  ...question.scale, 
                  max: parseInt(e.target.value) 
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )

    case 'rating':
      return (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
            <input
              type="number"
              value={question.scale?.min || 1}
              onChange={(e) => handleQuestionChange('scale', { 
                ...question.scale, 
                min: parseInt(e.target.value) 
              })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
            <input
              type="number"
              value={question.scale?.max || 5}
              onChange={(e) => handleQuestionChange('scale', { 
                ...question.scale, 
                max: parseInt(e.target.value) 
              })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Step</label>
            <input
              type="number"
              step="0.1"
              value={question.scale?.step || 1}
              onChange={(e) => handleQuestionChange('scale', { 
                ...question.scale, 
                step: parseFloat(e.target.value) 
              })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
        </div>
      )

    case 'slider':
      return (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
            <input
              type="number"
              value={question.min || 0}
              onChange={(e) => handleQuestionChange('min', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
            <input
              type="number"
              value={question.max || 100}
              onChange={(e) => handleQuestionChange('max', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
            <input
              type="number"
              value={question.defaultValue || 50}
              onChange={(e) => handleQuestionChange('defaultValue', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
        </div>
      )

    case 'open_ended':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder Text</label>
            <input
              type="text"
              value={question.placeholder || ''}
              onChange={(e) => handleQuestionChange('placeholder', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              placeholder="Enter placeholder text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
            <input
              type="number"
              value={question.maxLength || 500}
              onChange={(e) => handleQuestionChange('maxLength', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
        </div>
      )

    case 'dropdown':
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Options</label>
            <button
              onClick={addOption}
              className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </button>
          </div>
          <div className="space-y-2 mb-4">
            {(question.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  placeholder={`Option ${index + 1}`}
                />
                {question.options.length > 1 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={question.placeholder || ''}
              onChange={(e) => handleQuestionChange('placeholder', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              placeholder="Select an option..."
            />
          </div>
        </div>
      )

    case 'dichotomous':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yes Label</label>
            <input
              type="text"
              value={question.yesLabel || 'Yes'}
              onChange={(e) => handleQuestionChange('yesLabel', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Label</label>
            <input
              type="text"
              value={question.noLabel || 'No'}
              onChange={(e) => handleQuestionChange('noLabel', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
        </div>
      )

    default:
      return (
        <div className="text-center py-4 text-gray-500">
          Configuration options for {getQuestionTypeName(question.type)} will be available soon.
        </div>
      )
  }
}
