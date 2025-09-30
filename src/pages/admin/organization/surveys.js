import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  BarChart3, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function OrganizationSurveysPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  // Mock data
  const [surveys, setSurveys] = useState([
    {
      id: 'survey_1',
      title: 'Mid-Semester Evaluation - CS101',
      course: 'Introduction to Computer Science',
      instructor: 'Dr. Sarah Johnson',
      department: 'Computer Science',
      status: 'active',
      responses: 42,
      totalStudents: 45,
      responseRate: 93,
      createdDate: '2024-10-01',
      dueDate: '2024-10-15'
    },
    {
      id: 'survey_2',
      title: 'Course Feedback - MATH301',
      course: 'Advanced Mathematics',
      instructor: 'Prof. Michael Chen',
      department: 'Mathematics',
      status: 'completed',
      responses: 28,
      totalStudents: 32,
      responseRate: 87,
      createdDate: '2024-09-15',
      dueDate: '2024-09-30'
    },
    {
      id: 'survey_3',
      title: 'Lab Experience Survey - PHYS201',
      course: 'Physics Laboratory',
      instructor: 'Dr. Emily Rodriguez',
      department: 'Physics',
      status: 'draft',
      responses: 0,
      totalStudents: 28,
      responseRate: 0,
      createdDate: '2024-10-05',
      dueDate: '2024-10-20'
    }
  ])

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Business']

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = searchTerm === '' || 
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || survey.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleViewSurvey = (surveyId) => {
    router.push(`/dashboard/feedback-forms/${surveyId}`)
  }

  const handleEditSurvey = (surveyId) => {
    router.push(`/dashboard/feedback-forms/${surveyId}/edit`)
  }

  const handleDeleteSurvey = (surveyId) => {
    const survey = surveys.find(s => s.id === surveyId)
    if (window.confirm(`Are you sure you want to delete "${survey.title}"?`)) {
      setSurveys(prev => prev.filter(s => s.id !== surveyId))
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Organization Surveys">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Surveys - TeachGage Admin</title>
        <meta name="description" content="Manage organization surveys" />
      </Head>

      <AdminLayout title="Organization Surveys">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Organization Surveys</h1>
              <p className="text-teachgage-navy">Manage all surveys across your organization</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/feedback-forms/create')}
              className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Survey
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Surveys</p>
                  <p className="text-2xl font-bold text-gray-900">{surveys.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{surveys.reduce((sum, s) => sum + s.responses, 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Avg Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(surveys.reduce((sum, s) => sum + s.responseRate, 0) / surveys.length)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Surveys</p>
                  <p className="text-2xl font-bold text-gray-900">{surveys.filter(s => s.status === 'active').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search surveys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="sm:w-48">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Surveys List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              {filteredSurveys.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSurveys.map((survey) => (
                    <div key={survey.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              survey.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : survey.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                            <span>Course: {survey.course}</span>
                            <span>Instructor: {survey.instructor}</span>
                            <span>Department: {survey.department}</span>
                          </div>
                          <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                            <span>Responses: {survey.responses}/{survey.totalStudents}</span>
                            <span>Response Rate: {survey.responseRate}%</span>
                            <span>Due: {new Date(survey.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-teachgage-blue h-2 rounded-full" 
                                style={{ width: `${survey.responseRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewSurvey(survey.id)}
                            className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                            title="View Survey"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditSurvey(survey.id)}
                            className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                            title="Edit Survey"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSurvey(survey.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Survey"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
