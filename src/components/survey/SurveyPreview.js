import { useState } from 'react'
import { X, Edit3, Send } from 'lucide-react'

export default function SurveyPreview({ survey, onClose, onEdit }) {
  const [responses, setResponses] = useState({})

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Survey responses:', responses)
    // Handle survey submission
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
            {survey.description && (
              <p className="mt-2 text-gray-600">{survey.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Survey
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Survey Form */}
      <div className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {survey.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {index + 1}. {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
              </div>

              <div className="space-y-3">
                {renderQuestionInput(question, responses[question.id], (value) => 
                  handleResponseChange(question.id, value)
                )}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors font-medium"
            >
              <Send className="h-5 w-5 mr-2" />
              Submit Survey
            </button>
          </div>
        </form>

        {/* Preview Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">👁️</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">Preview Mode</h4>
              <p className="text-sm text-blue-700">
                This is how your survey will appear to respondents. Responses entered here are not saved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderQuestionInput(question, value, onChange) {
  switch (question.type) {
    case 'multiple_choice':
      return (
        <div className="space-y-2">
          {(question.options || []).map((option, index) => (
            <label key={index} className="flex items-center">
              <input
                type={question.allowMultiple ? 'checkbox' : 'radio'}
                name={question.id}
                value={option}
                checked={question.allowMultiple 
                  ? (value || []).includes(option)
                  : value === option
                }
                onChange={(e) => {
                  if (question.allowMultiple) {
                    const currentValues = value || []
                    if (e.target.checked) {
                      onChange([...currentValues, option])
                    } else {
                      onChange(currentValues.filter(v => v !== option))
                    }
                  } else {
                    onChange(option)
                  }
                }}
                className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300"
              />
              <span className="ml-2 text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )

    case 'likert_scale':
      return (
        <div className="space-y-4">
          {(question.statements || []).map((statement, statementIndex) => (
            <div key={statementIndex}>
              <p className="text-sm font-medium text-gray-700 mb-2">{statement}</p>
              <div className="flex items-center space-x-4">
                {Array.from({ length: (question.scale?.max || 5) - (question.scale?.min || 1) + 1 }, (_, i) => {
                  const scaleValue = (question.scale?.min || 1) + i
                  return (
                    <label key={i} className="flex flex-col items-center">
                      <input
                        type="radio"
                        name={`${question.id}_${statementIndex}`}
                        value={scaleValue}
                        checked={value?.[statementIndex] === scaleValue}
                        onChange={(e) => {
                          const newValue = { ...(value || {}) }
                          newValue[statementIndex] = parseInt(e.target.value)
                          onChange(newValue)
                        }}
                        className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300"
                      />
                      <span className="text-xs text-gray-600 mt-1">{scaleValue}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )

    case 'rating':
      return (
        <div className="flex items-center space-x-2">
          {Array.from({ length: question.scale?.max || 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i + 1)}
              className={`text-2xl ${
                value && value > i ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            >
              ⭐
            </button>
          ))}
          {value && (
            <span className="ml-2 text-sm text-gray-600">
              {value} out of {question.scale?.max || 5}
            </span>
          )}
        </div>
      )

    case 'slider':
      return (
        <div>
          <input
            type="range"
            min={question.min || 0}
            max={question.max || 100}
            step={question.step || 1}
            value={value || question.defaultValue || 50}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{question.min || 0}</span>
            <span className="font-medium">{value || question.defaultValue || 50}</span>
            <span>{question.max || 100}</span>
          </div>
        </div>
      )

    case 'open_ended':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Enter your response...'}
          maxLength={question.maxLength || 500}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent resize-none"
        />
      )

    case 'dropdown':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
        >
          <option value="">{question.placeholder || 'Select an option...'}</option>
          {(question.options || []).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )

    case 'dichotomous':
      return (
        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              name={question.id}
              value="yes"
              checked={value === 'yes'}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300"
            />
            <span className="ml-2 text-gray-700">{question.yesLabel || 'Yes'}</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={question.id}
              value="no"
              checked={value === 'no'}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300"
            />
            <span className="ml-2 text-gray-700">{question.noLabel || 'No'}</span>
          </label>
        </div>
      )

    case 'opinion_scale':
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{question.scale?.leftLabel || 'Strongly Disagree'}</span>
            <span className="text-sm text-gray-600">{question.scale?.rightLabel || 'Strongly Agree'}</span>
          </div>
          <div className="flex items-center justify-between">
            {Array.from({ length: (question.scale?.max || 10) - (question.scale?.min || 1) + 1 }, (_, i) => {
              const scaleValue = (question.scale?.min || 1) + i
              return (
                <label key={i} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={scaleValue}
                    checked={value === scaleValue}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300"
                  />
                  <span className="text-xs text-gray-600 mt-1">{scaleValue}</span>
                </label>
              )
            })}
          </div>
        </div>
      )

    default:
      return (
        <div className="text-center py-4 text-gray-500">
          Preview for {question.type} questions coming soon
        </div>
      )
  }
}
