import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import SurveyBuilder from '../components/survey/SurveyBuilder'

export default function SurveyBuilderPage() {
  const router = useRouter()
  const { id } = router.query
  const [surveyData, setSurveyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading survey data if editing existing survey
    const loadSurveyData = async () => {
      if (id && id !== 'new') {
        try {
          // Simulate API call to load existing survey
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Demo survey data
          setSurveyData({
            id,
            title: 'Course Evaluation Survey',
            description: 'Please provide feedback on this course',
            questions: [
              {
                id: 'q_1',
                type: 'multiple_choice',
                question: 'How would you rate this course overall?',
                required: true,
                order: 0,
                options: ['Excellent', 'Good', 'Fair', 'Poor'],
                allowMultiple: false
              },
              {
                id: 'q_2',
                type: 'likert_scale',
                question: 'Please rate the following aspects:',
                required: true,
                order: 1,
                statements: ['Course content quality', 'Instructor clarity', 'Course organization'],
                scale: {
                  min: 1,
                  max: 5,
                  labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                }
              }
            ]
          })
        } catch (error) {
          console.error('Error loading survey:', error)
        }
      }
      setLoading(false)
    }

    loadSurveyData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey builder...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Survey Builder - TeachGage</title>
        <meta name="description" content="Create and edit surveys with TeachGage's advanced survey builder" />
      </Head>

      <SurveyBuilder 
        surveyId={id !== 'new' ? id : null}
        initialData={surveyData}
      />
    </>
  )
}
