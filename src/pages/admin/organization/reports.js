import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  BarChart3, 
  Download, 
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  FileText,
  Filter
} from 'lucide-react'
import { analyticsAPI } from '../../../utils/api'

export default function OrganizationReportsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('last-30-days')
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await analyticsAPI.getDashboardStats()
        setReportData(response.data?.data || response.data || {})
      } catch (error) {
        console.error('Error fetching report data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReportData()
  }, [])

  const reportTypes = [
    { id: 'overview', name: 'Organization Overview', icon: BarChart3 },
    { id: 'users', name: 'User Activity', icon: Users },
    { id: 'courses', name: 'Course Performance', icon: BookOpen },
    { id: 'engagement', name: 'Engagement Metrics', icon: TrendingUp }
  ]

  const handleExportReport = async () => {
    try {
      const response = await analyticsAPI.exportData({ type: selectedReport, dateRange })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `organization-report-${selectedReport}-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      // Fallback: generate CSV from available data
      const csvData = [
        ['Metric', 'Value'],
        ['Total Users', reportData?.totalUsers || 0],
        ['Active Courses', reportData?.activeCourses || 0],
        ['Completed Surveys', reportData?.completedSurveys || 0]
      ]
      const csvContent = csvData.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `organization-report-${selectedReport}-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Organization Reports">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Reports - TeachGage Admin</title>
        <meta name="description" content="Organization reports and analytics" />
      </Head>

      <AdminLayout title="Organization Reports">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Organization Reports</h1>
              <p className="text-teachgage-navy">View detailed analytics and export reports</p>
            </div>
            <button
              onClick={handleExportReport}
              className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  {reportTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-90-days">Last 90 Days</option>
                  <option value="last-year">Last Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Report */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {reportTypes.find(r => r.id === selectedReport)?.name} Report
              </h3>
              
              {selectedReport === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Total Users</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData?.totalUsers || 0}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Active Courses</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData?.activeCourses || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Department Performance</h4>
                    <div className="space-y-2">
                      {(reportData?.departmentPerformance || []).map((dept, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{dept.name}</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-teachgage-blue h-2 rounded-full" 
                                style={{ width: `${dept.completion}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{dept.completion}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'users' && (
                <div className="space-y-4">
                  <p className="text-gray-600">User activity and engagement metrics for the selected period.</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">User Activity Summary</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>- Active users: {reportData?.activeUsers || 0}</li>
                      <li>- Total users: {reportData?.totalUsers || 0}</li>
                      <li>- Completed surveys: {reportData?.completedSurveys || 0}</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedReport === 'courses' && (
                <div className="space-y-4">
                  <p className="text-gray-600">Course performance and completion metrics.</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Course Performance</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>- Total courses: {reportData?.activeCourses || 0}</li>
                      <li>- Average response rate: {reportData?.responseRate || 'N/A'}%</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedReport === 'engagement' && (
                <div className="space-y-4">
                  <p className="text-gray-600">User engagement and interaction metrics.</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Engagement Metrics</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>- Active users: {reportData?.activeUsers || 0}</li>
                      <li>- Survey response rate: {reportData?.responseRate || 'N/A'}%</li>
                      <li>- Completed surveys: {reportData?.completedSurveys || 0}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="text-sm font-medium text-gray-900">{reportData?.responseRate || 'N/A'}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Users</span>
                    <span className="text-sm font-medium text-gray-900">{reportData?.totalUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Courses</span>
                    <span className="text-sm font-medium text-gray-900">{reportData?.activeCourses || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed Surveys</span>
                    <span className="text-sm font-medium text-gray-900">{reportData?.completedSurveys || 0}</span>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleExportReport}
                    className="w-full flex items-center justify-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </button>
                  <button
                    onClick={handleExportReport}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
