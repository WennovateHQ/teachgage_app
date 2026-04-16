import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { surveyAPI, questionnaireAPI } from '../../utils/api'
import { 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Clock,
  Shield
} from 'lucide-react'

export default function SurveyResponsePage() {
  const router = useRouter()
  const { token } = router.query
  const [survey, setSurvey] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSurvey = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        // First try to validate as an invitation token
        const response = await surveyAPI.validateInvitation(token);
        const surveyData = response.data?.data?.survey || response.data?.data || response.data;

        if (surveyData && (surveyData.status === 'active' || surveyData.status === 'published')) {
          setSurvey({
            ...surveyData,
            id: surveyData.id || surveyData._id,
            questions: surveyData.questions || [],
          });
        } else {
          setError('Survey not found or no longer active.');
        }
      } catch (err) {
        console.error('Token validation failed, trying as survey ID:', err);
        // If token validation fails, try loading directly as a survey ID
        try {
          const response = await surveyAPI.getSurvey(token);
          const surveyData = response.data?.survey || response.data?.data || response.data;

          if (surveyData) {
            let questions = surveyData.questions || [];
            // If survey has a linked questionnaire, fetch its questions
            if (surveyData.questionnaireId && questions.length === 0) {
              try {
                const qRes = await questionnaireAPI.getQuestionnaire(surveyData.questionnaireId);
                const qData = qRes.data?.data || qRes.data;
                questions = qData?.questions || [];
              } catch (qErr) {
                console.error('Failed to load questionnaire:', qErr);
              }
            }
            setSurvey({
              ...surveyData,
              id: surveyData.id || surveyData._id,
              questions,
            });
          } else {
            setError('Survey not found or no longer active.');
          }
        } catch (err2) {
          console.error('Failed to load survey by ID:', err2);
          setError('Survey not found or no longer active.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadSurvey();
  }, [token])

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Validate required questions
    const requiredQuestions = survey.questions.filter(q => q.required)
    const missingResponses = requiredQuestions.filter(q => !responses[q.id])
    
    if (missingResponses.length > 0) {
      setError('Please answer all required questions before submitting.')
      setIsSubmitting(false)
      return
    }

    try {
      // Format responses as answers array for backend compatibility
      const answers = Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value
      })).filter(r => r.value !== null && r.value !== undefined);

      await surveyAPI.submitResponse(survey.id, {
        token,
        answers,
        completedAt: new Date().toISOString(),
      });
      setIsCompleted(true);
    } catch (err) {
      console.error('Failed to submit survey:', err);
      setError('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teachgage-blue mx-auto mb-4"></div>
          <p className="text-teachgage-navy">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (error && !survey) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-teachgage-blue mb-2">Survey Not Available</h1>
          <p className="text-teachgage-navy mb-6">{error}</p>
          <p className="text-sm text-gray-500">If you believe this is an error, please contact the course instructor.</p>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <CheckCircle className="w-16 h-16 text-teachgage-green mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-teachgage-blue mb-2">Thank You!</h1>
          <p className="text-teachgage-navy mb-6">Your feedback has been submitted successfully. Your responses help improve the course experience for everyone.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-center text-sm text-teachgage-navy">
              <Shield className="w-4 h-4 mr-2" />
              Your responses are completely anonymous
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!survey) return null

  const currentQ = survey.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / survey.questions.length) * 100

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {Array.from({ length: question.options.scale }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleResponse(question.id, i + 1)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    responses[question.id] === i + 1
                      ? 'border-teachgage-blue bg-teachgage-blue text-white'
                      : 'border-gray-300 hover:border-teachgage-blue'
                  }`}
                >
                  <Star className={`w-6 h-6 ${responses[question.id] === i + 1 ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-teachgage-navy">
              <span>{question.options.labels[0]}</span>
              <span>{question.options.labels[question.options.labels.length - 1]}</span>
            </div>
          </div>
        )

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleResponse(question.id, choice)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  responses[question.id] === choice
                    ? 'border-teachgage-blue bg-teachgage-blue text-white'
                    : 'border-gray-300 hover:border-teachgage-blue'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        )

      case 'likert':
        return (
          <div className="space-y-6">
            {question.options.statements.map((statement, statementIndex) => (
              <div key={statementIndex} className="space-y-3">
                <p className="font-medium text-teachgage-navy">{statement}</p>
                <div className="grid grid-cols-5 gap-2">
                  {question.options.scale.map((scaleLabel, scaleIndex) => (
                    <button
                      key={scaleIndex}
                      onClick={() => {
                        const currentResponses = responses[question.id] || {}
                        handleResponse(question.id, {
                          ...currentResponses,
                          [statementIndex]: scaleIndex
                        })
                      }}
                      className={`p-2 text-xs rounded border-2 transition-colors ${
                        responses[question.id]?.[statementIndex] === scaleIndex
                          ? 'border-teachgage-blue bg-teachgage-blue text-white'
                          : 'border-gray-300 hover:border-teachgage-blue'
                      }`}
                    >
                      {scaleLabel}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'text':
        return (
          <textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder={question.options.placeholder}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent resize-none"
          />
        )

      case 'yes_no':
        return (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleResponse(question.id, 'yes')}
              className={`flex items-center px-6 py-3 rounded-lg border-2 transition-colors ${
                responses[question.id] === 'yes'
                  ? 'border-teachgage-green bg-teachgage-green text-white'
                  : 'border-gray-300 hover:border-teachgage-green'
              }`}
            >
              <ThumbsUp className="w-5 h-5 mr-2" />
              Yes
            </button>
            <button
              onClick={() => handleResponse(question.id, 'no')}
              className={`flex items-center px-6 py-3 rounded-lg border-2 transition-colors ${
                responses[question.id] === 'no'
                  ? 'border-red-500 bg-red-500 text-white'
                  : 'border-gray-300 hover:border-red-500'
              }`}
            >
              <ThumbsDown className="w-5 h-5 mr-2" />
              No
            </button>
          </div>
        )

      case 'dropdown':
        return (
          <div className="max-w-md mx-auto">
            <select
              value={responses[question.id] || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent bg-white"
            >
              <option value="">Select an option...</option>
              {(question.options?.choices || question.options || []).map((choice, index) => (
                <option key={index} value={typeof choice === 'string' ? choice : choice.value || choice.label}>
                  {typeof choice === 'string' ? choice : choice.label || choice.value}
                </option>
              ))}
            </select>
          </div>
        )

      case 'slider':
      case 'opinion_scale':
      case 'nps': {
        const min = question.options?.min ?? 0
        const max = question.options?.max ?? 10
        const currentVal = responses[question.id] ?? Math.floor((min + max) / 2)
        return (
          <div className="space-y-4 max-w-lg mx-auto">
            <input
              type="range"
              min={min}
              max={max}
              step={question.options?.step || 1}
              value={currentVal}
              onChange={(e) => handleResponse(question.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teachgage-blue"
            />
            <div className="flex justify-between text-sm text-teachgage-navy">
              <span>{question.options?.minLabel || min}</span>
              <span className="text-lg font-bold text-teachgage-blue">{responses[question.id] ?? '-'}</span>
              <span>{question.options?.maxLabel || max}</span>
            </div>
          </div>
        )
      }

      case 'matrix': {
        const rows = question.options?.rows || question.options?.statements || []
        const columns = question.options?.columns || question.options?.scale || ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b border-gray-200"></th>
                  {columns.map((col, i) => (
                    <th key={i} className="p-3 text-center text-xs font-medium text-teachgage-navy border-b border-gray-200 min-w-[80px]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-3 text-sm font-medium text-teachgage-navy">{row}</td>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="p-3 text-center">
                        <input
                          type="radio"
                          name={`matrix-${question.id}-${rowIndex}`}
                          checked={(responses[question.id] || {})[rowIndex] === colIndex}
                          onChange={() => {
                            const current = responses[question.id] || {}
                            handleResponse(question.id, { ...current, [rowIndex]: colIndex })
                          }}
                          className="w-4 h-4 text-teachgage-blue focus:ring-teachgage-blue cursor-pointer"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      case 'rank_order': {
        const items = question.options?.choices || question.options || []
        const ranked = responses[question.id] || []
        const unranked = items.filter(item => !ranked.includes(typeof item === 'string' ? item : item.value))
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Click items in the order you'd like to rank them (first click = rank 1).</p>
            {ranked.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-teachgage-navy">Your ranking:</p>
                {ranked.map((item, i) => (
                  <div key={i} className="flex items-center p-3 bg-teachgage-blue text-white rounded-lg">
                    <span className="w-6 h-6 flex items-center justify-center bg-white text-teachgage-blue rounded-full text-sm font-bold mr-3">{i + 1}</span>
                    {item}
                    <button onClick={() => handleResponse(question.id, ranked.filter((_, idx) => idx !== i))} className="ml-auto text-white/80 hover:text-white text-sm">Remove</button>
                  </div>
                ))}
              </div>
            )}
            {unranked.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">Available items:</p>
                {unranked.map((item, i) => {
                  const val = typeof item === 'string' ? item : item.value
                  return (
                    <button key={i} onClick={() => handleResponse(question.id, [...ranked, val])} className="w-full text-left p-3 rounded-lg border-2 border-gray-300 hover:border-teachgage-blue transition-colors">
                      {typeof item === 'string' ? item : item.label || item.value}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      }

      default:
        return (
          <textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent resize-none"
          />
        )
    }
  }

  return (
    <>
      <Head>
        <title>{survey.title} - TeachGage Survey</title>
        <meta name="description" content={survey.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-teachgage-blue">{survey.title}</h1>
                <p className="text-teachgage-navy mt-1">{survey.description}</p>
              </div>
              <div className="flex items-center text-sm text-teachgage-navy">
                <Clock className="w-4 h-4 mr-1" />
                <span>~5 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Anonymity Disclosure Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-1.5 bg-emerald-100 rounded-full mr-3">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Your responses are 100% anonymous
                </p>
                <p className="text-xs text-emerald-700">
                  Your identity cannot be linked to your answers. Results are aggregated and shared only in summary form.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-teachgage-navy">
                Question {currentQuestion + 1} of {survey.questions.length}
              </span>
              <span className="text-sm text-teachgage-navy">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teachgage-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-teachgage-blue mb-4">
                {currentQ.question}
                {currentQ.required && <span className="text-red-500 ml-1">*</span>}
              </h2>
              
              {renderQuestion(currentQ)}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="flex space-x-3">
                {currentQuestion < survey.questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center px-6 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-2 bg-teachgage-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Survey
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-2" />
              Your responses are completely anonymous and confidential
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
