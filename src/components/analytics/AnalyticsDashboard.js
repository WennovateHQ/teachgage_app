import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar,
  Users,
  BookOpen,
  Star,
  FileText,
  PieChart,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'
import MetricsCards from './MetricsCards'
import TrendCharts from './TrendCharts'
import ResponseRateChart from './ResponseRateChart'
import PerformanceHeatmap from './PerformanceHeatmap'
import ExportControls from './ExportControls'

export default function AnalyticsDashboard({ organizationId = null, departmentId = null }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('responses')
  const [filters, setFilters] = useState({
    department: 'all',
    course: 'all',
    instructor: 'all'
  })

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, filters, organizationId, departmentId])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockAnalytics = {
        overview: {
          totalCourses: 45,
          activeSurveys: 12,
          totalResponses: 1247,
          averageRating: 4.3,
          responseRate: 87.5,
          completionRate: 92.1,
          participationGrowth: 15.2,
          satisfactionTrend: 8.7
        },
        trends: [
          { date: '2024-01-01', responses: 23, averageRating: 4.2, responseRate: 85 },
          { date: '2024-01-02', responses: 31, averageRating: 4.1, responseRate: 88 },
          { date: '2024-01-03', responses: 28, averageRating: 4.4, responseRate: 90 },
          { date: '2024-01-04', responses: 35, averageRating: 4.3, responseRate: 87 },
          { date: '2024-01-05', responses: 42, averageRating: 4.5, responseRate: 92 },
          { date: '2024-01-06', responses: 38, averageRating: 4.2, responseRate: 89 },
          { date: '2024-01-07', responses: 45, averageRating: 4.6, responseRate: 94 }
        ],
        topPerformers: [
          {
            instructorId: 'inst_1',
            name: 'Dr. Sarah Johnson',
            department: 'Computer Science',
            averageRating: 4.8,
            responseCount: 156,
            courses: 3
          },
          {
            instructorId: 'inst_2',
            name: 'Prof. Michael Chen',
            department: 'Mathematics',
            averageRating: 4.7,
            responseCount: 142,
            courses: 4
          },
          {
            instructorId: 'inst_3',
            name: 'Dr. Emily Rodriguez',
            department: 'Business',
            averageRating: 4.6,
            responseCount: 128,
            courses: 2
          }
        ],
        departmentBreakdown: [
          { name: 'Computer Science', responses: 345, rating: 4.5, courses: 12 },
          { name: 'Mathematics', responses: 298, rating: 4.3, courses: 15 },
          { name: 'Business', responses: 234, rating: 4.2, courses: 8 },
          { name: 'Physics', responses: 198, rating: 4.4, courses: 10 },
          { name: 'English', responses: 172, rating: 4.1, courses: 18 }
        ],
        responseRateByTime: [
          { hour: '8:00', rate: 45 },
          { hour: '9:00', rate: 78 },
          { hour: '10:00', rate: 92 },
          { hour: '11:00', rate: 88 },
          { hour: '12:00', rate: 65 },
          { hour: '13:00', rate: 72 },
          { hour: '14:00', rate: 85 },
          { hour: '15:00', rate: 90 },
          { hour: '16:00', rate: 82 },
          { hour: '17:00', rate: 68 }
        ],
        heatmapData: [
          { course: 'CS101', week: 1, responses: 25, rating: 4.2 },
          { course: 'CS101', week: 2, responses: 28, rating: 4.3 },
          { course: 'CS101', week: 3, responses: 22, rating: 4.1 },
          { course: 'MATH201', week: 1, responses: 32, rating: 4.5 },
          { course: 'MATH201', week: 2, responses: 35, rating: 4.4 },
          { course: 'MATH201', week: 3, responses: 30, rating: 4.6 },
          { course: 'BUS301', week: 1, responses: 18, rating: 4.0 },
          { course: 'BUS301', week: 2, responses: 20, rating: 4.2 },
          { course: 'BUS301', week: 3, responses: 16, rating: 3.9 }
        ]
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format, type) => {
    try {
      toast.loading('Preparing export...')
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.dismiss()
      toast.success(`${format.toUpperCase()} export completed!`)
      
      // In a real implementation, this would trigger a file download
      console.log(`Exporting ${type} as ${format}`)
    } catch (error) {
      toast.dismiss()
      toast.error('Export failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
            <div className="bg-gray-200 h-48 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">Unable to load analytics data. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into course evaluations and feedback
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          {/* Export Controls */}
          <ExportControls onExport={handleExport} />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
          >
            <option value="all">All Departments</option>
            <option value="cs">Computer Science</option>
            <option value="math">Mathematics</option>
            <option value="business">Business</option>
          </select>
          
          <select
            value={filters.course}
            onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
          >
            <option value="all">All Courses</option>
            <option value="active">Active Courses</option>
            <option value="completed">Completed Courses</option>
          </select>
          
          <select
            value={filters.instructor}
            onChange={(e) => setFilters(prev => ({ ...prev, instructor: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
          >
            <option value="all">All Instructors</option>
            <option value="top">Top Performers</option>
            <option value="new">New Instructors</option>
          </select>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsCards metrics={analytics.overview} />

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="responses">Responses</option>
              <option value="averageRating">Average Rating</option>
              <option value="responseRate">Response Rate</option>
            </select>
          </div>
          <TrendCharts data={analytics.trends} metric={selectedMetric} />
        </div>

        {/* Response Rate by Time */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rate by Time</h3>
          <ResponseRateChart data={analytics.responseRateByTime} />
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Responses</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Courses</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.departmentBreakdown.map((dept, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.name}</td>
                  <td className="py-3 px-4 text-gray-600">{dept.responses}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-gray-900">{dept.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{dept.courses}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-teachgage-blue h-2 rounded-full" 
                          style={{ width: `${(dept.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round((dept.rating / 5) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Instructors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.topPerformers.map((instructor, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{instructor.name}</h4>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{instructor.department}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{instructor.averageRating}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{instructor.responseCount}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{instructor.courses}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Heatmap */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance Heatmap</h3>
        <PerformanceHeatmap data={analytics.heatmapData} />
      </div>
    </div>
  )
}
