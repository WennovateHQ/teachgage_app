import { X } from 'lucide-react'

export default function QuestionTypeSelector({ questionTypes, onSelectType, onClose }) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Add Question</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        {questionTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className="w-full flex items-center p-4 text-left border border-gray-200 rounded-lg hover:border-teachgage-blue hover:bg-blue-50 transition-colors group"
          >
            <span className="text-2xl mr-3">{type.icon}</span>
            <div>
              <h4 className="font-medium text-gray-900 group-hover:text-teachgage-blue">
                {type.name}
              </h4>
              <p className="text-sm text-gray-600">
                {getQuestionTypeDescription(type.id)}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-blue-700">
          You can drag and drop questions to reorder them after adding them to your survey.
        </p>
      </div>
    </div>
  )
}

function getQuestionTypeDescription(type) {
  const descriptions = {
    multiple_choice: 'Single or multiple selection from predefined options',
    likert_scale: 'Agreement scale for multiple statements',
    rating: 'Star or numeric rating system',
    slider: 'Continuous scale with drag control',
    open_ended: 'Free text response field',
    dropdown: 'Select from dropdown menu',
    matrix: 'Grid of questions and answer options',
    rank_order: 'Drag to rank options in order of preference',
    dichotomous: 'Simple Yes/No or True/False question',
    opinion_scale: 'Numeric scale with custom labels'
  }
  
  return descriptions[type] || 'Custom question type'
}
