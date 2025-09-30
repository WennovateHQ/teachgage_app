import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { useResponseTrends, useDashboardStats } from '../../../hooks/useApi'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  MessageSquare,
  BarChart3,
  Calendar,
  Download
} from 'lucide-react'

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [dateRange, setDateRange] = useState('7d')

  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: trendsData, isLoading: trendsLoading } = useResponseTrends({ range: dateRange })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const stats = statsData?.data || {}
  const trends = trendsData?.data || []

  const analyticsCards = [
    {
      name: 'Total Responses',
      value: stats.totalResponses || 0,
      icon: MessageSquare,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Average Rating',
      value: (stats.averageRating || 0).toFixed(1),
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+0.3',
      changeType: 'positive'
    },
    {
      name: 'Active Forms',
      value: stats.activeForms || 0,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Response Rate',
      value: '87%',
      icon: BarChart3,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'positive'
    }
  ]

  return (
    <>
      <Head>
        <title>Analytics - TeachGage Dashboard</title>
        <meta name="description" content="View analytics and insights for your courses and feedback forms" />
      </Head>

      <DashboardLayout title="Analytics">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Track performance and insights across your courses and feedback forms</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {analyticsCards.map((card) => {
              const IconComponent = card.icon
              return (
                <div key={card.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${card.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.changeType === 'positive' ? (
                        <TrendingUp className="h-4 w-4 inline mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 inline mr-1" />
                      )}
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last period</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Response Trends Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Response Trends</h3>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64 flex items-center justify-center">
                {trendsLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
                ) : (
                  <div className="w-full">
                    {/* Simple bar chart representation */}
                    <div className="flex items-end justify-between h-48 space-x-2">
                      {trends.slice(0, 7).map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="bg-teachgage-blue rounded-t"
                            style={{ 
                              height: `${(item.responses / Math.max(...trends.map(t => t.responses))) * 100}%`,
                              width: '20px'
                            }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-2">
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teachgage-blue h-2 rounded-full"
                        style={{ width: `${rating === 5 ? 45 : rating === 4 ? 35 : rating === 3 ? 15 : rating === 2 ? 3 : 2}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8">
                      {rating === 5 ? '45%' : rating === 4 ? '35%' : rating === 3 ? '15%' : rating === 2 ? '3%' : '2%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-teachgage-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New feedback received</p>
                  <p className="text-sm text-gray-500">Photography course feedback form - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-teachgage-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Form completed</p>
                  <p className="text-sm text-gray-500">Digital Marketing evaluation - 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-teachgage-orange" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Rating improved</p>
                  <p className="text-sm text-gray-500">Course average rating increased to 4.6 - 1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
