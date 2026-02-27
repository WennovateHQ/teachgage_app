import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { surveyAPI, questionnaireAPI } from '../../utils/api'
import { 
  CheckCircle, 
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react'

export default function SurveyResponsePage() {
  const router = useRouter()
  const { id } = router.query
  const [survey, setSurvey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const loadSurvey = async () => {
      if (!router.isReady || !id) return
      
      try {
        setLoading(true)
        const response = await surveyAPI.getSurvey(id)
        const surveyData = response.data?.survey || response.data?.data || response.data
        
        if (surveyData) {
          let questions = surveyData.questions || []
          
          // If survey has a linked questionnaire, fetch its questions
          if (surveyData.questionnaireId && questions.length === 0) {
            try {
              const qResponse = await questionnaireAPI.getQuestionnaire(surveyData.questionnaireId)
              const questionnaireData = qResponse.data?.data || qResponse.data
              questions = questionnaireData?.questions || []
            } catch (qErr) {
              console.error('Failed to load questionnaire:', qErr)
            }
          }
          
          setSurvey({ ...surveyData, questions })
          
          // Initialize responses object
          const initialResponses = {}
          questions.forEach(q => {
            initialResponses[q.questionId || q._id || q.id] = null
          })
          setResponses(initialResponses)
        }
      } catch (err) {
        console.error('Failed to load survey:', err)
        if (err.response?.status === 404) {
          setError('Survey not found')
        } else {
          setError('Failed to load survey. Please try again later.')
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadSurvey()
  }, [router.isReady, id])

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < (survey?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      
      // Format answers for submission (backend expects 'answers' field)
      const formattedAnswers = Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value
      })).filter(r => r.value !== null)
      
      await surveyAPI.submitResponse(id, { answers: formattedAnswers })
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit response:', err)
      setError('Failed to submit your response. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question) => {
    const questionId = question.questionId || question._id || question.id
    const currentValue = responses[questionId]

    switch (question.type) {
      case 'rating':
      case 'likert_scale':
        const scale = question.scale || { min: 1, max: 5 }
        const stars = []
        for (let i = scale.min; i <= scale.max; i++) {
          stars.push(
            <button
              key={i}
              type="button"
              onClick={() => handleResponseChange(questionId, i)}
              className={`p-2 transition-colors ${
                currentValue >= i 
                  ? 'text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            >
              <Star className={`w-8 h-8 ${currentValue >= i ? 'fill-current' : ''}`} />
            </button>
          )
        }
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-1">{stars}</div>
            {question.scale?.minLabel && question.scale?.maxLabel && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>{question.scale.minLabel}</span>
                <span>{question.scale.maxLabel}</span>
              </div>
            )}
          </div>
        )

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  (currentValue || []).includes(option.value || option.label)
                    ? 'border-teachgage-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={(currentValue || []).includes(option.value || option.label)}
                  onChange={(e) => {
                    const optionValue = option.value || option.label
                    if (e.target.checked) {
                      handleResponseChange(questionId, [...(currentValue || []), optionValue])
                    } else {
                      handleResponseChange(questionId, (currentValue || []).filter(v => v !== optionValue))
                    }
                  }}
                  className="w-5 h-5 text-teachgage-blue rounded"
                />
                <span className="ml-3 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'single_choice':
      case 'dropdown':
        return (
          <div className="space-y-3">
            {question.options?.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentValue === (option.value || option.label)
                    ? 'border-teachgage-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={questionId}
                  checked={currentValue === (option.value || option.label)}
                  onChange={() => handleResponseChange(questionId, option.value || option.label)}
                  className="w-5 h-5 text-teachgage-blue"
                />
                <span className="ml-3 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'text':
      default:
        return (
          <textarea
            value={currentValue || ''}
            onChange={(e) => handleResponseChange(questionId, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent resize-none"
            rows={4}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-gray-600 text-lg">
            Your feedback has been submitted successfully. We appreciate your time and input.
          </p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Survey Not Found</h1>
          <p className="text-gray-600">This survey may have been closed or doesn't exist.</p>
        </div>
      </div>
    )
  }

  const questions = survey.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const currentQuestionId = currentQuestion?.questionId || currentQuestion?._id || currentQuestion?.id
  const hasCurrentResponse = responses[currentQuestionId] !== null && responses[currentQuestionId] !== '' && 
    (Array.isArray(responses[currentQuestionId]) ? responses[currentQuestionId].length > 0 : true)

  return (
    <>
      <Head>
        <title>{survey.title} | TeachGage Survey</title>
        <meta name="description" content={survey.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
          <div 
            className="h-full bg-teachgage-blue transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{survey.title}</h1>
            {survey.description && (
              <p className="text-gray-600">{survey.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Question card */}
          {currentQuestion && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  {currentQuestion.text || currentQuestion.question}
                  {currentQuestion.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </h2>
                {currentQuestion.description && (
                  <p className="text-gray-500 text-sm">{currentQuestion.description}</p>
                )}
              </div>

              {renderQuestion(currentQuestion)}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || (currentQuestion?.required && !hasCurrentResponse)}
                className="flex items-center px-8 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentQuestion?.required && !hasCurrentResponse}
                className="flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>

          {/* Anonymous notice */}
          {survey.anonymousResponses && (
            <p className="text-center text-sm text-gray-500 mt-8">
              🔒 Your response is anonymous
            </p>
          )}
        </div>
      </div>
    </>
  )
}
