import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../../components/layout/AdminLayout'
import { 
  Building2, 
  Users, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Activity,
  CreditCard,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrganizationDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (id) {
      fetchOrganizationDetails()
    }
  }, [id])

  const fetchOrganizationDetails = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock organization data with comprehensive details
      const mockOrganization = {
        id: id,
        name: 'Stanford University',
        type: 'academic',
        subscriptionTier: 'enterprise',
        status: 'active',
        userCount: 245,
        maxUsers: 500,
        departmentCount: 12,
        courseCount: 89,
        surveyCount: 156,
        createdAt: '2023-08-15',
        lastActivity: '2024-01-18T10:30:00Z',
        trialEndsAt: null, // Enterprise doesn't have trial
        contactInfo: {
          email: 'admin@stanford.edu',
          phone: '+1-650-723-2300',
          website: 'https://stanford.edu'
        },
        address: {
          street: '450 Serra Mall',
          city: 'Stanford',
          state: 'CA',
          zipCode: '94305',
          country: 'US'
        },
        billing: {
          plan: 'Enterprise',
          monthlyRevenue: 2990,
          nextBillingDate: '2024-02-15',
          paymentMethod: 'Credit Card ****1234'
        },
        stats: {
          totalUsers: 245,
          activeUsers: 198,
          totalCourses: 89,
          activeCourses: 67,
          totalSurveys: 156,
          completedSurveys: 134,
          responseRate: 87.5
        },
        recentActivity: [
          {
            id: 1,
            type: 'user_created',
            description: 'New instructor John Smith added to Computer Science department',
            timestamp: '2024-01-18T10:30:00Z',
            user: 'Admin'
          },
          {
            id: 2,
            type: 'course_created',
            description: 'Course "Advanced Machine Learning" created',
            timestamp: '2024-01-17T14:20:00Z',
            user: 'Prof. Johnson'
          },
          {
            id: 3,
            type: 'survey_completed',
            description: 'Survey "Course Evaluation - CS101" completed by 45 students',
            timestamp: '2024-01-16T09:45:00Z',
            user: 'System'
          }
        ],
        departments: [
          { id: 1, name: 'Computer Science', userCount: 45, courseCount: 23 },
          { id: 2, name: 'Mathematics', userCount: 32, courseCount: 18 },
          { id: 3, name: 'Physics', userCount: 28, courseCount: 15 },
          { id: 4, name: 'Engineering', userCount: 67, courseCount: 33 }
        ]
      }
      
      setOrganization(mockOrganization)
    } catch (error) {
      console.error('Error fetching organization details:', error)
      toast.error('Failed to load organization details')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/admin/platform/organizations/${id}/edit`)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      // Simulate delete
      toast.success('Organization deleted successfully')
      router.push('/admin/platform/organizations')
    }
  }

  const handleSuspend = () => {
    if (confirm('Are you sure you want to suspend this organization?')) {
      setOrganization(prev => ({ ...prev, status: 'suspended' }))
      toast.success('Organization suspended successfully')
    }
  }

  const handleActivate = () => {
    setOrganization(prev => ({ ...prev, status: 'active' }))
    toast.success('Organization activated successfully')
  }

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Organization Details">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!organization) {
    return (
      <AdminLayout title="Organization Not Found">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Not Found</h3>
          <p className="text-gray-500 mb-6">
            The organization you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/admin/platform/organizations')}
            className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            Back to Organizations
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>{organization.name} - TeachGage Admin</title>
        <meta name="description" content={`Organization details for ${organization.name}`} />
      </Head>

      <AdminLayout title="Organization Details">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Building2 className="w-8 h-8 text-teachgage-blue mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(organization.status)}`}>
                      {organization.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTierBadge(organization.subscriptionTier)}`}>
                      {organization.subscriptionTier}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{organization.userCount} / {organization.maxUsers} users</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Created {formatDate(organization.createdAt)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Activity className="w-4 h-4 mr-2" />
                  <span>Last active {formatDateTime(organization.lastActivity)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              {organization.status === 'active' ? (
                <button
                  onClick={handleSuspend}
                  className="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded-lg text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Suspend
                </button>
              ) : (
                <button
                  onClick={handleActivate}
                  className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate
                </button>
              )}
              
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Users & Departments', icon: Users },
                { id: 'billing', label: 'Billing', icon: CreditCard },
                { id: 'activity', label: 'Activity', icon: Activity },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-teachgage-blue text-teachgage-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{organization.stats.totalUsers}</p>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-xs text-green-600">{organization.stats.activeUsers} active</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <BarChart3 className="w-8 h-8 text-green-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{organization.stats.totalCourses}</p>
                        <p className="text-sm text-gray-600">Total Courses</p>
                        <p className="text-xs text-green-600">{organization.stats.activeCourses} active</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Activity className="w-8 h-8 text-purple-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{organization.stats.totalSurveys}</p>
                        <p className="text-sm text-gray-600">Total Surveys</p>
                        <p className="text-xs text-green-600">{organization.stats.completedSurveys} completed</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{organization.stats.responseRate}%</p>
                        <p className="text-sm text-gray-600">Response Rate</p>
                        <p className="text-xs text-green-600">Above average</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{organization.contactInfo.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{organization.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="w-5 w-5 text-gray-400 mr-3" />
                        <a 
                          href={organization.contactInfo.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-teachgage-blue hover:text-teachgage-medium-blue"
                        >
                          {organization.contactInfo.website}
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start">
                        <MapPin className="w-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div className="text-gray-900">
                          <p>{organization.address.street}</p>
                          <p>{organization.address.city}, {organization.address.state} {organization.address.zipCode}</p>
                          <p>{organization.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users & Departments Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Departments</h3>
                  <button className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                    Add Department
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {organization.departments.map((dept) => (
                    <div key={dept.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{dept.name}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{dept.userCount} users</span>
                        <span>{dept.courseCount} courses</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Current Plan</p>
                      <p className="text-lg font-medium text-gray-900">{organization.billing.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-lg font-medium text-gray-900">${organization.billing.monthlyRevenue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Next Billing Date</p>
                      <p className="text-lg font-medium text-gray-900">{formatDate(organization.billing.nextBillingDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="text-lg font-medium text-gray-900">{organization.billing.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-4">
                  {organization.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Activity className="w-5 h-5 text-teachgage-blue mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>By {activity.user}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDateTime(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Organization Settings</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600">Organization settings and configuration options will be available here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
