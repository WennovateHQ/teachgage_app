import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../components/common/Breadcrumb'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  demoUsers, 
  demoDepartments,
  demoOrganizations,
  demoCourses
} from '../../../data/demoData'
import { 
  Building, 
  Users, 
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  MoreVertical,
  UserPlus,
  Settings
} from 'lucide-react'

export default function OrganizationDepartmentsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [organization, setOrganization] = useState(null)
  const [departments, setDepartments] = useState([])
  const [instructors, setInstructors] = useState([])
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
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

    if (user?.organizationId) {
      loadOrganizationData()
    }
  }, [user, isAuthenticated, isLoading, router])

  const loadOrganizationData = () => {
    try {
      // Get organization details
      const orgData = demoOrganizations.find(org => org.id === user.organizationId)
      setOrganization(orgData)

      // Get organization departments
      const orgDepartments = demoDepartments.filter(
        dept => dept.organizationId === user.organizationId
      )
      setDepartments(orgDepartments)

      // Get organization instructors
      const orgInstructors = demoUsers.organizationInstructors.filter(
        instructor => instructor.organizationId === user.organizationId
      )
      setInstructors(orgInstructors)

      // Get organization courses
      const orgCourses = demoCourses.filter(
        course => course.organizationId === user.organizationId
      )
      setCourses(orgCourses)
    } catch (error) {
      console.error('Failed to load organization data:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  const filteredDepartments = departments.filter(dept =>
    searchTerm === '' || 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDepartmentStats = (departmentId) => {
    const deptInstructors = instructors.filter(i => i.departmentId === departmentId)
    const deptCourses = courses.filter(c => c.departmentId === departmentId)
    
    return {
      instructors: deptInstructors.length,
      courses: deptCourses.length,
      activeCourses: deptCourses.filter(c => c.status === 'active').length
    }
  }

  const handleCreateDepartment = () => {
    router.push('/dashboard/organization/departments/create')
  }

  const handleViewDepartment = (departmentId) => {
    router.push(`/dashboard/organization/departments/${departmentId}`)
  }

  const handleEditDepartment = (departmentId) => {
    router.push(`/dashboard/organization/departments/${departmentId}/edit`)
  }

  const handleManageUsers = (departmentId) => {
    router.push(`/dashboard/organization/departments/${departmentId}/users`)
  }

  const handleDeleteDepartment = (department) => {
    const stats = getDepartmentStats(department.id)
    
    if (stats.instructors > 0 || stats.courses > 0) {
      alert(`Cannot delete department "${department.name}" because it has ${stats.instructors} instructors and ${stats.courses} courses. Please reassign or remove them first.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete the "${department.name}" department?`)) {
      alert('Delete department functionality would be implemented here')
    }
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Departments', href: '/dashboard/organization/departments' }
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

  return (
    <>
      <Head>
        <title>Organization Departments - TeachGage</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Departments</h1>
              <p className="text-teachgage-navy">
                Manage departments for {organization?.name}
              </p>
            </div>
            
            <button
              onClick={handleCreateDepartment}
              className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Department
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.length === 0 ? (
              <div className="col-span-full">
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No departments found' : 'No departments yet'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm 
                      ? 'Try adjusting your search criteria.'
                      : 'Create your first department to organize your instructors and courses.'
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={handleCreateDepartment}
                      className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Department
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredDepartments.map((department) => {
                const stats = getDepartmentStats(department.id)
                
                return (
                  <div key={department.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Department Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-teachgage-blue rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-semibold text-teachgage-blue">
                              {department.name}
                            </h3>
                            <p className="text-sm text-teachgage-navy">
                              {department.code}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      {department.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {department.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-teachgage-blue">
                            {stats.instructors}
                          </div>
                          <div className="text-xs text-gray-500">Instructors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-teachgage-green">
                            {stats.activeCourses}
                          </div>
                          <div className="text-xs text-gray-500">Active Courses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-teachgage-orange">
                            {stats.courses}
                          </div>
                          <div className="text-xs text-gray-500">Total Courses</div>
                        </div>
                      </div>

                      {/* Department Head */}
                      {department.headId && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Department Head</div>
                          <div className="text-sm font-medium text-teachgage-blue">
                            {instructors.find(i => i.id === department.headId)?.firstName} {' '}
                            {instructors.find(i => i.id === department.headId)?.lastName}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDepartment(department.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditDepartment(department.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      </div>

                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleManageUsers(department.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-teachgage-green text-white rounded-lg hover:bg-teachgage-green/90 transition-colors text-sm"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Manage Users
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department)}
                          className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Department"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Summary Stats */}
          {departments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Organization Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teachgage-blue mb-2">
                    {departments.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Departments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teachgage-green mb-2">
                    {instructors.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teachgage-orange mb-2">
                    {courses.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teachgage-navy mb-2">
                    {courses.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Courses</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}
