import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { useCourses, useDeleteCourse } from '../../../hooks/useApi'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  BookOpen,
  Eye
} from 'lucide-react'
import { format } from 'date-fns'

export default function CoursesPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)

  const { data: coursesData, isLoading: coursesLoading, error } = useCourses({
    search: searchTerm,
    status: filterStatus !== 'all' ? filterStatus : undefined
  })

  const deleteCourse = useDeleteCourse()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth/signin')
    return null
  }

  const handleDeleteCourse = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse.mutateAsync(courseToDelete.id)
        setShowDeleteModal(false)
        setCourseToDelete(null)
      } catch (error) {
        console.error('Error deleting course:', error)
      }
    }
  }

  // Debug: Log the data structure (remove in production)
  if (coursesData && process.env.NODE_ENV === 'development') {
    console.log('coursesData structure:', coursesData)
  }

  // Ensure courses is always an array - handle the nested data structure
  const courses = Array.isArray(coursesData?.data?.courses) 
    ? coursesData.data.courses 
    : Array.isArray(coursesData?.data) 
      ? coursesData.data 
      : Array.isArray(coursesData) 
        ? coursesData 
        : []

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.name || course.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <Head>
        <title>Courses - TeachGage</title>
        <meta name="description" content="Manage your courses" />
      </Head>

      <DashboardLayout title="Courses">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">My Courses</h1>
              <p className="text-teachgage-navy">Manage your courses and track student engagement</p>
            </div>
            <Link href="/dashboard/courses/create">
              <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">Failed to load courses. Please try again.</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BookOpen className="h-12 w-12 text-teachgage-navy mx-auto mb-4" />
              <h3 className="text-lg font-medium text-teachgage-blue mb-2">No courses found</h3>
              <p className="text-teachgage-navy mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first course.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link href="/dashboard/courses/create">
                  <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-teachgage-blue to-teachgage-medium-blue rounded-t-lg relative">
                    <div className="absolute top-4 right-4">
                      <div className="relative">
                        <button className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : course.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status?.charAt(0).toUpperCase() + course.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-teachgage-blue mb-2 line-clamp-1">
                      {course.name || course.title}
                    </h3>
                    <p className="text-teachgage-navy text-sm mb-4 line-clamp-2">
                      {course.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-teachgage-navy mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.studentCount || 0} students</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{course.createdAt ? format(new Date(course.createdAt), 'MMM d') : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Link href={`/dashboard/courses/${course.id}`}>
                        <button className="inline-flex items-center text-teachgage-blue hover:text-teachgage-medium-blue font-medium">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                      </Link>
                      
                      <div className="flex items-center space-x-2">
                        <Link href={`/dashboard/courses/${course.id}/edit`}>
                          <button className="p-2 text-teachgage-navy hover:text-teachgage-blue transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => {
                            setCourseToDelete(course)
                            setShowDeleteModal(true)
                          }}
                          className="p-2 text-teachgage-navy hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-teachgage-blue mb-4">Delete Course</h3>
              <p className="text-teachgage-navy mb-6">
                Are you sure you want to delete "{courseToDelete?.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setCourseToDelete(null)
                  }}
                  className="px-4 py-2 text-teachgage-navy bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCourse}
                  disabled={deleteCourse.isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteCourse.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  )
}
