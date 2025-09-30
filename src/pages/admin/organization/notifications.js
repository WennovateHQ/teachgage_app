import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
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
  Clock,
  Mail
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminOrganizationNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    // Filter notifications based on search and filters
    let filtered = notifications

    if (searchTerm) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(notification => notification.status === statusFilter)
    }

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, typeFilter, statusFilter])

  const loadNotifications = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockNotifications = [
        {
          id: 'notif_1',
          type: 'user_activity',
          title: 'New User Registration',
          message: 'John Smith has registered and is pending approval for the Computer Science department.',
          status: 'unread',
          priority: 'medium',
          createdAt: '2024-01-18T10:30:00Z',
          actionRequired: true,
          relatedUser: 'John Smith',
          relatedDepartment: 'Computer Science'
        },
        {
          id: 'notif_2',
          type: 'course_activity',
          title: 'Course Evaluation Completed',
          message: 'The evaluation for "Advanced Machine Learning" has been completed by 45 students.',
          status: 'read',
          priority: 'low',
          createdAt: '2024-01-17T14:20:00Z',
          actionRequired: false,
          relatedCourse: 'Advanced Machine Learning'
        },
        {
          id: 'notif_3',
          type: 'system_alert',
          title: 'Storage Usage Warning',
          message: 'Your organization is approaching 80% of allocated storage capacity.',
          status: 'unread',
          priority: 'high',
          createdAt: '2024-01-16T09:45:00Z',
          actionRequired: true
        },
        {
          id: 'notif_4',
          type: 'survey_activity',
          title: 'Survey Response Rate Low',
          message: 'The response rate for "Course Feedback - CS101" is below 50%. Consider sending reminders.',
          status: 'unread',
          priority: 'medium',
          createdAt: '2024-01-15T16:30:00Z',
          actionRequired: true,
          relatedSurvey: 'Course Feedback - CS101'
        },
        {
          id: 'notif_5',
          type: 'billing',
          title: 'Payment Successful',
          message: 'Your monthly subscription payment of $299 has been processed successfully.',
          status: 'read',
          priority: 'low',
          createdAt: '2024-01-15T08:00:00Z',
          actionRequired: false
        }
      ]
      
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      user_activity: UserPlus,
      course_activity: BookOpen,
      survey_activity: BarChart3,
      system_alert: AlertTriangle,
      billing: Info
    }
    return icons[type] || Bell
  }

  const getTypeColor = (type) => {
    const colors = {
      user_activity: 'text-blue-500',
      course_activity: 'text-green-500',
      survey_activity: 'text-purple-500',
      system_alert: 'text-red-500',
      billing: 'text-orange-500'
    }
    return colors[type] || 'text-gray-500'
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return badges[priority] || badges.low
  }

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: 'read' }
          : notif
      )
    )
    toast.success('Notification marked as read')
  }

  const handleMarkAsUnread = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: 'unread' }
          : notif
      )
    )
    toast.success('Notification marked as unread')
  }

  const handleDeleteNotification = (notificationId) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      toast.success('Notification deleted')
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

  const handleBulkMarkAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => 
        selectedNotifications.includes(notif.id)
          ? { ...notif, status: 'read' }
          : notif
      )
    )
    setSelectedNotifications([])
    toast.success(`${selectedNotifications.length} notifications marked as read`)
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedNotifications.length} notifications?`)) {
      setNotifications(prev => 
        prev.filter(notif => !selectedNotifications.includes(notif.id))
      )
      setSelectedNotifications([])
      toast.success(`${selectedNotifications.length} notifications deleted`)
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Organization Notifications">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Notifications - TeachGage Admin</title>
        <meta name="description" content="Manage organization notifications and alerts" />
      </Head>

      <AdminLayout title="Organization Notifications">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent w-64"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="user_activity">User Activity</option>
              <option value="course_activity">Course Activity</option>
              <option value="survey_activity">Survey Activity</option>
              <option value="system_alert">System Alerts</option>
              <option value="billing">Billing</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedNotifications.length} selected
              </span>
              <button
                onClick={handleBulkMarkAsRead}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-500">
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'No notifications available'
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const TypeIcon = getTypeIcon(notification.type)
                const typeColor = getTypeColor(notification.type)
                
                return (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 ${notification.status === 'unread' ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="mt-1 h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                      />
                      
                      <div className="flex-shrink-0">
                        <TypeIcon className={`h-5 w-5 ${typeColor}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`text-sm font-medium ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(notification.priority)}`}>
                                {notification.priority}
                              </span>
                              {notification.actionRequired && (
                                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                  Action Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center text-xs text-gray-500 space-x-4">
                              <span>{formatTimestamp(notification.createdAt)}</span>
                              {notification.relatedUser && (
                                <span>User: {notification.relatedUser}</span>
                              )}
                              {notification.relatedDepartment && (
                                <span>Dept: {notification.relatedDepartment}</span>
                              )}
                              {notification.relatedCourse && (
                                <span>Course: {notification.relatedCourse}</span>
                              )}
                              {notification.relatedSurvey && (
                                <span>Survey: {notification.relatedSurvey}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-4">
                            {notification.status === 'unread' ? (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMarkAsUnread(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="Mark as unread"
                              >
                                <Mail className="h-4 w-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                <p className="text-sm text-gray-600">Total Notifications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.status === 'unread').length}
                </p>
                <p className="text-sm text-gray-600">Unread</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.priority === 'high').length}
                </p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.actionRequired).length}
                </p>
                <p className="text-sm text-gray-600">Action Required</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
