import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { questionnaireAPI } from '../../../utils/api'
import { 
  Plus, 
  Search, 
  ClipboardList, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Filter,
  MoreVertical,
  FileText,
  Calendar
} from 'lucide-react'

export default function QuestionnairesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [questionnaires, setQuestionnaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (isAuthenticated) {
      loadQuestionnaires()
    }
  }, [isAuthenticated])

  const loadQuestionnaires = async () => {
    try {
      setLoading(true)
      const response = await questionnaireAPI.getQuestionnaires()
      console.log('Questionnaires API response:', response.data)
      
      // Handle various response formats
      let data = []
      if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data
      } else if (response.data?.questionnaires && Array.isArray(response.data.questionnaires)) {
        data = response.data.questionnaires
      } else if (Array.isArray(response.data)) {
        data = response.data
      }
      
      console.log('Parsed questionnaires:', data)
      setQuestionnaires(data)
    } catch (error) {
      console.error('Failed to load questionnaires:', error)
      setMessage({ type: 'error', text: 'Failed to load questionnaires. Please try again.' })
      setQuestionnaires([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this questionnaire?')) return
    try {
      await questionnaireAPI.deleteQuestionnaire(id)
      setMessage({ type: 'success', text: 'Questionnaire deleted successfully' })
      loadQuestionnaires()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete questionnaire' })
    }
  }

  const handleClone = async (id) => {
    try {
      await questionnaireAPI.cloneQuestionnaire(id, {})
      setMessage({ type: 'success', text: 'Questionnaire cloned successfully' })
      loadQuestionnaires()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clone questionnaire' })
    }
  }

  const filteredQuestionnaires = Array.isArray(questionnaires) ? questionnaires.filter(q => {
    const matchesSearch = q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || q.status === filterStatus
    return matchesSearch && matchesFilter
  }) : []

  if (isLoading) {
    return (
      <DashboardLayout title="Questionnaires">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Questionnaires">
      <Head>
        <title>Questionnaires | TeachGage</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Questionnaires</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage questionnaire templates for your surveys
            </p>
          </div>
          <Link
            href="/dashboard/questionnaires/create"
            className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Questionnaire
          </Link>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search questionnaires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Questionnaires List */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
          </div>
        ) : filteredQuestionnaires.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questionnaires yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first questionnaire to start building surveys.
            </p>
            <Link
              href="/dashboard/questionnaires/create"
              className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Questionnaire
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuestionnaires.map((q) => (
              <div
                key={q._id || q.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {q.title}
                      </h3>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        q.status === 'published' ? 'bg-green-100 text-green-700' :
                        q.status === 'archived' ? 'bg-gray-100 text-gray-600' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {q.status || 'draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {q.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {q.questions?.length || 0} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                      {q.purpose && (
                        <span className="capitalize">{q.purpose.replace(/_/g, ' ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/dashboard/questionnaires/${q._id || q.id}`)}
                      className="p-2 text-gray-400 hover:text-teachgage-blue hover:bg-blue-50 rounded-lg transition-colors"
                      title="View/Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleClone(q._id || q.id)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Clone"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q._id || q.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
