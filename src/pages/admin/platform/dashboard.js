import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import CreateOrganizationModal from '../../../components/admin/CreateOrganizationModal'
import { 
  Users, 
  Building2, 
  BarChart3, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Globe,
  Shield
} from 'lucide-react'
import { analyticsAPI } from '../../../utils/api'

export default function PlatformDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    activeSurveys: 0,
    systemHealth: 0
  })
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [recentActivity, setRecentActivity] = useState([])
  const [systemAlerts, setSystemAlerts] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.getDashboardStats()
        const data = response.data?.data || response.data || {}
        setStats({
          totalOrganizations: data.totalOrganizations || 0,
          totalUsers: data.totalUsers || 0,
          activeSurveys: data.activeSurveys || 0,
          systemHealth: data.systemHealth || 0
        })
        setRecentActivity(data.recentActivity || [])
        setSystemAlerts(data.systemAlerts || [])
      } catch (error) {
        console.error('Error fetching platform stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const platformMetrics = [
    {
      name: 'Total Organizations',
      value: stats.totalOrganizations,
      change: '+12%',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Active Surveys',
      value: stats.activeSurveys,
      change: '+23%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      name: 'System Health',
      value: `${stats.systemHealth}%`,
      change: '+0.2%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ]


  if (loading) {
    return (
      <AdminLayout title="Platform Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Platform Dashboard - TeachGage Admin</title>
        <meta name="description" content="TeachGage platform administration dashboard" />
      </Head>

      <AdminLayout title="Platform Dashboard">
        {/* Platform Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformMetrics.map((metric) => {
            const IconComponent = metric.icon
            return (
              <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
          {/* System Alerts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {systemAlerts.length > 0 ? systemAlerts.map((alert, index) => (
                <div key={alert.id || index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`p-2 rounded-full ${
                    alert.type === 'warning' ? 'text-yellow-600 bg-yellow-100' :
                    alert.type === 'success' ? 'text-green-600 bg-green-100' :
                    'text-blue-600 bg-blue-100'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time || (alert.createdAt ? new Date(alert.createdAt).toLocaleString() : '')}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="p-2 rounded-full text-green-600 bg-green-100">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-gray-600">No active alerts</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Server className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Web Servers</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Database</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">CDN</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Degraded</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Security</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Platform Activity</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
              <div key={activity.id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Activity className="h-8 w-8 text-teachgage-blue" />
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

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center px-6 py-4 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            <Building2 className="h-5 w-5 mr-2" />
            Create Organization
          </button>
          <button 
            onClick={() => router.push('/admin/platform/users?action=bulk-import')}
            className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            Bulk User Import
          </button>
          <button 
            onClick={() => router.push('/admin/platform/reports')}
            className="flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            System Reports
          </button>
        </div>

        {/* Create Organization Modal */}
        {showCreateModal && (
          <CreateOrganizationModal 
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false)
              // Refresh data or navigate to new organization
            }}
          />
        )}
      </AdminLayout>
    </>
  )
}
