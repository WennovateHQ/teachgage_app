'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { demoSurveys } from '@/data/demoData';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export default function SurveyResponseInterface({ surveyId, token }) {
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  // Load survey data
  useEffect(() => {
    const loadSurvey = () => {
      // In a real app, this would validate the token and fetch the survey
      const surveyData = demoSurveys.find(s => s.id === surveyId);
      
      if (!surveyData) {
        alert('Survey not found or invalid token');
        return;
      }

      setSurvey(surveyData);
      
      // Initialize responses object
      const initialResponses = {};
      surveyData.questions.forEach(question => {
        if (question.type === 'likert_scale') {
          initialResponses[question.id] = {};
        } else {
          initialResponses[question.id] = '';
        }
      });
      setResponses(initialResponses);
    };

    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Handle response change
  const handleResponseChange = (questionId, value, subKey = null) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      
      if (subKey) {
        // For likert scale questions
        newResponses[questionId] = {
          ...newResponses[questionId],
          [subKey]: value
        };
      } else {
        newResponses[questionId] = value;
      }
      
      return newResponses;
    });

    // Clear validation error
    if (validationErrors[questionId]) {
      setValidationErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };

  // Validate current question
  const validateQuestion = (question) => {
    const response = responses[question.id];
    
    if (question.required) {
      if (question.type === 'likert_scale') {
        const statements = question.statements || [];
        const missingStatements = statements.filter(statement => 
          !response[statement] || response[statement] === ''
        );
        
        if (missingStatements.length > 0) {
          return `Please rate all statements`;
        }
      } else if (!response || response === '') {
        return 'This question is required';
      }
    }
    
    return null;
  };

  // Navigate to next question
  const nextQuestion = () => {
    const currentQuestion = survey.questions[currentQuestionIndex];
    const error = validateQuestion(currentQuestion);
    
    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [currentQuestion.id]: error
      }));
      return;
    }

    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit survey
  const handleSubmit = async () => {
    // Validate all required questions
    const errors = {};
    survey.questions.forEach(question => {
      const error = validateQuestion(question);
      if (error) {
        errors[question.id] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Go to first question with error
      const firstErrorIndex = survey.questions.findIndex(q => errors[q.id]);
      setCurrentQuestionIndex(firstErrorIndex);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Prepare response data
      const responseData = {
        surveyId,
        responses: Object.entries(responses).map(([questionId, answer]) => {
          const question = survey.questions.find(q => q.id === questionId);
          return {
            questionId,
            answer,
            type: question.type
          };
        }),
        anonymous: survey.anonymousResponses,
        completedAt: new Date().toISOString(),
        timeSpent
      };

      console.log('Survey response submitted:', responseData);
      
      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to submit survey:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render question based on type
  const renderQuestion = (question) => {
    const response = responses[question.id];
    const error = validationErrors[question.id];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type={question.allowMultiple ? 'checkbox' : 'radio'}
                  name={question.id}
                  value={option}
                  checked={question.allowMultiple 
                    ? (Array.isArray(response) ? response.includes(option) : false)
                    : response === option
                  }
                  onChange={(e) => {
                    if (question.allowMultiple) {
                      const currentArray = Array.isArray(response) ? response : [];
                      const newArray = e.target.checked
                        ? [...currentArray, option]
                        : currentArray.filter(item => item !== option);
                      handleResponseChange(question.id, newArray);
                    } else {
                      handleResponseChange(question.id, option);
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'likert_scale':
        return (
          <div className="space-y-6">
            {question.statements.map((statement, index) => (
              <div key={index}>
                <p className="text-gray-700 mb-3">{statement}</p>
                <div className="flex justify-between items-center">
                  {question.scale.labels.map((label, labelIndex) => (
                    <label key={labelIndex} className="flex flex-col items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`${question.id}_${statement}`}
                        value={labelIndex + question.scale.min}
                        checked={response[statement] == labelIndex + question.scale.min}
                        onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value), statement)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mb-2"
                      />
                      <span className="text-xs text-gray-500 text-center">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'rating':
        const maxRating = question.scale?.max || 5;
        return (
          <div className="flex justify-center space-x-2">
            {[...Array(maxRating)].map((_, index) => {
              const rating = index + 1;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleResponseChange(question.id, rating)}
                  className={`p-2 transition-colors ${
                    response >= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              );
            })}
          </div>
        );

      case 'dichotomous':
        return (
          <div className="flex justify-center space-x-8">
            {question.options.map((option, index) => {
              const isYes = option.toLowerCase().includes('yes') || option.toLowerCase().includes('true');
              const Icon = isYes ? ThumbsUp : ThumbsDown;
              const colorClass = isYes ? 'text-green-600' : 'text-red-600';
              
              return (
                <label key={index} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={response === option}
                    onChange={(e) => handleResponseChange(question.id, option)}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-full border-2 transition-colors ${
                    response === option 
                      ? `border-current ${colorClass} bg-opacity-10` 
                      : 'border-gray-300 text-gray-400 hover:border-gray-400'
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="mt-2 text-sm text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'open_ended':
        return (
          <textarea
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please share your thoughts..."
          />
        );

      case 'dropdown':
        return (
          <select
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an option...</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return (
          <div className="text-gray-500 italic">
            Question type "{question.type}" not yet implemented
          </div>
        );
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your response has been submitted successfully.
          </p>
          <div className="text-sm text-gray-500">
            <p>Time spent: {formatTime(timeSpent)}</p>
            {survey.anonymousResponses && (
              <p className="mt-1">Your response was submitted anonymously.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{survey.title}</h1>
              <p className="text-sm text-gray-500">{survey.description}</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timeSpent)}
              </div>
              {survey.anonymousResponses && (
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Anonymous
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestionIndex + 1} of {survey.questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              {currentQuestion.question}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600">{currentQuestion.description}</p>
            )}
          </div>

          <div className="mb-6">
            {renderQuestion(currentQuestion)}
          </div>

          {validationErrors[currentQuestion.id] && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {validationErrors[currentQuestion.id]}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            {currentQuestionIndex === survey.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
