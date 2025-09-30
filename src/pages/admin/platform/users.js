import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Upload,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  User,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function PlatformUsersPage() {
  const router = useRouter()
  const { action } = router.query
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterOrganization, setFilterOrganization] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showBulkImport, setShowBulkImport] = useState(false)

  useEffect(() => {
    fetchUsers()
    
    // Check if bulk import should be shown
    if (action === 'bulk-import') {
      setShowBulkImport(true)
    }
  }, [action])

  useEffect(() => {
    // Filter users based on search and filters
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus)
    }

    if (filterOrganization !== 'all') {
      filtered = filtered.filter(user => user.organizationId === filterOrganization)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole, filterStatus, filterOrganization])

  const fetchUsers = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUsers = [
        {
          id: 'user_1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@stanford.edu',
          role: 'instructor',
          status: 'active',
          organizationId: 'org_1',
          organizationName: 'Stanford University',
          departmentName: 'Computer Science',
          lastLogin: '2024-01-18T10:30:00Z',
          createdAt: '2023-08-15',
          courseCount: 3,
          surveyCount: 8
        },
        {
          id: 'user_2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@mit.edu',
          role: 'organization_admin',
          status: 'active',
          organizationId: 'org_2',
          organizationName: 'MIT',
          departmentName: null,
          lastLogin: '2024-01-17T14:20:00Z',
          createdAt: '2023-09-22',
          courseCount: 0,
          surveyCount: 0
        },
        {
          id: 'user_3',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.brown@techcorp.com',
          role: 'instructor',
          status: 'active',
          organizationId: 'org_3',
          organizationName: 'TechCorp Training',
          departmentName: 'Engineering',
          lastLogin: '2024-01-16T09:45:00Z',
          createdAt: '2023-11-10',
          courseCount: 2,
          surveyCount: 5
        },
        {
          id: 'user_4',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@freelance.com',
          role: 'instructor',
          status: 'active',
          organizationId: null,
          organizationName: 'Individual Account',
          departmentName: null,
          lastLogin: '2024-01-15T16:30:00Z',
          createdAt: '2024-01-05',
          courseCount: 1,
          surveyCount: 2
        },
        {
          id: 'user_5',
          firstName: 'David',
          lastName: 'Wilson',
          email: 'david.wilson@ccd.edu',
          role: 'instructor',
          status: 'pending',
          organizationId: 'org_4',
          organizationName: 'Community College District',
          departmentName: 'Mathematics',
          lastLogin: null,
          createdAt: '2024-01-10',
          courseCount: 0,
          surveyCount: 0
        }
      ]
      
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
    }
    
    return badges[status] || badges.inactive
  }

  const getRoleBadge = (role) => {
    const badges = {
      instructor: { bg: 'bg-blue-100', text: 'text-blue-800', icon: User },
      organization_admin: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Shield },
      platform_admin: { bg: 'bg-red-100', text: 'text-red-800', icon: Shield }
    }
    
    return badges[role] || badges.instructor
  }

  const handleEditUser = (userId) => {
    // Navigate to user edit page
    console.log('Edit user:', userId)
    toast('User edit functionality coming soon')
  }

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
      toast.success('User deleted successfully')
    }
  }

  const handleSendInvitation = (userId) => {
    toast.success('Invitation sent successfully')
  }

  const handleBulkImport = () => {
    setShowBulkImport(true)
  }

  const handleExportUsers = () => {
    // Create CSV content
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Organization', 'Department', 'Courses', 'Surveys', 'Last Login'].join(','),
      ...filteredUsers.map(user => [
        `"${user.firstName} ${user.lastName}"`,
        user.email,
        user.role,
        user.status,
        `"${user.organizationName || ''}"`,
        `"${user.departmentName || ''}"`,
        user.courseCount,
        user.surveyCount,
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'platform-users.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Users exported successfully')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get unique organizations for filter
  const organizations = [...new Set(users.map(user => ({ id: user.organizationId, name: user.organizationName })))]
    .filter(org => org.id)

  if (loading) {
    return (
      <AdminLayout title="User Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>User Management - TeachGage Admin</title>
        <meta name="description" content="Manage platform users and their settings" />
      </Head>

      <AdminLayout title="User Management">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent w-64"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="instructor">Instructor</option>
              <option value="organization_admin">Organization Admin</option>
              <option value="platform_admin">Platform Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Organization Filter */}
            <select
              value={filterOrganization}
              onChange={(e) => setFilterOrganization(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Organizations</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportUsers}
              className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={handleBulkImport}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </button>
            <button
              onClick={() => toast('Create user functionality coming soon')}
              className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const statusBadge = getStatusBadge(user.status)
                  const roleBadge = getRoleBadge(user.role)
                  const StatusIcon = statusBadge.icon
                  const RoleIcon = roleBadge.icon

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-teachgage-blue flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {user.role.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.organizationName}</div>
                        {user.departmentName && (
                          <div className="text-sm text-gray-500">{user.departmentName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>{user.courseCount} courses</div>
                          <div>{user.surveyCount} surveys</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {user.status === 'pending' && (
                            <button
                              onClick={() => handleSendInvitation(user.id)}
                              className="text-teachgage-blue hover:text-teachgage-medium-blue"
                              title="Send invitation"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all' || filterOrganization !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first user'
              }
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role === 'organization_admin').length}
                </p>
                <p className="text-sm text-gray-600">Organization Admins</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Import Modal */}
        {showBulkImport && (
          <BulkImportModal 
            onClose={() => setShowBulkImport(false)}
            onSuccess={() => {
              setShowBulkImport(false)
              fetchUsers()
            }}
          />
        )}
      </AdminLayout>
    </>
  )
}

// Bulk Import Modal Component
function BulkImportModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
    } else {
      toast.error('Please select a valid CSV file')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)

    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Users imported successfully!')
      onSuccess()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to import users. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      ['firstName', 'lastName', 'email', 'role', 'organizationId', 'departmentName'].join(','),
      ['John', 'Doe', 'john.doe@example.com', 'instructor', 'org_1', 'Computer Science'].join(','),
      ['Jane', 'Smith', 'jane.smith@example.com', 'organization_admin', 'org_1', ''].join(',')
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Import Users</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <button
              onClick={downloadTemplate}
              className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue underline"
            >
              Download CSV template
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>

          {file && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Users
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
