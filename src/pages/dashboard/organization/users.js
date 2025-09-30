import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../components/common/Breadcrumb'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  demoUsers, 
  demoDepartments,
  demoOrganizations 
} from '../../../data/demoData'
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  Upload,
  Edit,
  Trash2,
  Mail,
  Clock,
  CheckCircle,
  UserPlus,
  MoreVertical,
  Download
} from 'lucide-react'

export default function OrganizationUsersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [organization, setOrganization] = useState(null)
  const [instructors, setInstructors] = useState([])
  const [departments, setDepartments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState([])
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

      // Get organization instructors
      const orgInstructors = demoUsers.organizationInstructors.filter(
        instructor => instructor.organizationId === user.organizationId
      )
      setInstructors(orgInstructors)

      // Get organization departments
      const orgDepartments = demoDepartments.filter(
        dept => dept.organizationId === user.organizationId
      )
      setDepartments(orgDepartments)
    } catch (error) {
      console.error('Failed to load organization data:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = searchTerm === '' || 
      instructor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || instructor.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || instructor.departmentId === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredInstructors.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredInstructors.map(u => u.id))
    }
  }

  const handleCreateUser = () => {
    router.push('/dashboard/organization/users/create')
  }

  const handleBulkUpload = () => {
    // This would open a bulk upload modal
    alert('Bulk upload functionality would be implemented here')
  }

  const handleEditUser = (userId) => {
    router.push(`/dashboard/organization/users/${userId}/edit`)
  }

  const handleDeleteUser = (instructor) => {
    if (window.confirm(`Are you sure you want to remove ${instructor.firstName} ${instructor.lastName}?`)) {
      alert('Delete user functionality would be implemented here')
    }
  }

  const handleResendWelcome = (instructor) => {
    alert(`Resend welcome email to ${instructor.email}`)
  }

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return
    
    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
          alert('Bulk delete functionality would be implemented here')
        }
        break
      case 'activate':
        alert('Bulk activate functionality would be implemented here')
        break
      case 'deactivate':
        alert('Bulk deactivate functionality would be implemented here')
        break
      case 'export':
        alert('Export selected users functionality would be implemented here')
        break
    }
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Users', href: '/dashboard/organization/users' }
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
        <title>Organization Users - TeachGage</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Organization Users</h1>
              <p className="text-teachgage-navy">
                Manage instructors and staff for {organization?.name}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleBulkUpload}
                className="inline-flex items-center px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </button>
              <button
                onClick={handleCreateUser}
                className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending_password_change">Pending Setup</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setDepartmentFilter('all')
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-teachgage-blue text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-teachgage-blue">
                  Users ({filteredInstructors.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredInstructors.length && filteredInstructors.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-600">Select All</label>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredInstructors.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' 
                      ? 'No users found' 
                      : 'No users yet'
                    }
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Add your first user to get started.'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && departmentFilter === 'all' && (
                    <button
                      onClick={handleCreateUser}
                      className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First User
                    </button>
                  )}
                </div>
              ) : (
                filteredInstructors.map((instructor) => (
                  <div key={instructor.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(instructor.id)}
                          onChange={() => handleSelectUser(instructor.id)}
                          className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                        />
                        
                        <div className="w-10 h-10 bg-teachgage-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {instructor.firstName[0]}{instructor.lastName[0]}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-teachgage-blue">
                            {instructor.firstName} {instructor.lastName}
                          </h3>
                          <p className="text-sm text-teachgage-navy">{instructor.email}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                            <span>
                              Department: {departments.find(d => d.id === instructor.departmentId)?.name || 'Unassigned'}
                            </span>
                            {instructor.lastLogin && (
                              <span>Last login: {new Date(instructor.lastLogin).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          instructor.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : instructor.status === 'pending_password_change'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {instructor.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {instructor.status === 'pending_password_change' && <Clock className="w-3 h-3 mr-1" />}
                          {instructor.status === 'active' ? 'Active' : 
                           instructor.status === 'pending_password_change' ? 'Pending Setup' : 'Inactive'}
                        </span>
                        
                        <div className="flex space-x-1">
                          {instructor.status === 'pending_password_change' && (
                            <button
                              onClick={() => handleResendWelcome(instructor)}
                              className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                              title="Resend Welcome Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleEditUser(instructor.id)}
                            className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(instructor)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
