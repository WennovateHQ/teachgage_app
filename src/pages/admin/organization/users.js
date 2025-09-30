import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
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
  Download,
  Shield,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminOrganizationUsersPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

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

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUsers = [
        {
          id: 'user_1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@stanford.edu',
          role: 'organization_admin',
          status: 'active',
          organizationId: 'org_1',
          organizationName: 'Stanford University',
          departmentName: null,
          lastLogin: '2024-01-18T10:30:00Z',
          createdAt: '2023-08-15',
          courseCount: 0,
          surveyCount: 0
        },
        {
          id: 'user_2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@stanford.edu',
          role: 'instructor',
          status: 'active',
          organizationId: 'org_1',
          organizationName: 'Stanford University',
          departmentName: 'Computer Science',
          lastLogin: '2024-01-17T14:20:00Z',
          createdAt: '2023-09-22',
          courseCount: 3,
          surveyCount: 8
        },
        {
          id: 'user_3',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.brown@stanford.edu',
          role: 'instructor',
          status: 'pending',
          organizationId: 'org_1',
          organizationName: 'Stanford University',
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
      suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: Clock },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock }
    }
    return badges[status] || badges.inactive
  }

  const getRoleBadge = (role) => {
    const badges = {
      instructor: { bg: 'bg-blue-100', text: 'text-blue-800', icon: User },
      organization_admin: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Shield }
    }
    return badges[role] || badges.instructor
  }

  const handleEditUser = (userId) => {
    toast('Edit user functionality coming soon')
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Organization Users">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Users - TeachGage Admin</title>
        <meta name="description" content="Manage organization users and their settings" />
      </Head>

      <AdminLayout title="Organization Users">
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="instructor">Instructor</option>
              <option value="organization_admin">Organization Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toast('Export functionality coming soon')}
              className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
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
                    Department
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.departmentName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>{user.courseCount} courses</div>
                          <div>{user.surveyCount} surveys</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
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
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No users available for this organization'
              }
            </p>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
