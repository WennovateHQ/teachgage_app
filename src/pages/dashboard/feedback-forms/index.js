import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { useFeedbackForms, useDeleteFeedbackForm } from '../../../hooks/useApi'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Copy,
  Share2,
  BarChart3,
  FileText,
  Calendar,
  Users
} from 'lucide-react'
import { format } from 'date-fns'

export default function FeedbackFormsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formToDelete, setFormToDelete] = useState(null)

  const { data: formsData, isLoading: formsLoading, error } = useFeedbackForms({
    search: searchTerm,
    status: filterStatus !== 'all' ? filterStatus : undefined
  })

  const deleteForm = useDeleteFeedbackForm()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth/signin')
    return null
  }

  const handleDeleteForm = async () => {
    if (formToDelete) {
      try {
        await deleteForm.mutateAsync(formToDelete.id)
        setShowDeleteModal(false)
        setFormToDelete(null)
      } catch (error) {
        console.error('Error deleting form:', error)
      }
    }
  }

  const handleCopyLink = (formId) => {
    const link = `${window.location.origin}/feedback/${formId}`
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  const forms = formsData?.data || []

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || form.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <Head>
        <title>Surveys - TeachGage</title>
        <meta name="description" content="Manage your surveys" />
      </Head>

      <DashboardLayout title="Surveys">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
              <p className="text-gray-600">Create and manage anonymous surveys for your courses</p>
            </div>
            <Link href="/dashboard/feedback-forms/create">
              <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Create Survey
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Forms List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                        <div className="flex space-x-4">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">Failed to load feedback forms. Please try again.</p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback forms found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first feedback form.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link href="/dashboard/feedback-forms/create">
                  <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Form
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredForms.map((form) => (
                <div key={form.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {form.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            form.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : form.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {form.status?.charAt(0).toUpperCase() + form.status?.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {form.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Created {form.createdAt ? format(new Date(form.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{form.responseCount || 0} responses</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            <span>{form.questionCount || 0} questions</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {form.status === 'active' && (
                          <>
                            <button 
                              onClick={() => handleCopyLink(form.id)}
                              className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors"
                              title="Copy form link"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        <Link href={`/dashboard/feedback-forms/${form.id}?tab=analytics`}>
                          <button className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors">
                            <BarChart3 className="h-4 w-4" />
                          </button>
                        </Link>
                        
                        <Link href={`/dashboard/feedback-forms/${form.id}`}>
                          <button className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        
                        <Link href={`/dashboard/feedback-forms/${form.id}?tab=settings`}>
                          <button className="p-2 text-gray-400 hover:text-teachgage-blue transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        
                        <button 
                          onClick={() => {
                            setFormToDelete(form)
                            setShowDeleteModal(true)
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {form.course && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Course:</span>
                          <span className="ml-2">{form.course.name}</span>
                          {form.course.code && (
                            <span className="ml-2 text-gray-400">({form.course.code})</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Feedback Form</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{formToDelete?.title}"? This will also delete all associated responses. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setFormToDelete(null)
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteForm}
                  disabled={deleteForm.isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteForm.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  )
}
