import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  Users, 
  Building2, 
  BarChart3, 
  GraduationCap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Mail,
  CreditCard,
  Calendar,
  Award
} from 'lucide-react'
import { analyticsAPI, departmentAPI } from '../../../utils/api'

export default function OrganizationDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    activeCourses: 0,
    completedSurveys: 0
  })
  const [loading, setLoading] = useState(true)

  const [recentActivities, setRecentActivities] = useState([])
  const [departmentStats, setDepartmentStats] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, deptRes] = await Promise.allSettled([
          analyticsAPI.getDashboardStats(),
          departmentAPI.getDepartments()
        ])
        if (statsRes.status === 'fulfilled') {
          const data = statsRes.value.data?.data || statsRes.value.data || {}
          setStats({
            totalUsers: data.totalUsers || 0,
            totalDepartments: data.totalDepartments || 0,
            activeCourses: data.activeCourses || 0,
            completedSurveys: data.completedSurveys || 0
          })
          setRecentActivities(data.recentActivity || [])
        }
        if (deptRes.status === 'fulfilled') {
          const depts = deptRes.value.data?.data || deptRes.value.data || []
          setDepartmentStats(Array.isArray(depts) ? depts : depts.departments || [])
        }
      } catch (error) {
        console.error('Error fetching organization stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Navigation handlers
  const handleAddUsers = () => {
    router.push('/admin/organization/users')
  }

  const handleCreateDepartment = () => {
    router.push('/admin/organization/departments')
  }

  const handleViewReports = () => {
    router.push('/admin/organization/reports')
  }

  const handleSendNotifications = () => {
    router.push('/admin/organization/notifications')
  }

  // Metric card click handlers
  const handleMetricClick = (metricName) => {
    switch (metricName) {
      case 'Total Users':
        router.push('/admin/organization/users')
        break
      case 'Departments':
        router.push('/admin/organization/departments')
        break
      case 'Active Courses':
        router.push('/admin/organization/courses')
        break
      case 'Completed Surveys':
        router.push('/admin/organization/surveys')
        break
      default:
        break
    }
  }

  const organizationMetrics = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Departments',
      value: stats.totalDepartments,
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      name: 'Active Courses',
      value: stats.activeCourses,
      icon: GraduationCap,
      color: 'bg-purple-500'
    },
    {
      name: 'Completed Surveys',
      value: stats.completedSurveys,
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ]

  if (loading) {
    return (
      <AdminLayout title="Organization Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Dashboard - TeachGage Admin</title>
        <meta name="description" content="TeachGage organization administration dashboard" />
      </Head>

      <AdminLayout title="Organization Dashboard">
        {/* Organization Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {organizationMetrics.map((metric) => {
            const IconComponent = metric.icon
            return (
              <div 
                key={metric.name} 
                onClick={() => handleMetricClick(metric.name)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-teachgage-blue transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {departmentStats.length > 0 ? departmentStats.map((dept, index) => (
                <div key={dept._id || dept.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span>{dept.userCount || dept.members?.length || 0} users</span>
                      <span>{dept.courseCount || 0} courses</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No department data available</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                <div key={activity.id || activity._id || index} className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action || activity.title || 'Activity'}</p>
                    <p className="text-sm text-gray-600">{activity.details || activity.description || ''}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{activity.time || (activity.createdAt ? new Date(activity.createdAt).toLocaleString() : '')}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={handleAddUsers}
            className="flex items-center justify-center px-6 py-4 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            Manage Users
          </button>
          <button 
            onClick={handleCreateDepartment}
            className="flex items-center justify-center px-6 py-4 bg-teachgage-green text-white rounded-lg hover:bg-teachgage-green/90 transition-colors"
          >
            <Building2 className="h-5 w-5 mr-2" />
            Departments
          </button>
          <button 
            onClick={handleViewReports}
            className="flex items-center justify-center px-6 py-4 bg-teachgage-orange text-white rounded-lg hover:bg-teachgage-orange/90 transition-colors"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            View Reports
          </button>
          <button 
            onClick={handleSendNotifications}
            className="flex items-center justify-center px-6 py-4 bg-teachgage-medium-blue text-white rounded-lg hover:bg-teachgage-blue transition-colors"
          >
            <Mail className="h-5 w-5 mr-2" />
            Notifications
          </button>
        </div>

        {/* Organization Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Subscription</h4>
              <p className="text-sm text-gray-600">Professional Plan</p>
              <p className="text-xs text-green-600 mt-1">Active until Dec 2024</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">User Limit</h4>
              <p className="text-sm text-gray-600">{stats.totalUsers} users</p>
              <p className="text-xs text-blue-600 mt-1">78% utilized</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Analytics</h4>
              <p className="text-sm text-gray-600">Advanced Features</p>
              <p className="text-xs text-purple-600 mt-1">Fully enabled</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
