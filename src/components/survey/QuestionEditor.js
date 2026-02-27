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
  X,
  GitBranch
} from 'lucide-react'

export default function QuestionEditor({ 
  question, 
  index, 
  isActive, 
  isCollapsed,
  allQuestions = [],
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onToggleCollapse,
  onSetActive 
}) {
  const [showLogic, setShowLogic] = useState(false)
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

              <button
                onClick={() => setShowLogic(!showLogic)}
                className={`flex items-center text-sm font-medium transition-colors ${
                  question.conditionalLogic?.enabled
                    ? 'text-teachgage-blue'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <GitBranch className="h-4 w-4 mr-1" />
                Logic
                {question.conditionalLogic?.enabled && (
                  <span className="ml-1 w-2 h-2 bg-teachgage-blue rounded-full inline-block" />
                )}
              </button>
            </div>
          </div>

          {/* Conditional Logic Panel */}
          {showLogic && (
            <ConditionalLogicPanel
              question={question}
              allQuestions={allQuestions}
              onUpdate={handleQuestionChange}
            />
          )}
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
    opinion_scale: 'Opinion Scale',
    nps: 'Net Promoter Score',
    demographic: 'Demographic'
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

    case 'matrix':
      return (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Rows (Items to evaluate)</label>
              <button onClick={() => handleQuestionChange('rows', [...(question.rows || []), `Row ${(question.rows?.length || 0) + 1}`])} className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"><Plus className="h-4 w-4 mr-1" />Add Row</button>
            </div>
            <div className="space-y-2">
              {(question.rows || []).map((row, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input type="text" value={row} onChange={(e) => { const r = [...(question.rows || [])]; r[i] = e.target.value; handleQuestionChange('rows', r) }} className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder={`Row ${i + 1}`} />
                  {(question.rows || []).length > 1 && <button onClick={() => handleQuestionChange('rows', (question.rows || []).filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Columns (Answer options)</label>
              <button onClick={() => handleQuestionChange('columns', [...(question.columns || []), `Column ${(question.columns?.length || 0) + 1}`])} className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"><Plus className="h-4 w-4 mr-1" />Add Column</button>
            </div>
            <div className="space-y-2">
              {(question.columns || []).map((col, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input type="text" value={col} onChange={(e) => { const c = [...(question.columns || [])]; c[i] = e.target.value; handleQuestionChange('columns', c) }} className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder={`Column ${i + 1}`} />
                  {(question.columns || []).length > 1 && <button onClick={() => handleQuestionChange('columns', (question.columns || []).filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>}
                </div>
              ))}
            </div>
          </div>
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <table className="text-xs w-full">
              <thead>
                <tr><th className="p-1"></th>{(question.columns || []).map((c, i) => <th key={i} className="p-1 text-center text-gray-600">{c}</th>)}</tr>
              </thead>
              <tbody>
                {(question.rows || []).map((r, i) => (
                  <tr key={i}><td className="p-1 font-medium text-gray-700">{r}</td>{(question.columns || []).map((_, j) => <td key={j} className="p-1 text-center"><input type="radio" disabled className="h-3 w-3" /></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'rank_order':
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Items to Rank</label>
            <button onClick={addOption} className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"><Plus className="h-4 w-4 mr-1" />Add Item</button>
          </div>
          <div className="space-y-2">
            {(question.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 w-6 text-center">{index + 1}.</span>
                <input type="text" value={option} onChange={(e) => updateOption(index, e.target.value)} className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder={`Item ${index + 1}`} />
                {(question.options || []).length > 2 && <button onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Respondents will drag items to rank them in order of preference.</p>
        </div>
      )

    case 'opinion_scale':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scale Min</label>
              <input type="number" value={question.scale?.min || 1} onChange={(e) => handleQuestionChange('scale', { ...question.scale, min: parseInt(e.target.value) })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scale Max</label>
              <input type="number" value={question.scale?.max || 10} onChange={(e) => handleQuestionChange('scale', { ...question.scale, max: parseInt(e.target.value) })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Left Label (Low)</label>
              <input type="text" value={question.scale?.leftLabel || ''} onChange={(e) => handleQuestionChange('scale', { ...question.scale, leftLabel: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="Strongly Disagree" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Right Label (High)</label>
              <input type="text" value={question.scale?.rightLabel || ''} onChange={(e) => handleQuestionChange('scale', { ...question.scale, rightLabel: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="Strongly Agree" />
            </div>
          </div>
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{question.scale?.leftLabel || 'Low'}</span>
              <span>{question.scale?.rightLabel || 'High'}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              {Array.from({ length: (question.scale?.max || 10) - (question.scale?.min || 1) + 1 }, (_, i) => (
                <button key={i} disabled className="w-8 h-8 rounded-full border border-gray-300 text-xs text-gray-500 flex items-center justify-center">{(question.scale?.min || 1) + i}</button>
              ))}
            </div>
          </div>
        </div>
      )

    case 'nps':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Left Label</label>
              <input type="text" value={question.scale?.leftLabel || 'Not at all likely'} onChange={(e) => handleQuestionChange('scale', { ...question.scale, leftLabel: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Right Label</label>
              <input type="text" value={question.scale?.rightLabel || 'Extremely likely'} onChange={(e) => handleQuestionChange('scale', { ...question.scale, rightLabel: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" />
            </div>
          </div>
          {/* NPS Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{question.scale?.leftLabel || 'Not at all likely'}</span>
              <span>{question.scale?.rightLabel || 'Extremely likely'}</span>
            </div>
            <div className="flex items-center justify-between">
              {Array.from({ length: 11 }, (_, i) => (
                <button key={i} disabled className={`w-8 h-8 rounded-full border text-xs flex items-center justify-center ${i <= 6 ? 'border-red-300 text-red-500' : i <= 8 ? 'border-yellow-300 text-yellow-600' : 'border-green-300 text-green-600'}`}>{i}</button>
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-gray-400">
              <span>Detractors (0-6)</span><span>Passives (7-8)</span><span>Promoters (9-10)</span>
            </div>
          </div>
        </div>
      )

    case 'demographic':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Demographic Type</label>
            <select value={question.demographicType || 'custom'} onChange={(e) => handleQuestionChange('demographicType', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent">
              <option value="custom">Custom</option>
              <option value="age">Age Range</option>
              <option value="gender">Gender</option>
              <option value="education">Education Level</option>
              <option value="experience">Years of Experience</option>
              <option value="department">Department</option>
              <option value="role">Role/Position</option>
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Options</label>
              <button onClick={addOption} className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"><Plus className="h-4 w-4 mr-1" />Add Option</button>
            </div>
            <div className="space-y-2">
              {(question.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="text" value={option} onChange={(e) => updateOption(index, e.target.value)} className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder={`Option ${index + 1}`} />
                  {(question.options || []).length > 1 && <button onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'picture_choice':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Image Options</label>
            <button onClick={() => handleQuestionChange('imageOptions', [...(question.imageOptions || []), { label: `Option ${(question.imageOptions?.length || 0) + 1}`, imageUrl: '', altText: '' }])} className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"><Plus className="h-4 w-4 mr-1" />Add Image</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(question.imageOptions || []).map((opt, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 relative">
                <button onClick={() => handleQuestionChange('imageOptions', (question.imageOptions || []).filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><X className="h-3.5 w-3.5" /></button>
                <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center mb-2 text-gray-400 text-xs">{opt.imageUrl ? <img src={opt.imageUrl} alt={opt.altText} className="max-h-full max-w-full object-contain rounded" /> : 'No image'}</div>
                <input type="text" value={opt.imageUrl || ''} onChange={(e) => { const imgs = [...(question.imageOptions || [])]; imgs[i] = { ...imgs[i], imageUrl: e.target.value }; handleQuestionChange('imageOptions', imgs) }} className="w-full p-1.5 text-xs border border-gray-300 rounded mb-1 focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="Image URL" />
                <input type="text" value={opt.label || ''} onChange={(e) => { const imgs = [...(question.imageOptions || [])]; imgs[i] = { ...imgs[i], label: e.target.value }; handleQuestionChange('imageOptions', imgs) }} className="w-full p-1.5 text-xs border border-gray-300 rounded mb-1 focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="Label" />
                <input type="text" value={opt.altText || ''} onChange={(e) => { const imgs = [...(question.imageOptions || [])]; imgs[i] = { ...imgs[i], altText: e.target.value }; handleQuestionChange('imageOptions', imgs) }} className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="Alt text (accessibility)" />
              </div>
            ))}
          </div>
          <label className="flex items-center">
            <input type="checkbox" checked={question.allowMultiple || false} onChange={(e) => handleQuestionChange('allowMultiple', e.target.checked)} className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded" />
            <span className="ml-2 text-sm text-gray-700">Allow multiple selections</span>
          </label>
        </div>
      )

    case 'file_upload':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowed File Types</label>
              <input type="text" value={(question.allowedTypes || []).join(', ')} onChange={(e) => handleQuestionChange('allowedTypes', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="pdf, docx, jpg, png" />
              <p className="text-xs text-gray-400 mt-1">Comma-separated extensions</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (MB)</label>
              <input type="number" value={question.maxFileSizeMB || 10} onChange={(e) => handleQuestionChange('maxFileSizeMB', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Instructions</label>
            <input type="text" value={question.uploadInstructions || ''} onChange={(e) => handleQuestionChange('uploadInstructions', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="Please upload a relevant document..." />
          </div>
          <label className="flex items-center">
            <input type="checkbox" checked={question.allowMultipleFiles || false} onChange={(e) => handleQuestionChange('allowMultipleFiles', e.target.checked)} className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded" />
            <span className="ml-2 text-sm text-gray-700">Allow multiple files</span>
          </label>
        </div>
      )

    case 'date_time':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date/Time Mode</label>
            <select value={question.dateTimeMode || 'date'} onChange={(e) => handleQuestionChange('dateTimeMode', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent">
              <option value="date">Date Only</option>
              <option value="time">Time Only</option>
              <option value="datetime">Date & Time</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Date</label>
              <input type="date" value={question.minDate || ''} onChange={(e) => handleQuestionChange('minDate', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Date</label>
              <input type="date" value={question.maxDate || ''} onChange={(e) => handleQuestionChange('maxDate', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder Text</label>
            <input type="text" value={question.placeholder || ''} onChange={(e) => handleQuestionChange('placeholder', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="Select a date..." />
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

// Conditional Logic Panel
function ConditionalLogicPanel({ question, allQuestions, onUpdate }) {
  const logic = question.conditionalLogic || { enabled: false, conditions: [], action: 'show', targetQuestionId: '' }

  const otherQuestions = allQuestions.filter(q => q.id !== question.id)

  const updateLogic = (updates) => {
    onUpdate('conditionalLogic', { ...logic, ...updates })
  }

  const addCondition = () => {
    const conditions = [...(logic.conditions || []), {
      questionId: otherQuestions[0]?.id || '',
      operator: 'equals',
      value: ''
    }]
    updateLogic({ conditions })
  }

  const updateCondition = (index, field, value) => {
    const conditions = [...(logic.conditions || [])]
    conditions[index] = { ...conditions[index], [field]: value }
    updateLogic({ conditions })
  }

  const removeCondition = (index) => {
    const conditions = (logic.conditions || []).filter((_, i) => i !== index)
    updateLogic({ conditions })
  }

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does not contain' }
  ]

  const getSourceQuestionOptions = (sourceId) => {
    const source = allQuestions.find(q => q.id === sourceId)
    if (!source) return []

    if (source.type === 'multiple_choice' || source.type === 'dropdown') {
      return (source.options || []).map(opt => typeof opt === 'string' ? opt : opt.label || opt.value || '')
    }
    if (source.type === 'dichotomous') {
      return [source.yesLabel || 'Yes', source.noLabel || 'No']
    }
    if (source.type === 'likert_scale' || source.type === 'rating' || source.type === 'opinion_scale' || source.type === 'nps') {
      const min = source.scale?.min || 0
      const max = source.scale?.max || (source.type === 'nps' ? 10 : 5)
      return Array.from({ length: max - min + 1 }, (_, i) => String(min + i))
    }
    return []
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <GitBranch className="h-4 w-4 mr-1.5 text-teachgage-blue" />
            Conditional Logic
          </h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={logic.enabled || false}
              onChange={(e) => updateLogic({ enabled: e.target.checked })}
              className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Enable</span>
          </label>
        </div>

        {logic.enabled && (
          <div className="space-y-3">
            {/* Action */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">This question will</span>
              <select
                value={logic.action || 'show'}
                onChange={(e) => updateLogic({ action: e.target.value })}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              >
                <option value="show">Show</option>
                <option value="hide">Hide</option>
                <option value="skip_to">Skip to</option>
              </select>
              {logic.action === 'skip_to' && (
                <select
                  value={logic.targetQuestionId || ''}
                  onChange={(e) => updateLogic({ targetQuestionId: e.target.value })}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent flex-1"
                >
                  <option value="">Select target...</option>
                  {otherQuestions.map((q, i) => (
                    <option key={q.id} value={q.id}>
                      Q{allQuestions.indexOf(q) + 1}: {(q.question || '').substring(0, 40)}
                    </option>
                  ))}
                </select>
              )}
              <span className="text-sm text-gray-600 whitespace-nowrap">when:</span>
            </div>

            {/* Conditions */}
            <div className="space-y-2">
              {(logic.conditions || []).map((condition, index) => {
                const sourceOptions = getSourceQuestionOptions(condition.questionId)
                return (
                  <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200">
                    {/* Source question */}
                    <select
                      value={condition.questionId || ''}
                      onChange={(e) => updateCondition(index, 'questionId', e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="">Select question...</option>
                      {otherQuestions.map((q) => (
                        <option key={q.id} value={q.id}>
                          Q{allQuestions.indexOf(q) + 1}: {(q.question || '').substring(0, 30)}
                        </option>
                      ))}
                    </select>

                    {/* Operator */}
                    <select
                      value={condition.operator || 'equals'}
                      onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      {operators.map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>

                    {/* Value */}
                    {sourceOptions.length > 0 ? (
                      <select
                        value={condition.value || ''}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent flex-1"
                      >
                        <option value="">Select value...</option>
                        {sourceOptions.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={condition.value || ''}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent flex-1"
                      />
                    )}

                    {/* Remove */}
                    <button
                      onClick={() => removeCondition(index)}
                      className="text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Add condition */}
            {otherQuestions.length > 0 && (
              <button
                onClick={addCondition}
                className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue flex items-center"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Condition
              </button>
            )}

            {otherQuestions.length === 0 && (
              <p className="text-xs text-gray-400">Add more questions to create conditions.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
