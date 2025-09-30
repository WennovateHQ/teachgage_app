import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../components/common/Breadcrumb'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  Bell,
  Check,
  X,
  Eye,
  Trash2,
  Filter,
  Search,
  MoreVertical,
  UserPlus,
  BookOpen,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock
} from 'lucide-react'

export default function OrganizationNotificationsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState([])
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

    if (user) {
      loadNotifications()
    }
  }, [user, isAuthenticated, isLoading, router])

  const loadNotifications = () => {
    try {
      // Mock notifications data
      const mockNotifications = [
        {
          id: 'notif_001',
          type: 'user_registered',
          title: 'New User Registration',
          message: 'Sarah Johnson has registered and is pending approval for the Mathematics department.',
          timestamp: '2025-09-27T10:30:00Z',
          read: false,
          priority: 'medium',
          actionRequired: true,
          metadata: {
            userId: 'user_123',
            userName: 'Sarah Johnson',
            department: 'Mathematics'
          }
        },
        {
          id: 'notif_002',
          type: 'course_created',
          title: 'New Course Created',
          message: 'Dr. Smith created a new course "Advanced Calculus" in the Mathematics department.',
          timestamp: '2025-09-27T09:15:00Z',
          read: true,
          priority: 'low',
          actionRequired: false,
          metadata: {
            courseId: 'course_456',
            courseName: 'Advanced Calculus',
            instructor: 'Dr. Smith'
          }
        },
        {
          id: 'notif_003',
          type: 'survey_completed',
          title: 'Survey Milestone Reached',
          message: 'The "Course Evaluation Spring 2025" survey has received 100+ responses.',
          timestamp: '2025-09-27T08:45:00Z',
          read: false,
          priority: 'medium',
          actionRequired: false,
          metadata: {
            surveyId: 'survey_789',
            surveyName: 'Course Evaluation Spring 2025',
            responseCount: 127
          }
        },
        {
          id: 'notif_004',
          type: 'system_alert',
          title: 'Trial Expiring Soon',
          message: 'Your organization trial will expire in 5 days. Please update your subscription.',
          timestamp: '2025-09-26T16:00:00Z',
          read: false,
          priority: 'high',
          actionRequired: true,
          metadata: {
            daysRemaining: 5
          }
        },
        {
          id: 'notif_005',
          type: 'weekly_report',
          title: 'Weekly Activity Report',
          message: 'Your weekly organization report is ready for review.',
          timestamp: '2025-09-26T09:00:00Z',
          read: true,
          priority: 'low',
          actionRequired: false,
          metadata: {
            reportPeriod: 'Sep 19-26, 2025'
          }
        }
      ]

      setNotifications(mockNotifications)
      setFilteredNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    let filtered = notifications.filter(notification => {
      const matchesSearch = searchTerm === '' || 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || notification.type === typeFilter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'unread' && !notification.read) ||
        (statusFilter === 'read' && notification.read) ||
        (statusFilter === 'action_required' && notification.actionRequired)

      return matchesSearch && matchesType && matchesStatus
    })

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, typeFilter, statusFilter])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user_registered':
        return UserPlus
      case 'course_created':
        return BookOpen
      case 'survey_completed':
        return BarChart3
      case 'system_alert':
        return AlertTriangle
      case 'weekly_report':
        return BarChart3
      default:
        return Bell
    }
  }

  const getNotificationColor = (priority, read) => {
    if (read) return 'bg-gray-50 border-gray-200'
    
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'low':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const handleMarkAsUnread = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: false } : notif
      )
    )
  }

  const handleDelete = (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    }
  }

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const handleBulkAction = (action) => {
    if (selectedNotifications.length === 0) return

    switch (action) {
      case 'mark_read':
        setNotifications(prev => 
          prev.map(notif => 
            selectedNotifications.includes(notif.id) ? { ...notif, read: true } : notif
          )
        )
        break
      case 'mark_unread':
        setNotifications(prev => 
          prev.map(notif => 
            selectedNotifications.includes(notif.id) ? { ...notif, read: false } : notif
          )
        )
        break
      case 'delete':
        if (window.confirm(`Delete ${selectedNotifications.length} selected notifications?`)) {
          setNotifications(prev => 
            prev.filter(notif => !selectedNotifications.includes(notif.id))
          )
        }
        break
    }
    setSelectedNotifications([])
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Notifications', href: '/dashboard/organization/notifications' }
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

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <Head>
        <title>Organization Notifications - TeachGage</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Notifications</h1>
              <p className="text-teachgage-navy">
                Stay updated with organization activities and alerts
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teachgage-orange text-white">
                    {unreadCount} unread
                  </span>
                )}
              </p>
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
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="user_registered">User Registration</option>
                  <option value="course_created">Course Created</option>
                  <option value="survey_completed">Survey Updates</option>
                  <option value="system_alert">System Alerts</option>
                  <option value="weekly_report">Reports</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="action_required">Action Required</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setTypeFilter('all')
                    setStatusFilter('all')
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="bg-teachgage-blue text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('mark_read')}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleBulkAction('mark_unread')}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                  >
                    Mark Unread
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

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-teachgage-blue">
                  Notifications ({filteredNotifications.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-600">Select All</label>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                      ? 'No notifications found' 
                      : 'No notifications yet'
                    }
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'You\'ll see organization notifications here as they arrive.'
                    }
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-6 hover:bg-gray-50 ${getNotificationColor(notification.priority, notification.read)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={() => handleSelectNotification(notification.id)}
                            className="mt-1 h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                          />
                          
                          <div className={`p-2 rounded-lg ${
                            notification.priority === 'high' ? 'bg-red-100' :
                            notification.priority === 'medium' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              notification.priority === 'high' ? 'text-red-600' :
                              notification.priority === 'medium' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-teachgage-blue'}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-teachgage-blue rounded-full"></div>
                              )}
                              {notification.actionRequired && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teachgage-orange text-white">
                                  Action Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(notification.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-4">
                          {!notification.read ? (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAsUnread(notification.id)}
                              className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                              title="Mark as unread"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete notification"
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
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
