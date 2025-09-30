import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  Activity, 
  Server,
  Database,
  Globe,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SystemHealthPage() {
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchSystemHealth()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSystemHealth = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockSystemStatus = {
        overall: 'healthy',
        uptime: '99.8%',
        lastUpdate: new Date().toISOString(),
        services: [
          { name: 'Web Servers', status: 'healthy', uptime: '99.9%', responseTime: 245 },
          { name: 'Database', status: 'healthy', uptime: '99.8%', responseTime: 12 },
          { name: 'CDN', status: 'degraded', uptime: '98.5%', responseTime: 890 },
          { name: 'Email Service', status: 'healthy', uptime: '99.7%', responseTime: 156 },
          { name: 'File Storage', status: 'healthy', uptime: '99.9%', responseTime: 78 },
          { name: 'Authentication', status: 'healthy', uptime: '99.8%', responseTime: 34 }
        ]
      }

      const mockMetrics = {
        cpu: { usage: 45, trend: 'stable' },
        memory: { usage: 68, trend: 'increasing' },
        disk: { usage: 37, trend: 'stable' },
        network: { usage: 23, trend: 'decreasing' },
        activeConnections: 1247,
        requestsPerMinute: 2890,
        errorRate: 0.02,
        averageResponseTime: 245
      }

      const mockAlerts = [
        {
          id: 1,
          type: 'warning',
          service: 'CDN',
          message: 'CDN response time above threshold (890ms)',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          severity: 'medium'
        },
        {
          id: 2,
          type: 'info',
          service: 'Database',
          message: 'Database backup completed successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          severity: 'low'
        },
        {
          id: 3,
          type: 'warning',
          service: 'Memory',
          message: 'Memory usage approaching 70% threshold',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          severity: 'medium'
        }
      ]

      setSystemStatus(mockSystemStatus)
      setMetrics(mockMetrics)
      setAlerts(mockAlerts)
    } catch (error) {
      console.error('Error fetching system health:', error)
      toast.error('Failed to load system health data')
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchSystemHealth(true)
    toast('Refreshing system health data...')
  }

  const getStatusIcon = (status) => {
    const icons = {
      healthy: { icon: CheckCircle, color: 'text-green-500' },
      degraded: { icon: AlertTriangle, color: 'text-yellow-500' },
      down: { icon: XCircle, color: 'text-red-500' }
    }
    return icons[status] || icons.healthy
  }

  const getStatusBadge = (status) => {
    const badges = {
      healthy: 'bg-green-100 text-green-800',
      degraded: 'bg-yellow-100 text-yellow-800',
      down: 'bg-red-100 text-red-800'
    }
    return badges[status] || badges.healthy
  }

  const getAlertIcon = (type) => {
    const icons = {
      error: { icon: XCircle, color: 'text-red-500' },
      warning: { icon: AlertTriangle, color: 'text-yellow-500' },
      info: { icon: CheckCircle, color: 'text-blue-500' }
    }
    return icons[type] || icons.info
  }

  const getTrendIcon = (trend) => {
    const icons = {
      increasing: { icon: TrendingUp, color: 'text-red-500' },
      decreasing: { icon: TrendingDown, color: 'text-green-500' },
      stable: { icon: Activity, color: 'text-gray-500' }
    }
    return icons[trend] || icons.stable
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="System Health">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>System Health - TeachGage Admin</title>
        <meta name="description" content="System health monitoring and status dashboard" />
      </Head>

      <AdminLayout title="System Health">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
            <p className="text-gray-600">
              Monitor system status and performance metrics
              {systemStatus && (
                <span className="ml-2 text-sm">
                  Last updated: {formatTimestamp(systemStatus.lastUpdate)}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${systemStatus?.overall === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {systemStatus?.overall === 'healthy' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  System Status: {systemStatus?.overall === 'healthy' ? 'All Systems Operational' : 'Some Issues Detected'}
                </h2>
                <p className="text-gray-600">Overall uptime: {systemStatus?.uptime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CPU Usage</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.cpu.usage}%</p>
              </div>
              <div className="flex items-center">
                <Cpu className="h-8 w-8 text-blue-500 mr-2" />
                {(() => {
                  const trend = getTrendIcon(metrics?.cpu.trend)
                  const TrendIcon = trend.icon
                  return <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                })()}
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${metrics?.cpu.usage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Memory Usage</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.memory.usage}%</p>
              </div>
              <div className="flex items-center">
                <HardDrive className="h-8 w-8 text-green-500 mr-2" />
                {(() => {
                  const trend = getTrendIcon(metrics?.memory.trend)
                  const TrendIcon = trend.icon
                  return <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                })()}
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${metrics?.memory.usage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disk Usage</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.disk.usage}%</p>
              </div>
              <div className="flex items-center">
                <Database className="h-8 w-8 text-purple-500 mr-2" />
                {(() => {
                  const trend = getTrendIcon(metrics?.disk.trend)
                  const TrendIcon = trend.icon
                  return <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                })()}
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${metrics?.disk.usage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Network Usage</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.network.usage}%</p>
              </div>
              <div className="flex items-center">
                <Wifi className="h-8 w-8 text-orange-500 mr-2" />
                {(() => {
                  const trend = getTrendIcon(metrics?.network.trend)
                  const TrendIcon = trend.icon
                  return <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                })()}
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${metrics?.network.usage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
            <div className="space-y-4">
              {systemStatus?.services.map((service, index) => {
                const statusIcon = getStatusIcon(service.status)
                const StatusIcon = statusIcon.icon

                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <StatusIcon className={`h-5 w-5 ${statusIcon.color} mr-3`} />
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(service.status)}`}>
                        {service.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{service.responseTime}ms</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Connections</span>
                <span className="font-medium text-gray-900">{metrics?.activeConnections?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Requests/Minute</span>
                <span className="font-medium text-gray-900">{metrics?.requestsPerMinute?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Error Rate</span>
                <span className="font-medium text-gray-900">{metrics?.errorRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Response Time</span>
                <span className="font-medium text-gray-900">{metrics?.averageResponseTime}ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {alerts.map((alert) => {
              const alertIcon = getAlertIcon(alert.type)
              const AlertIcon = alertIcon.icon

              return (
                <div key={alert.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <AlertIcon className={`h-5 w-5 ${alertIcon.color} mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{alert.service}</p>
                      <span className="text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
