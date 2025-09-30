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

export default function OrganizationDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    activeCourses: 0,
    completedSurveys: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call for organization stats
    const fetchStats = async () => {
      try {
        // Demo data for organization admin
        setStats({
          totalUsers: 156,
          totalDepartments: 8,
          activeCourses: 34,
          completedSurveys: 89
        })
      } catch (error) {
        console.error('Error fetching organization stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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
      change: '+15%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Departments',
      value: stats.totalDepartments,
      change: '+2',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      name: 'Active Courses',
      value: stats.activeCourses,
      change: '+12%',
      changeType: 'positive',
      icon: GraduationCap,
      color: 'bg-purple-500'
    },
    {
      name: 'Completed Surveys',
      value: stats.completedSurveys,
      change: '+28%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'New Department Created',
      details: 'Computer Science Department added',
      user: 'Org Admin',
      time: '15 minutes ago',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      id: 2,
      action: 'Bulk User Import',
      details: '25 new instructors added to Engineering',
      user: 'System',
      time: '1 hour ago',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 3,
      action: 'Survey Completed',
      details: 'Mid-semester evaluation for CS101',
      user: 'Dr. Smith',
      time: '2 hours ago',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      id: 4,
      action: 'Course Created',
      details: 'Advanced Machine Learning - Fall 2024',
      user: 'Prof. Johnson',
      time: '3 hours ago',
      icon: GraduationCap,
      color: 'text-orange-600'
    }
  ]

  const departmentStats = [
    { name: 'Computer Science', users: 45, courses: 12, completion: 92 },
    { name: 'Engineering', users: 38, courses: 8, completion: 87 },
    { name: 'Mathematics', users: 32, courses: 15, completion: 95 },
    { name: 'Physics', users: 28, courses: 10, completion: 89 },
    { name: 'Business', users: 13, courses: 6, completion: 78 }
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
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 inline mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 inline mr-1" />
                    )}
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
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
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                      <span className="text-sm text-gray-600">{dept.completion}%</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span>{dept.users} users</span>
                      <span>{dept.courses} courses</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teachgage-blue h-2 rounded-full" 
                        style={{ width: `${dept.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <IconComponent className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>By {activity.user}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
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
              <p className="text-sm text-gray-600">156 / 200 users</p>
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
