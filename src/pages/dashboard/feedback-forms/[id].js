import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../components/common/Breadcrumb'
import { useAuth } from '../../../contexts/AuthContext'
import { demoSurveys } from '../../../data/demoData'
import { 
  ArrowLeft,
  Edit,
  Share2,
  Copy,
  BarChart3,
  Eye,
  Users,
  Calendar,
  MessageSquare,
  Star,
  CheckSquare,
  FileText,
  Settings,
  Play,
  Pause,
  Trash2,
  Download
} from 'lucide-react'
import { format } from 'date-fns'

export default function SurveyDetailPage() {
  const router = useRouter()
  const { id, tab } = router.query
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [form, setForm] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Update active tab when URL tab parameter changes
  useEffect(() => {
    if (tab && ['overview', 'responses', 'analytics', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [tab])

  useEffect(() => {
    if (id) {
      // Simulate API call to get survey details
      setTimeout(() => {
        const formData = demoSurveys.find(survey => survey.id === id) || {
          id,
          title: 'Course Evaluation Survey',
          description: 'Please provide your feedback on this course to help us improve.',
          status: 'active',
          anonymous: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          responseCount: 23,
          questions: [
            {
              id: 1,
              type: 'rating',
              question: 'How would you rate the overall quality of this course?',
              required: true,
              responses: 23
            },
            {
              id: 2,
              type: 'multiple_choice',
              question: 'Which aspect of the course did you find most valuable?',
              required: true,
              responses: 23
            },
            {
              id: 3,
              type: 'text',
              question: 'What suggestions do you have for improving this course?',
              required: false,
              responses: 18
            }
          ],
          course: {
            id: 'course-1',
            name: 'Introduction to React',
            code: 'CS101'
          }
        }
        setForm(formData)
        setIsLoading(false)
      }, 1000)
    }
  }, [id])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth/signin')
    return null
  }

  if (!form) {
    return (
      <DashboardLayout title="Survey Not Found">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-teachgage-blue mb-2">Survey Not Found</h2>
          <p className="text-teachgage-navy mb-6">The survey you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard/feedback-forms">
            <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/survey/${form.id}`
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  const handleStatusChange = async (newStatus) => {
    // Simulate API call
    setForm(prev => ({ ...prev, status: newStatus }))
  }

  const breadcrumbItems = [
    { name: 'Surveys', href: '/dashboard/feedback-forms', icon: MessageSquare },
    { name: form.title }
  ]

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'responses', name: 'Responses', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'rating': return Star
      case 'multiple_choice': return CheckSquare
      case 'text': return MessageSquare
      default: return FileText
    }
  }

  return (
    <>
      <Head>
        <title>{form.title} - TeachGage</title>
        <meta name="description" content={form.description} />
      </Head>

      <DashboardLayout title={form.title}>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-teachgage-blue">{form.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    form.status === 'active' 
                      ? 'bg-teachgage-green text-white'
                      : form.status === 'draft'
                        ? 'bg-gray-100 text-teachgage-navy'
                        : 'bg-teachgage-orange text-white'
                  }`}>
                    {form.status?.charAt(0).toUpperCase() + form.status?.slice(1)}
                  </span>
                </div>
                
                <p className="text-teachgage-navy mb-4">{form.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-teachgage-navy">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{form.responseCount || 0} Responses</span>
                  </div>
                  <div className="flex items-center text-teachgage-navy">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span>{form.questions?.length || 0} Questions</span>
                  </div>
                  <div className="flex items-center text-teachgage-navy">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Created {format(new Date(form.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  {form.course && (
                    <div className="flex items-center text-teachgage-navy">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{form.course.name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-6">
                {form.status === 'active' && (
                  <>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 text-teachgage-navy hover:text-teachgage-blue border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Copy form link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-teachgage-navy hover:text-teachgage-blue border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                
                <div className="flex items-center space-x-2">
                  {form.status === 'active' ? (
                    <button
                      onClick={() => handleStatusChange('draft')}
                      className="inline-flex items-center px-3 py-2 bg-teachgage-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange('active')}
                      className="inline-flex items-center px-3 py-2 bg-teachgage-green text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Activate
                    </button>
                  )}
                  
                  <Link href={`/dashboard/feedback-forms/${form.id}/edit`}>
                    <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Form
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-teachgage-blue text-teachgage-blue'
                          : 'border-transparent text-teachgage-navy hover:text-teachgage-blue hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Form Questions</h3>
                    <div className="space-y-4">
                      {form.questions?.map((question, index) => {
                        const Icon = getQuestionTypeIcon(question.type)
                        return (
                          <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <Icon className="w-4 h-4 text-teachgage-blue mr-2" />
                                  <span className="text-sm font-medium text-teachgage-navy">
                                    Question {index + 1} • {question.type.replace('_', ' ')}
                                    {question.required && <span className="text-red-500 ml-1">*</span>}
                                  </span>
                                </div>
                                <p className="text-teachgage-blue font-medium">{question.question}</p>
                              </div>
                              <div className="text-right text-sm text-teachgage-navy">
                                <div>{question.responses || 0} responses</div>
                                <div className="text-xs text-gray-500">
                                  {Math.round(((question.responses || 0) / (form.responseCount || 1)) * 100)}% completion
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {form.status === 'active' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-teachgage-green rounded-full mr-3"></div>
                        <div>
                          <h4 className="font-medium text-teachgage-blue">Form is Live</h4>
                          <p className="text-sm text-teachgage-navy">
                            Students can access this form at: <code className="bg-gray-100 px-2 py-1 rounded text-xs">/survey/{form.id}</code>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Responses Tab */}
              {activeTab === 'responses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-teachgage-blue">Recent Responses</h3>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                  
                  {form.responseCount > 0 ? (
                    <div className="space-y-4">
                      {Array.from({ length: Math.min(form.responseCount, 5) }, (_, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-teachgage-navy">
                              Response #{form.responseCount - i}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(Date.now() - i * 86400000), 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>
                          <div className="text-sm text-teachgage-navy">
                            Anonymous response • {form.questions?.length || 0} questions answered
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-4">
                        <Link href={`/dashboard/feedback-forms/${form.id}/responses`}>
                          <button className="text-teachgage-blue hover:text-teachgage-medium-blue font-medium">
                            View All {form.responseCount} Responses
                          </button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-teachgage-blue mb-2">No Responses Yet</h3>
                      <p className="text-teachgage-navy mb-6">Share your form to start collecting feedback.</p>
                      {form.status === 'active' && (
                        <button
                          onClick={handleCopyLink}
                          className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Form Link
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-teachgage-blue">Response Analytics</h3>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-teachgage-blue rounded-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-teachgage-navy">Total Responses</p>
                          <p className="text-2xl font-bold text-teachgage-blue">{form.responseCount || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-teachgage-green rounded-lg">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-teachgage-navy">Completion Rate</p>
                          <p className="text-2xl font-bold text-teachgage-blue">87%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-teachgage-orange rounded-lg">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-teachgage-navy">Avg. Rating</p>
                          <p className="text-2xl font-bold text-teachgage-blue">4.2</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-teachgage-navy">Days Active</p>
                          <p className="text-2xl font-bold text-teachgage-blue">12</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Charts placeholder */}
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-teachgage-blue mb-2">Detailed Analytics Coming Soon</h4>
                    <p className="text-teachgage-navy">Advanced charts and insights will be available in the next update.</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-teachgage-blue">Form Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-teachgage-blue mb-4">Status & Visibility</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-teachgage-navy">Form Status</div>
                            <div className="text-sm text-gray-500">Control whether the form accepts responses</div>
                          </div>
                          <select
                            value={form.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-teachgage-navy">Anonymous Responses</div>
                            <div className="text-sm text-gray-500">Collect responses without identifying users</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.anonymous}
                              onChange={(e) => setForm(prev => ({ ...prev, anonymous: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teachgage-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teachgage-blue"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                      <p className="text-sm text-red-600 mb-4">
                        Once you delete a form, there is no going back. This will permanently delete the form and all its responses.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Delete Form
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
