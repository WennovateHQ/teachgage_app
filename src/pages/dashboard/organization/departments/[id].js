import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../../components/common/Breadcrumb'
import { useAuth } from '../../../../contexts/AuthContext'
import { 
  demoDepartments,
  demoUsers,
  demoCourses,
  demoOrganizations
} from '../../../../data/demoData'
import { 
  Building,
  Users,
  BookOpen,
  Edit,
  Settings,
  UserPlus,
  Plus,
  BarChart3,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export default function DepartmentDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading } = useAuth()
  const [department, setDepartment] = useState(null)
  const [departmentUsers, setDepartmentUsers] = useState([])
  const [departmentCourses, setDepartmentCourses] = useState([])
  const [organization, setOrganization] = useState(null)
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/signin')
      return
    }

    if (user && user.role !== 'organization_admin') {
      router.push('/dashboard')
      return
    }

    if (id && user?.organizationId) {
      loadDepartmentData()
    }
  }, [id, user, isAuthenticated, isLoading, router])

  const loadDepartmentData = () => {
    try {
      // Get department details
      const deptData = demoDepartments.find(dept => 
        dept.id === id && dept.organizationId === user.organizationId
      )
      
      if (!deptData) {
        router.push('/dashboard/organization/departments')
        return
      }
      
      setDepartment(deptData)

      // Get organization details
      const orgData = demoOrganizations.find(org => org.id === user.organizationId)
      setOrganization(orgData)

      // Get department users
      const deptUsers = demoUsers.organizationInstructors.filter(
        instructor => instructor.departmentId === id && instructor.organizationId === user.organizationId
      )
      setDepartmentUsers(deptUsers)

      // Get department courses
      const deptCourses = demoCourses.filter(
        course => course.departmentId === id && course.organizationId === user.organizationId
      )
      setDepartmentCourses(deptCourses)
    } catch (error) {
      console.error('Failed to load department data:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  const handleEditDepartment = () => {
    router.push(`/dashboard/organization/departments/${id}/edit`)
  }

  const handleManageUsers = () => {
    router.push(`/dashboard/organization/departments/${id}/users`)
  }

  const handleCreateUser = () => {
    router.push(`/dashboard/organization/users/create?department=${id}`)
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Departments', href: '/dashboard/organization/departments' },
    { label: department?.name || 'Department', href: `/dashboard/organization/departments/${id}` }
  ]

  if (isLoading || isPageLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!department) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Department Not Found</h3>
          <p className="text-gray-500 mb-6">
            The department you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => router.push('/dashboard/organization/departments')}
            className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            Back to Departments
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>{department.name} - TeachGage</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-teachgage-blue rounded-lg flex items-center justify-center">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-teachgage-blue">{department.name}</h1>
                  <p className="text-teachgage-navy">{department.code}</p>
                  <p className="text-sm text-gray-600 mt-1">{organization?.name}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleEditDepartment}
                  className="inline-flex items-center px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Department
                </button>
                <button
                  onClick={handleManageUsers}
                  className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </button>
              </div>
            </div>

            {department.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-teachgage-navy">{department.description}</p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentUsers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentCourses.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{departmentCourses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {departmentUsers.filter(u => u.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Users */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-teachgage-blue">Department Users</h2>
                  <button
                    onClick={handleCreateUser}
                    className="inline-flex items-center px-3 py-2 bg-teachgage-green text-white rounded-lg hover:bg-teachgage-green/90 transition-colors text-sm"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {departmentUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
                    <p className="text-gray-500 mb-4">Add users to this department to get started.</p>
                    <button
                      onClick={handleCreateUser}
                      className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First User
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {departmentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-teachgage-blue">
                              {user.firstName} {user.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                      </div>
                    ))}
                    
                    {departmentUsers.length > 5 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={handleManageUsers}
                          className="text-sm text-teachgage-blue hover:text-teachgage-orange transition-colors"
                        >
                          View all {departmentUsers.length} users
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Department Courses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-teachgage-blue">Department Courses</h2>
                  <button
                    onClick={() => router.push('/dashboard/courses/create')}
                    className="inline-flex items-center px-3 py-2 bg-teachgage-green text-white rounded-lg hover:bg-teachgage-green/90 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {departmentCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-500 mb-4">Create courses for this department.</p>
                    <button
                      onClick={() => router.push('/dashboard/courses/create')}
                      className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Course
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {departmentCourses.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-teachgage-blue">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.code}</p>
                          <p className="text-xs text-gray-400">
                            {course.currentStudents} / {course.maxStudents} students
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : course.status === 'draft'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </span>
                      </div>
                    ))}
                    
                    {departmentCourses.length > 5 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={() => router.push('/dashboard/courses')}
                          className="text-sm text-teachgage-blue hover:text-teachgage-orange transition-colors"
                        >
                          View all {departmentCourses.length} courses
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Department Head Information */}
          {department.headId && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-teachgage-blue mb-4">Department Head</h2>
              {(() => {
                const head = departmentUsers.find(u => u.id === department.headId)
                return head ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-teachgage-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {head.firstName[0]}{head.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-teachgage-blue">
                        {head.firstName} {head.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{head.email}</p>
                      <p className="text-sm text-gray-500">Department Head</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Department head information not available</p>
                )
              })()}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}
