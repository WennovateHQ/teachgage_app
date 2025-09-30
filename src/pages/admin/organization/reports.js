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

export default function OrganizationReportsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('last-30-days')

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const reportTypes = [
    { id: 'overview', name: 'Organization Overview', icon: BarChart3 },
    { id: 'users', name: 'User Activity', icon: Users },
    { id: 'courses', name: 'Course Performance', icon: BookOpen },
    { id: 'engagement', name: 'Engagement Metrics', icon: TrendingUp }
  ]

  const handleExportReport = () => {
    // Generate mock CSV data
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ['Total Users', '156', '+15%'],
      ['Active Courses', '34', '+12%'],
      ['Completed Surveys', '89', '+28%'],
      ['Department Count', '8', '+2']
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
                          <p className="text-2xl font-bold text-gray-900">156</p>
                          <p className="text-sm text-green-600">+15% from last month</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Active Courses</p>
                          <p className="text-2xl font-bold text-gray-900">34</p>
                          <p className="text-sm text-green-600">+12% from last month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Department Performance</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Computer Science', completion: 92 },
                        { name: 'Engineering', completion: 87 },
                        { name: 'Mathematics', completion: 95 },
                        { name: 'Physics', completion: 89 }
                      ].map((dept, index) => (
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
                      <li>• Active users: 142 (91% of total)</li>
                      <li>• New registrations: 23</li>
                      <li>• Course completions: 67</li>
                      <li>• Survey responses: 234</li>
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
                      <li>• Total courses: 34</li>
                      <li>• Average completion rate: 88%</li>
                      <li>• Most popular course: Introduction to Computer Science</li>
                      <li>• Highest rated course: Advanced Mathematics</li>
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
                      <li>• Average session duration: 24 minutes</li>
                      <li>• Daily active users: 89</li>
                      <li>• Survey response rate: 76%</li>
                      <li>• Course interaction rate: 82%</li>
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
                    <span className="text-sm font-medium text-gray-900">76%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. Course Rating</span>
                    <span className="text-sm font-medium text-gray-900">4.2/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Instructors</span>
                    <span className="text-sm font-medium text-gray-900">142</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-sm font-medium text-gray-900">88%</span>
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
