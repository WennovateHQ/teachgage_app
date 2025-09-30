import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import { 
  Database, 
  Download, 
  Upload,
  Trash2,
  RefreshCw,
  Archive,
  HardDrive,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DataManagementPage() {
  const [loading, setLoading] = useState(true)
  const [backups, setBackups] = useState([])
  const [storageStats, setStorageStats] = useState(null)
  const [activeTab, setActiveTab] = useState('backups')

  useEffect(() => {
    fetchDataManagementInfo()
  }, [])

  const fetchDataManagementInfo = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockBackups = [
        {
          id: 1,
          name: 'Daily Backup - 2024-01-18',
          type: 'automated',
          size: '2.4 GB',
          status: 'completed',
          createdAt: '2024-01-18T02:00:00Z',
          tables: ['users', 'organizations', 'courses', 'surveys', 'responses']
        },
        {
          id: 2,
          name: 'Weekly Full Backup - 2024-01-15',
          type: 'automated',
          size: '15.2 GB',
          status: 'completed',
          createdAt: '2024-01-15T01:00:00Z',
          tables: ['all']
        },
        {
          id: 3,
          name: 'Manual Backup - Pre Migration',
          type: 'manual',
          size: '12.8 GB',
          status: 'completed',
          createdAt: '2024-01-10T14:30:00Z',
          tables: ['users', 'organizations', 'courses']
        }
      ]

      const mockStorageStats = {
        totalStorage: 50, // GB
        usedStorage: 18.7, // GB
        availableStorage: 31.3, // GB
        databaseSize: 12.4, // GB
        backupSize: 6.3, // GB
        tableStats: [
          { name: 'users', size: '2.1 GB', records: 1247 },
          { name: 'organizations', size: '0.8 GB', records: 47 },
          { name: 'courses', size: '3.2 GB', records: 892 },
          { name: 'surveys', size: '1.9 GB', records: 2156 },
          { name: 'responses', size: '4.4 GB', records: 15678 }
        ]
      }

      setBackups(mockBackups)
      setStorageStats(mockStorageStats)
    } catch (error) {
      console.error('Error fetching data management info:', error)
      toast.error('Failed to load data management information')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    toast('Creating backup...')
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Backup created successfully!')
  }

  const handleDownloadBackup = (backupId) => {
    toast('Preparing backup download...')
    // Simulate download preparation
    setTimeout(() => {
      toast.success('Backup download started!')
    }, 1000)
  }

  const handleDeleteBackup = (backupId) => {
    if (confirm('Are you sure you want to delete this backup?')) {
      setBackups(prev => prev.filter(backup => backup.id !== backupId))
      toast.success('Backup deleted successfully')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      running: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle }
    }
    return badges[status] || badges.completed
  }

  const formatDate = (dateString) => {
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
      <AdminLayout title="Data Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Data Management - TeachGage Admin</title>
        <meta name="description" content="Database management and backup administration" />
      </Head>

      <AdminLayout title="Data Management">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
            <p className="text-gray-600">Manage database backups, storage, and data operations</p>
          </div>
          <button
            onClick={handleCreateBackup}
            className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            <Archive className="h-4 w-4 mr-2" />
            Create Backup
          </button>
        </div>

        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <HardDrive className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{storageStats?.usedStorage} GB</p>
                <p className="text-sm text-gray-600">Used Storage</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(storageStats?.usedStorage / storageStats?.totalStorage) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{storageStats?.databaseSize} GB</p>
                <p className="text-sm text-gray-600">Database Size</p>
                <p className="text-xs text-gray-500 mt-1">{storageStats?.tableStats.reduce((sum, table) => sum + table.records, 0).toLocaleString()} total records</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Archive className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{storageStats?.backupSize} GB</p>
                <p className="text-sm text-gray-600">Backup Storage</p>
                <p className="text-xs text-gray-500 mt-1">{backups.length} backups available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'backups', label: 'Backups', icon: Archive },
                { id: 'storage', label: 'Storage Analysis', icon: BarChart3 },
                { id: 'maintenance', label: 'Maintenance', icon: RefreshCw }
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
            {/* Backups Tab */}
            {activeTab === 'backups' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Database Backups</h3>
                <div className="space-y-4">
                  {backups.map((backup) => {
                    const statusBadge = getStatusBadge(backup.status)
                    const StatusIcon = statusBadge.icon

                    return (
                      <div key={backup.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="font-medium text-gray-900 mr-3">{backup.name}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {backup.status}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <span>Size: {backup.size}</span>
                              <span>Type: {backup.type}</span>
                              <span>Created: {formatDate(backup.createdAt)}</span>
                            </div>
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">
                                Tables: {backup.tables.includes('all') ? 'All tables' : backup.tables.join(', ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDownloadBackup(backup.id)}
                              className="text-teachgage-blue hover:text-teachgage-medium-blue"
                              title="Download backup"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete backup"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Storage Analysis Tab */}
            {activeTab === 'storage' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Storage Analysis</h3>
                <div className="space-y-4">
                  {storageStats?.tableStats.map((table) => (
                    <div key={table.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">{table.name}</h4>
                        <p className="text-sm text-gray-600">{table.records.toLocaleString()} records</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{table.size}</p>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-teachgage-blue h-2 rounded-full" 
                            style={{ width: `${(parseFloat(table.size) / storageStats.databaseSize) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Database Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Optimize Database</h4>
                    <p className="text-sm text-gray-600 mb-4">Optimize database tables and indexes for better performance.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Run Optimization
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Clean Temporary Data</h4>
                    <p className="text-sm text-gray-600 mb-4">Remove temporary files and expired session data.</p>
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Clean Data
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Rebuild Indexes</h4>
                    <p className="text-sm text-gray-600 mb-4">Rebuild database indexes to improve query performance.</p>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Rebuild Indexes
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Archive Old Data</h4>
                    <p className="text-sm text-gray-600 mb-4">Archive data older than 2 years to reduce database size.</p>
                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      Archive Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
