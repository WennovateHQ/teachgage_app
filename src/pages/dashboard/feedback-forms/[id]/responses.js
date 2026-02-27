import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../../components/common/Breadcrumb'
import { useAuth } from '../../../../contexts/AuthContext'
import { surveyAPI } from '../../../../utils/api'
import { 
  ArrowLeft,
  Download,
  Search,
  Filter,
  Calendar,
  Users,
  MessageSquare,
  Star,
  CheckSquare,
  FileText,
  Eye,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'

export default function SurveyResponsesPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [survey, setSurvey] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [responses, setResponses] = useState([])
  const [filteredResponses, setFilteredResponses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedResponses, setSelectedResponses] = useState([])

  useEffect(() => {
    const loadSurveyAndResponses = async () => {
      if (!router.isReady || !id) return;
      setIsLoading(true);
      try {
        const [surveyRes, responsesRes] = await Promise.allSettled([
          surveyAPI.getSurvey(id),
          surveyAPI.getResponses(id),
        ]);

        if (surveyRes.status === 'fulfilled') {
          const surveyData = surveyRes.value.data?.survey || surveyRes.value.data?.data || surveyRes.value.data;
          setSurvey({
            ...surveyData,
            id: surveyData.id || surveyData._id,
            responseCount: surveyData.responseCount || surveyData.totalResponses || 0,
            questions: surveyData.questions || [],
          });
        }

        if (responsesRes.status === 'fulfilled') {
          const responsesData = responsesRes.value.data?.data?.responses || responsesRes.value.data?.data || responsesRes.value.data?.responses || [];
          const formattedResponses = responsesData.map((r, i) => ({
            id: r.id || r._id || `response_${i + 1}`,
            submittedAt: r.submittedAt || r.createdAt || new Date().toISOString(),
            answers: r.answers || r.responses || [],
            isAnonymous: r.isAnonymous ?? r.anonymous ?? true,
          }));
          setResponses(formattedResponses);
          setFilteredResponses(formattedResponses);
        }
      } catch (error) {
        console.error('Failed to load survey responses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSurveyAndResponses();
  }, [router.isReady, id])

  useEffect(() => {
    let filtered = responses

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(response =>
        response.answers.some(answer =>
          answer.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(response => new Date(response.submittedAt) >= filterDate)
    }

    setFilteredResponses(filtered)
  }, [responses, searchTerm, dateFilter])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth/signin')
    return null
  }

  if (!survey) {
    return (
      <DashboardLayout title="Survey Not Found">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-teachgage-blue mb-2">Survey Not Found</h2>
          <p className="text-teachgage-navy mb-6">The survey you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard/feedback-forms">
            <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['Response ID', 'Submitted At', ...survey.questions.map(q => q.question)]
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(response => [
        response.id,
        format(new Date(response.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
        ...response.answers.map(answer => `"${answer.value}"`)
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${survey.title}_responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSelectResponse = (responseId) => {
    setSelectedResponses(prev => 
      prev.includes(responseId)
        ? prev.filter(id => id !== responseId)
        : [...prev, responseId]
    )
  }

  const handleSelectAll = () => {
    if (selectedResponses.length === filteredResponses.length) {
      setSelectedResponses([])
    } else {
      setSelectedResponses(filteredResponses.map(r => r.id))
    }
  }

  const getAnswerIcon = (type) => {
    switch (type) {
      case 'rating': return Star
      case 'multiple_choice': return CheckSquare
      case 'text': return MessageSquare
      default: return FileText
    }
  }

  const breadcrumbItems = [
    { name: 'Surveys', href: '/dashboard/feedback-forms', icon: MessageSquare },
    { name: survey.title, href: `/dashboard/feedback-forms/${id}` },
    { name: 'Responses' }
  ]

  return (
    <>
      <Head>
        <title>Responses - {survey.title} - TeachGage</title>
        <meta name="description" content={`View all responses for ${survey.title}`} />
      </Head>

      <DashboardLayout title={`${survey.title} - Responses`}>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-teachgage-blue">Survey Responses</h1>
                <p className="text-teachgage-navy">
                  {filteredResponses.length} of {responses.length} responses
                  {searchTerm || dateFilter !== 'all' ? ' (filtered)' : ''}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Link href={`/dashboard/feedback-forms/${id}`}>
                  <button className="inline-flex items-center px-4 py-2 text-teachgage-navy border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Survey
                  </button>
                </Link>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Responses
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    placeholder="Search in responses..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    id="dateFilter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setDateFilter('all')
                  }}
                  className="w-full px-4 py-2 text-teachgage-navy border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Responses List */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            {filteredResponses.length > 0 ? (
              <>
                {/* Bulk Actions */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedResponses.length === filteredResponses.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        {selectedResponses.length > 0 
                          ? `${selectedResponses.length} selected`
                          : 'Select all'
                        }
                      </span>
                    </div>
                    {selectedResponses.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <button className="inline-flex items-center px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Selected
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Responses */}
                <div className="divide-y divide-gray-200">
                  {filteredResponses.map((response) => (
                    <div key={response.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedResponses.includes(response.id)}
                            onChange={() => handleSelectResponse(response.id)}
                            className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                          />
                          <div>
                            <h3 className="font-medium text-teachgage-blue">
                              Response #{response.id.split('_')[1]}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Submitted {format(new Date(response.submittedAt), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {response.answers.map((answer, index) => {
                          const Icon = getAnswerIcon(answer.type)
                          return (
                            <div key={index} className="border-l-4 border-teachgage-blue pl-4">
                              <div className="flex items-start space-x-2 mb-1">
                                <Icon className="w-4 h-4 text-teachgage-blue mt-0.5" />
                                <p className="text-sm font-medium text-gray-700">
                                  {answer.question}
                                </p>
                              </div>
                              <div className="ml-6">
                                {answer.type === 'rating' ? (
                                  <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= answer.value
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">
                                      ({answer.value}/5)
                                    </span>
                                  </div>
                                ) : (
                                  <p className="text-teachgage-navy">{answer.value}</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-teachgage-blue mb-2">
                  {responses.length === 0 ? 'No Responses Yet' : 'No Matching Responses'}
                </h3>
                <p className="text-teachgage-navy mb-6">
                  {responses.length === 0 
                    ? 'Share your survey to start collecting responses.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {responses.length === 0 && (
                  <Link href={`/dashboard/feedback-forms/${id}`}>
                    <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                      <Eye className="w-4 h-4 mr-2" />
                      View Survey Details
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
