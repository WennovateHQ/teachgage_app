import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  FileText, 
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterUser, setFilterUser] = useState('all')
  const [dateRange, setDateRange] = useState('7d')
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    fetchAuditLogs()
  }, [dateRange])

  useEffect(() => {
    // Filter logs based on search and filters
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction)
    }

    if (filterUser !== 'all') {
      filtered = filtered.filter(log => log.user.id === filterUser)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, filterAction, filterUser])

  const fetchAuditLogs = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockLogs = [
        {
          id: 1,
          timestamp: '2024-01-18T14:30:00Z',
          action: 'user_login',
          resource: 'Authentication',
          user: { id: 'admin_1', name: 'Platform Admin', email: 'admin@teachgage.com' },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: 'Successful login from admin panel',
          metadata: { sessionId: 'sess_123', location: 'San Francisco, CA' }
        },
        {
          id: 2,
          timestamp: '2024-01-18T14:25:00Z',
          action: 'organization_created',
          resource: 'Organizations',
          user: { id: 'admin_1', name: 'Platform Admin', email: 'admin@teachgage.com' },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: 'Created new organization: University of California',
          metadata: { organizationId: 'org_123', subscriptionTier: 'enterprise' }
        },
        {
          id: 3,
          timestamp: '2024-01-18T14:20:00Z',
          action: 'user_deleted',
          resource: 'Users',
          user: { id: 'admin_1', name: 'Platform Admin', email: 'admin@teachgage.com' },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: 'Deleted user account: john.doe@example.com',
          metadata: { deletedUserId: 'user_456', reason: 'Account violation' }
        },
        {
          id: 4,
          timestamp: '2024-01-18T14:15:00Z',
          action: 'settings_updated',
          resource: 'System Settings',
          user: { id: 'admin_1', name: 'Platform Admin', email: 'admin@teachgage.com' },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          details: 'Updated email notification settings',
          metadata: { settingKey: 'email_notifications', oldValue: 'true', newValue: 'false' }
        },
        {
          id: 5,
          timestamp: '2024-01-18T14:10:00Z',
          action: 'backup_created',
          resource: 'Database',
          user: { id: 'system', name: 'System', email: 'system@teachgage.com' },
          ipAddress: '127.0.0.1',
          userAgent: 'TeachGage-BackupService/1.0',
          status: 'success',
          details: 'Automated daily backup completed',
          metadata: { backupSize: '2.4GB', backupType: 'full' }
        },
        {
          id: 6,
          timestamp: '2024-01-18T14:05:00Z',
          action: 'login_failed',
          resource: 'Authentication',
          user: { id: 'unknown', name: 'Unknown User', email: 'hacker@malicious.com' },
          ipAddress: '203.0.113.1',
          userAgent: 'curl/7.68.0',
          status: 'failed',
          details: 'Failed login attempt with invalid credentials',
          metadata: { attempts: 5, blocked: true }
        }
      ]
      
      setLogs(mockLogs)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast.error('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action) => {
    const icons = {
      user_login: User,
      user_logout: User,
      user_created: User,
      user_deleted: User,
      organization_created: Shield,
      organization_updated: Shield,
      organization_deleted: Shield,
      settings_updated: Settings,
      backup_created: Database,
      login_failed: AlertTriangle
    }
    return icons[action] || FileText
  }

  const getStatusBadge = (status) => {
    const badges = {
      success: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle }
    }
    return badges[status] || badges.success
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Resource', 'User', 'IP Address', 'Status', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.action,
        log.resource,
        `"${log.user.name} (${log.user.email})"`,
        log.ipAddress,
        log.status,
        `"${log.details}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Audit logs exported successfully')
  }

  const handleViewDetails = (log) => {
    setSelectedLog(log)
  }

  // Get unique users for filter
  const uniqueUsers = [...new Set(logs.map(log => ({ id: log.user.id, name: log.user.name })))]

  if (loading) {
    return (
      <AdminLayout title="Audit Logs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Audit Logs - TeachGage Admin</title>
        <meta name="description" content="System audit logs and activity monitoring" />
      </Head>

      <AdminLayout title="Audit Logs">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600">Monitor system activities and security events</p>
          </div>
          <button
            onClick={handleExportLogs}
            className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              />
            </div>

            {/* Action Filter */}
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="user_login">User Login</option>
              <option value="user_created">User Created</option>
              <option value="user_deleted">User Deleted</option>
              <option value="organization_created">Organization Created</option>
              <option value="settings_updated">Settings Updated</option>
              <option value="backup_created">Backup Created</option>
              <option value="login_failed">Login Failed</option>
            </select>

            {/* User Filter */}
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <button
              onClick={() => fetchAuditLogs()}
              className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => {
                  const ActionIcon = getActionIcon(log.action)
                  const statusBadge = getStatusBadge(log.status)
                  const StatusIcon = statusBadge.icon

                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ActionIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {log.action.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.user.name}</div>
                          <div className="text-sm text-gray-500">{log.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="text-teachgage-blue hover:text-teachgage-medium-blue"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
            <p className="text-gray-600">
              {searchTerm || filterAction !== 'all' || filterUser !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No audit logs available for the selected time period'
              }
            </p>
          </div>
        )}

        {/* Log Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Audit Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <p className="mt-1 text-sm text-gray-900">{formatTimestamp(selectedLog.timestamp)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.action.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.user.name}</p>
                    <p className="text-xs text-gray-500">{selectedLog.user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Resource</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.resource}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.status}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.details}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">User Agent</label>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedLog.userAgent}</p>
                </div>

                {selectedLog.metadata && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Metadata</label>
                    <pre className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
