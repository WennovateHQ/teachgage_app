import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../../components/common/Breadcrumb'
import ExportControls from '../../../../components/analytics/ExportControls'
import { useAuth } from '../../../../contexts/AuthContext'
import { surveyAPI, analyticsAPI } from '../../../../utils/api'
import { formatTime } from '../../../../utils/timeUtils'
import ResponseTrendChart from '../../../../components/charts/ResponseTrendChart'
import { 
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  MessageSquare
} from 'lucide-react'

export default function SurveyAnalyticsPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [survey, setSurvey] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const loadData = async () => {
      if (!router.isReady || !id) return
      setIsLoading(true)
      setError(null)

      try {
        const [surveyRes, analyticsRes] = await Promise.allSettled([
          surveyAPI.getSurvey(id),
          analyticsAPI.getFormAnalytics(id)
        ])

        if (surveyRes.status === 'fulfilled') {
          const surveyData = surveyRes.value.data?.survey || surveyRes.value.data?.data || surveyRes.value.data
          setSurvey({
            ...surveyData,
            id: surveyData.id || surveyData._id,
            title: surveyData.title || surveyData.name || 'Untitled Survey',
            questions: surveyData.questions || []
          })
        }

        if (analyticsRes.status === 'fulfilled') {
          const data = analyticsRes.value.data?.data || analyticsRes.value.data || {}
          setAnalytics(data)
        } else {
          // If analytics API fails, set empty analytics with safe defaults
          setAnalytics({})
        }
      } catch (err) {
        console.error('Failed to load survey analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router.isReady, id])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Feedback Forms', href: '/dashboard/feedback-forms' },
    { label: survey?.title || 'Survey', href: `/dashboard/feedback-forms/${id}` },
    { label: 'Analytics' }
  ]

  // Safe analytics data extraction
  const totalResponses = analytics?.totalResponses || analytics?.responseCount || 0
  const avgRating = analytics?.averageRating || analytics?.avgRating || 0
  const responseRate = analytics?.responseRate || 0
  const avgCompletionTime = analytics?.averageCompletionTime || analytics?.avgCompletionTime || 0
  const ratingDistribution = analytics?.ratingDistribution || {}
  const questionStats = analytics?.questionStats || analytics?.perQuestion || []
  const trends = analytics?.trends || analytics?.responseTrends || []

  return (
    <>
      <Head>
        <title>{survey?.title || 'Survey'} Analytics - TeachGage</title>
      </Head>

      <DashboardLayout title="Survey Analytics">
        <div className="p-6 max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="flex items-center justify-between mb-8 mt-4">
            <div className="flex items-center space-x-4">
              <Link href={`/dashboard/feedback-forms/${id}`}>
                <span className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{survey?.title || 'Survey Analytics'}</h1>
                <p className="text-gray-500 text-sm mt-1">Detailed analytics and response insights</p>
              </div>
            </div>
            <ExportControls stats={analytics || {}} trends={trends} />
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              icon={<Users className="h-6 w-6 text-blue-500" />}
              label="Total Responses"
              value={totalResponses}
              bgColor="bg-blue-50"
            />
            <SummaryCard
              icon={<Star className="h-6 w-6 text-yellow-500" />}
              label="Average Rating"
              value={avgRating ? avgRating.toFixed(1) : '—'}
              suffix="/5"
              bgColor="bg-yellow-50"
            />
            <SummaryCard
              icon={<CheckCircle className="h-6 w-6 text-green-500" />}
              label="Response Rate"
              value={responseRate ? `${responseRate}%` : '—'}
              bgColor="bg-green-50"
            />
            <SummaryCard
              icon={<Clock className="h-6 w-6 text-purple-500" />}
              label="Avg. Completion Time"
              value={avgCompletionTime ? formatTime(avgCompletionTime) : '—'}
              bgColor="bg-purple-50"
            />
          </div>

          {/* Row 2: Rating Distribution + Response Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-teachgage-blue" />
                Rating Distribution
              </h3>
              {Object.keys(ratingDistribution).length > 0 ? (
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const pct = ratingDistribution[rating] || 0
                    return (
                      <div key={rating} className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-teachgage-blue h-3 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No rating data available yet</p>
              )}
            </div>

            {/* Response Trend */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-teachgage-blue" />
                Response Trend
              </h3>
              {trends.length > 0 ? (
                <div className="h-48">
                  <ResponseTrendChart data={trends} />
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">Not enough data to show trends yet</p>
              )}
            </div>
          </div>

          {/* Per-Question Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-teachgage-blue" />
              Per-Question Analysis
            </h3>

            {questionStats.length > 0 ? (
              <div className="space-y-4">
                {questionStats.map((qs, index) => (
                  <QuestionStatRow
                    key={qs.questionId || index}
                    index={index + 1}
                    text={qs.text || qs.questionText || `Question ${index + 1}`}
                    avgRating={qs.averageRating || qs.avgRating || 0}
                    responseCount={qs.responseCount || qs.responses || 0}
                    distribution={qs.distribution || {}}
                  />
                ))}
              </div>
            ) : survey?.questions?.length > 0 ? (
              <div className="space-y-4">
                {survey.questions.map((q, index) => (
                  <QuestionStatRow
                    key={q.questionId || q.id || index}
                    index={index + 1}
                    text={q.text || q.question || `Question ${index + 1}`}
                    avgRating={0}
                    responseCount={0}
                    distribution={{}}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No question data available</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/feedback-forms/${id}/responses`}>
              <span className="inline-flex items-center px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors cursor-pointer">
                <Users className="h-4 w-4 mr-2" />
                View All Responses
              </span>
            </Link>
            <Link href={`/dashboard/feedback-forms/${id}/edit`}>
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Edit Survey
              </span>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

function SummaryCard({ icon, label, value, suffix, bgColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value}
            {suffix && <span className="text-sm font-normal text-gray-500">{suffix}</span>}
          </p>
        </div>
      </div>
    </div>
  )
}

function QuestionStatRow({ index, text, avgRating, responseCount, distribution }) {
  const maxRating = 5
  const barWidth = avgRating > 0 ? (avgRating / maxRating) * 100 : 0

  const getBarColor = (rating) => {
    if (rating >= 4) return 'bg-green-500'
    if (rating >= 3) return 'bg-yellow-500'
    if (rating >= 2) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <span className="text-xs font-medium text-teachgage-blue mr-2">Q{index}</span>
          <span className="text-sm text-gray-800">{text}</span>
        </div>
        <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
          <span className="text-sm text-gray-500">{responseCount} responses</span>
          {avgRating > 0 && (
            <span className="text-sm font-bold text-gray-900 flex items-center">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
              {avgRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      {avgRating > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getBarColor(avgRating)}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      )}
    </div>
  )
}
