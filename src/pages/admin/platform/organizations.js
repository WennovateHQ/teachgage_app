import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Users, 
  Building2, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrganizationsPage() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState([])
  const [filteredOrganizations, setFilteredOrganizations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch organizations
    const fetchOrganizations = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockOrganizations = [
          {
            id: 'org_1',
            name: 'Stanford University',
            type: 'academic',
            subscriptionTier: 'enterprise',
            status: 'active',
            userCount: 245,
            maxUsers: 500,
            departmentCount: 12,
            createdAt: '2023-08-15',
            lastActivity: '2024-01-18T10:30:00Z',
            contactInfo: {
              email: 'admin@stanford.edu',
              phone: '+1-650-723-2300'
            },
            address: {
              street: '450 Serra Mall',
              city: 'Stanford',
              state: 'CA',
              zipCode: '94305',
              country: 'US'
            }
          },
          {
            id: 'org_2',
            name: 'MIT',
            type: 'academic',
            subscriptionTier: 'enterprise',
            status: 'active',
            userCount: 189,
            maxUsers: 300,
            departmentCount: 8,
            createdAt: '2023-09-22',
            lastActivity: '2024-01-17T14:20:00Z',
            contactInfo: {
              email: 'admin@mit.edu',
              phone: '+1-617-253-1000'
            },
            address: {
              street: '77 Massachusetts Ave',
              city: 'Cambridge',
              state: 'MA',
              zipCode: '02139',
              country: 'US'
            }
          },
          {
            id: 'org_3',
            name: 'TechCorp Training',
            type: 'corporate',
            subscriptionTier: 'professional',
            status: 'active',
            userCount: 78,
            maxUsers: 100,
            departmentCount: 4,
            createdAt: '2023-11-10',
            lastActivity: '2024-01-16T09:45:00Z',
            contactInfo: {
              email: 'training@techcorp.com',
              phone: '+1-555-0123'
            },
            address: {
              street: '123 Business Ave',
              city: 'San Francisco',
              state: 'CA',
              zipCode: '94105',
              country: 'US'
            }
          },
          {
            id: 'org_4',
            name: 'Community College District',
            type: 'academic',
            subscriptionTier: 'basic',
            status: 'trial',
            userCount: 34,
            maxUsers: 50,
            departmentCount: 3,
            createdAt: '2024-01-05',
            lastActivity: '2024-01-15T16:30:00Z',
            contactInfo: {
              email: 'admin@ccd.edu',
              phone: '+1-555-0456'
            },
            address: {
              street: '789 Education Blvd',
              city: 'Sacramento',
              state: 'CA',
              zipCode: '95814',
              country: 'US'
            }
          }
        ]
        
        setOrganizations(mockOrganizations)
        setFilteredOrganizations(mockOrganizations)
      } catch (error) {
        console.error('Error fetching organizations:', error)
        toast.error('Failed to load organizations')
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  useEffect(() => {
    // Filter organizations based on search and status
    let filtered = organizations

    if (searchTerm) {
      filtered = filtered.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(org => org.status === filterStatus)
    }

    setFilteredOrganizations(filtered)
  }, [organizations, searchTerm, filterStatus])

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    
    return badges[status] || badges.inactive
  }

  const getTierBadge = (tier) => {
    const badges = {
      basic: 'bg-gray-100 text-gray-800',
      professional: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800'
    }
    
    return badges[tier] || badges.basic
  }

  const handleViewOrganization = (orgId) => {
    router.push(`/admin/platform/organizations/${orgId}`)
  }

  const handleEditOrganization = (orgId) => {
    router.push(`/admin/platform/organizations/${orgId}/edit`)
  }

  const handleDeleteOrganization = (orgId) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(prev => prev.filter(org => org.id !== orgId))
      toast.success('Organization deleted successfully')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Organization Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Management - TeachGage Admin</title>
        <meta name="description" content="Manage organizations and their settings" />
      </Head>

      <AdminLayout title="Organization Management">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Organization
          </button>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <div key={org.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Organization Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{org.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(org.status)}`}>
                      {org.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTierBadge(org.subscriptionTier)}`}>
                      {org.subscriptionTier}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Organization Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{org.userCount}</span>
                  </div>
                  <p className="text-xs text-gray-600">Users</p>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full" 
                      style={{ width: `${(org.userCount / org.maxUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Building2 className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{org.departmentCount}</span>
                  </div>
                  <p className="text-xs text-gray-600">Departments</p>
                </div>
              </div>

              {/* Organization Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Created {new Date(org.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 mr-2 flex items-center justify-center">📧</span>
                  <span className="truncate">{org.contactInfo.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 mr-2 flex items-center justify-center">📍</span>
                  <span className="truncate">{org.address.city}, {org.address.state}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleViewOrganization(org.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleEditOrganization(org.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-teachgage-blue bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteOrganization(org.id)}
                  className="flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first organization'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{organizations.length}</p>
                <p className="text-sm text-gray-600">Total Organizations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.reduce((sum, org) => sum + org.userCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.filter(org => org.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active Organizations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.filter(org => org.status === 'trial').length}
                </p>
                <p className="text-sm text-gray-600">Trial Organizations</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
