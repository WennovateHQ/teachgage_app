import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../components/common/Breadcrumb'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  BarChart3, 
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

export default function OrganizationAnalyticsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [analyticsData, setAnalyticsData] = useState(null)
  const [dateRange, setDateRange] = useState('30d')
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/signin')
      return
    }

    if (user && user.role !== 'organization_admin') {
      router.push('/dashboard')
      return
    }

    if (user?.organizationId) {
      loadAnalyticsData()
    }
  }, [user, isAuthenticated, isLoading, router, dateRange])

  const loadAnalyticsData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAnalytics = {
        overview: {
          totalUsers: 45,
          activeUsers: 38,
          totalCourses: 12,
          activeCourses: 9,
          totalSurveys: 24,
          completedSurveys: 18,
          averageRating: 4.2,
          responseRate: 78
        },
        trends: {
          userGrowth: 12,
          courseCompletion: 85,
          surveyParticipation: 78,
          satisfaction: 4.2
        },
        departmentStats: [
          { name: 'Computer Science', users: 18, courses: 5, surveys: 8, avgRating: 4.3 },
          { name: 'Mathematics', users: 15, courses: 4, surveys: 7, avgRating: 4.1 },
          { name: 'Physics', users: 12, courses: 3, surveys: 5, avgRating: 4.4 }
        ],
        recentActivity: [
          { type: 'course_completed', description: 'Advanced Algorithms course completed by 15 students', time: '2 hours ago' },
          { type: 'survey_submitted', description: 'Course feedback survey completed', time: '4 hours ago' },
          { type: 'user_joined', description: 'New instructor added to Mathematics department', time: '1 day ago' }
        ]
      }
      
      setAnalyticsData(mockAnalytics)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  const handleExportReport = () => {
    // Simulate report generation
    alert('Analytics report export functionality would be implemented here')
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Analytics', href: '/dashboard/organization/analytics' }
  ]

  if (isLoading || isPageLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Analytics - TeachGage</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Organization Analytics</h1>
              <p className="text-teachgage-navy">
                Insights and performance metrics for your organization
              </p>
            </div>
            
            <div className="flex space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleExportReport}
                className="inline-flex items-center px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button
                onClick={loadAnalyticsData}
                className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.totalUsers}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+{analyticsData?.trends.userGrowth}% this month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.totalCourses}</p>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-xs text-gray-500 mt-1">{analyticsData?.overview.activeCourses} active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.totalSurveys}</p>
                  <p className="text-sm text-gray-600">Total Surveys</p>
                  <p className="text-xs text-gray-500 mt-1">{analyticsData?.overview.completedSurveys} completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.averageRating}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-xs text-gray-500 mt-1">{analyticsData?.overview.responseRate}% response rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-teachgage-blue">Department Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData?.departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-teachgage-blue">{dept.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600 space-x-4">
                        <span>{dept.users} users</span>
                        <span>{dept.courses} courses</span>
                        <span>{dept.surveys} surveys</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">{dept.avgRating}</span>
                        <span className="text-sm text-gray-500 ml-1">★</span>
                      </div>
                      <p className="text-xs text-gray-500">Avg Rating</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-teachgage-blue">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData?.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Activity className="h-5 w-5 text-teachgage-blue mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
