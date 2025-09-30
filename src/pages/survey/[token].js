import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { demoSurveys } from '../../data/demoData'
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
    if (token) {
      // Simulate token validation and survey loading
      setTimeout(() => {
        // For demo purposes, use the first survey
        const surveyData = demoSurveys[0]
        if (surveyData && surveyData.status === 'active') {
          setSurvey({
            ...surveyData,
            questions: [
              {
                id: 1,
                type: 'rating',
                question: 'How would you rate the overall quality of this course?',
                required: true,
                options: { scale: 5, labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] }
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'Which aspect of the course did you find most valuable?',
                required: true,
                options: {
                  choices: [
                    'Course content and materials',
                    'Instructor teaching style',
                    'Practical exercises and assignments',
                    'Class discussions and interactions',
                    'Assessment methods'
                  ]
                }
              },
              {
                id: 3,
                type: 'likert',
                question: 'Please indicate your level of agreement with the following statements:',
                required: true,
                options: {
                  statements: [
                    'The course objectives were clearly defined',
                    'The instructor was well-prepared for classes',
                    'The workload was appropriate for the course level',
                    'I would recommend this course to other students'
                  ],
                  scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                }
              },
              {
                id: 4,
                type: 'text',
                question: 'What suggestions do you have for improving this course?',
                required: false,
                options: { placeholder: 'Please share your thoughts and suggestions...' }
              },
              {
                id: 5,
                type: 'yes_no',
                question: 'Would you recommend this course to other students?',
                required: true
              }
            ]
          })
        } else {
          setError('Survey not found or no longer active.')
        }
        setIsLoading(false)
      }, 1000)
    }
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
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsCompleted(true)
    } catch (error) {
      setError('Failed to submit survey. Please try again.')
    } finally {
      setIsSubmitting(false)
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

      default:
        return <div>Unsupported question type</div>
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
