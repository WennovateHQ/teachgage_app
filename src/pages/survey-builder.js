import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import SurveyBuilder from '../components/survey/SurveyBuilder'
import { surveyAPI } from '../utils/api'

export default function SurveyBuilderPage() {
  const router = useRouter()
  const { id } = router.query
  const [surveyData, setSurveyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSurveyData = async () => {
      if (id && id !== 'new') {
        try {
          const response = await surveyAPI.getSurvey(id)
          const data = response.data?.data || response.data || null
          if (data) {
            setSurveyData(data)
          }
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
