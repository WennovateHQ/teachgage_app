import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  BookOpen, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react'

export default function OrganizationCoursesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  // Mock data
  const [courses, setCourses] = useState([
    {
      id: 'course_1',
      title: 'Introduction to Computer Science',
      code: 'CS101',
      instructor: 'Dr. Sarah Johnson',
      department: 'Computer Science',
      status: 'active',
      students: 45,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      surveys: 3,
      responseRate: 92
    },
    {
      id: 'course_2',
      title: 'Advanced Mathematics',
      code: 'MATH301',
      instructor: 'Prof. Michael Chen',
      department: 'Mathematics',
      status: 'active',
      students: 32,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      surveys: 2,
      responseRate: 87
    },
    {
      id: 'course_3',
      title: 'Physics Laboratory',
      code: 'PHYS201',
      instructor: 'Dr. Emily Rodriguez',
      department: 'Physics',
      status: 'completed',
      students: 28,
      startDate: '2024-01-15',
      endDate: '2024-05-15',
      surveys: 4,
      responseRate: 95
    }
  ])

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Business']

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || course.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleViewCourse = (courseId) => {
    router.push(`/dashboard/courses/${courseId}`)
  }

  const handleEditCourse = (courseId) => {
    router.push(`/dashboard/courses/${courseId}/edit`)
  }

  const handleDeleteCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId)
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      setCourses(prev => prev.filter(c => c.id !== courseId))
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Organization Courses">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Courses - TeachGage Admin</title>
        <meta name="description" content="Manage organization courses" />
      </Head>

      <AdminLayout title="Organization Courses">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Organization Courses</h1>
              <p className="text-teachgage-navy">Manage all courses across your organization</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/courses/create')}
              className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.reduce((sum, c) => sum + c.students, 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Avg Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(courses.reduce((sum, c) => sum + c.responseRate, 0) / courses.length)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.filter(c => c.status === 'active').length}</p>
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
                    placeholder="Search courses..."
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

          {/* Courses List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                            <span className="text-sm text-gray-500">({course.code})</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : course.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                            <span>Instructor: {course.instructor}</span>
                            <span>Department: {course.department}</span>
                            <span>Students: {course.students}</span>
                            <span>Surveys: {course.surveys}</span>
                            <span>Response Rate: {course.responseRate}%</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewCourse(course.id)}
                            className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                            title="View Course"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditCourse(course.id)}
                            className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                            title="Edit Course"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Course"
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
