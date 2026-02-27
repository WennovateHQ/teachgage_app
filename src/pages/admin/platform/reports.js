import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Activity,
  FileText,
  Filter,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { analyticsAPI } from '../../../utils/api'

export default function SystemReportsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('30d')
  const [reportData, setReportData] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [selectedReport, dateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const response = await analyticsAPI.getDashboardStats()
      const data = response.data?.data || response.data || {}
      
      setReportData({
        overview: {
          totalUsers: data.totalUsers || 0,
          totalOrganizations: data.totalOrganizations || 0,
          totalCourses: data.totalCourses || 0,
          totalSurveys: data.totalSurveys || 0,
          activeUsers: data.activeUsers || 0,
          newUsersThisPeriod: data.newUsersThisPeriod || 0,
          growthRate: data.growthRate || 0,
          systemUptime: data.systemUptime || 0,
          averageResponseTime: data.averageResponseTime || 0,
          storageUsed: data.storageUsed || 0,
          bandwidthUsed: data.bandwidthUsed || 0
        },
        usage: data.usage || {
          dailyActiveUsers: [],
          topOrganizations: [],
          featureUsage: {}
        },
        performance: data.performance || {
          responseTime: [],
          errorRate: 0,
          uptime: 0,
          throughput: 0
        },
        billing: data.billing || {
          totalRevenue: 0,
          monthlyRecurring: 0,
          churnRate: 0,
          averageRevenuePerUser: 0,
          subscriptionBreakdown: {}
        }
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const response = await analyticsAPI.exportData({ type: selectedReport, dateRange })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Report generated and downloaded successfully!')
    } catch (error) {
      console.error('Error generating report:', error)
      // Fallback: generate CSV from available reportData
      if (reportData?.overview) {
        const csvContent = [
          ['Metric', 'Value'].join(','),
          ['Total Users', reportData.overview.totalUsers].join(','),
          ['Total Organizations', reportData.overview.totalOrganizations].join(','),
          ['Total Courses', reportData.overview.totalCourses].join(','),
          ['Active Users', reportData.overview.activeUsers].join(',')
        ].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Report exported from cached data')
      } else {
        toast.error('Failed to generate report')
      }
    } finally {
      setGenerating(false)
    }
  }

  const reportTypes = [
    { id: 'overview', label: 'System Overview', icon: BarChart3 },
    { id: 'usage', label: 'Usage Analytics', icon: Activity },
    { id: 'performance', label: 'Performance Metrics', icon: TrendingUp },
    { id: 'billing', label: 'Billing & Revenue', icon: FileText }
  ]

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ]

  if (loading) {
    return (
      <AdminLayout title="System Reports">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>System Reports - TeachGage Admin</title>
        <meta name="description" content="System reports and analytics dashboard" />
      </Head>

      <AdminLayout title="System Reports">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Report Type Selector */}
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>

            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>

            <button
              onClick={fetchReportData}
              className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </>
            )}
          </button>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {/* System Overview Report */}
          {selectedReport === 'overview' && reportData?.overview && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalUsers.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">+{reportData.overview.newUsersThisPeriod} this period</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalOrganizations}</p>
                      <p className="text-sm text-gray-600">Organizations</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">{reportData.overview.growthRate}% growth</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalCourses}</p>
                      <p className="text-sm text-gray-600">Total Courses</p>
                      <p className="text-xs text-gray-500 mt-1">{reportData.overview.totalSurveys} surveys</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{reportData.overview.systemUptime}%</p>
                      <p className="text-sm text-gray-600">System Uptime</p>
                      <p className="text-xs text-gray-500 mt-1">{reportData.overview.averageResponseTime}ms avg response</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Storage Used</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(reportData.overview.storageUsed / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{reportData.overview.storageUsed} GB</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bandwidth Used</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(reportData.overview.bandwidthUsed / 50) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{reportData.overview.bandwidthUsed} GB</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(reportData.overview.activeUsers / reportData.overview.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{reportData.overview.activeUsers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usage Analytics Report */}
          {selectedReport === 'usage' && reportData?.usage && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Usage Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Organizations */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Organizations</h3>
                  <div className="space-y-4">
                    {reportData.usage.topOrganizations.map((org, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{org.name}</p>
                          <p className="text-sm text-gray-600">{org.users} users</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-teachgage-blue h-2 rounded-full" 
                              style={{ width: `${org.usage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{org.usage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Usage */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage</h3>
                  <div className="space-y-4">
                    {Object.entries(reportData.usage.featureUsage).map(([feature, usage]) => (
                      <div key={feature} className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 capitalize">{feature}</p>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${usage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{usage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Metrics Report */}
          {selectedReport === 'performance' && reportData?.performance && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{reportData.performance.uptime}%</p>
                      <p className="text-sm text-gray-600">Uptime</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{reportData.performance.throughput}</p>
                      <p className="text-sm text-gray-600">Requests/min</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <TrendingDown className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{reportData.performance.errorRate}%</p>
                      <p className="text-sm text-gray-600">Error Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing & Revenue Report */}
          {selectedReport === 'billing' && reportData?.billing && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Billing & Revenue</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${reportData.billing.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Monthly Recurring</p>
                  <p className="text-2xl font-bold text-gray-900">${reportData.billing.monthlyRecurring.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Churn Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.billing.churnRate}%</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">ARPU</p>
                  <p className="text-2xl font-bold text-gray-900">${reportData.billing.averageRevenuePerUser}</p>
                </div>
              </div>

              {/* Subscription Breakdown */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(reportData.billing.subscriptionBreakdown).map(([tier, count]) => (
                    <div key={tier} className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600 capitalize">{tier} Plan</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
