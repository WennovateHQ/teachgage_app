import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../components/common/Breadcrumb'
import { useAuth } from '../../../contexts/AuthContext'
import { courseAPI, surveyAPI } from '../../../utils/api'
import { 
  ArrowLeft,
  Edit,
  Share2,
  MoreVertical,
  Users,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  BarChart3,
  MessageSquare,
  Plus,
  Eye,
  Settings,
  Copy,
  Download
} from 'lucide-react'
import { format } from 'date-fns'
import EnrollmentCSVUpload from '../../../components/courses/EnrollmentCSVUpload'

export default function CourseDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [course, setCourse] = useState(null)
  const [surveys, setSurveys] = useState([])
  const [courseAnalytics, setCourseAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showCSVUpload, setShowCSVUpload] = useState(false)

  const loadCourseData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [courseRes, surveysRes, analyticsRes] = await Promise.allSettled([
        courseAPI.getCourse(id),
        surveyAPI.getSurveys({ courseId: id }),
        courseAPI.getCourseAnalytics(id),
      ]);

      if (courseRes.status === 'fulfilled') {
        const courseData = courseRes.value.data?.data || courseRes.value.data;
        setCourse(courseData ? { ...courseData, id: courseData.id || courseData._id } : null);
      }

      if (surveysRes.status === 'fulfilled') {
        const surveysData = surveysRes.value.data?.data?.surveys || surveysRes.value.data?.data || surveysRes.value.data?.surveys || [];
        setSurveys(surveysData.map(s => ({ ...s, id: s.id || s._id })));
      }

      if (analyticsRes.status === 'fulfilled') {
        const analyticsData = analyticsRes.value.data?.data || analyticsRes.value.data;
        setCourseAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Failed to load course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
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

  if (!course) {
    return (
      <DashboardLayout title="Course Not Found">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-teachgage-blue mb-2">Course Not Found</h2>
          <p className="text-teachgage-navy mb-6">The course you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard/courses">
            <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/courses/${course.id}`
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'surveys', name: 'Surveys', icon: MessageSquare },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ]

  const breadcrumbItems = [
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: course.name || course.title }
  ]

  return (
    <>
      <Head>
        <title>{course.name || course.title} - TeachGage</title>
        <meta name="description" content={course.description} />
      </Head>

      <DashboardLayout title={course.name || course.title}>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-teachgage-blue">{course.name || course.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.status === 'active' 
                      ? 'bg-teachgage-green text-white'
                      : course.status === 'draft'
                        ? 'bg-gray-100 text-teachgage-navy'
                        : 'bg-teachgage-orange text-white'
                  }`}>
                    {course.status?.charAt(0).toUpperCase() + course.status?.slice(1)}
                  </span>
                </div>
                
                <p className="text-teachgage-navy mb-4">{course.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-teachgage-navy">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{course.currentStudents || 0}/{course.capacity || course.maxStudents || 30} Students</span>
                  </div>
                  <div className="flex items-center text-teachgage-navy">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{course.startDate ? format(new Date(course.startDate), 'MMM d, yyyy') : 'TBD'}</span>
                  </div>
                  <div className="flex items-center text-teachgage-navy">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{course.duration || (course.startDate && course.endDate ? `${Math.ceil((new Date(course.endDate) - new Date(course.startDate)) / (1000 * 60 * 60 * 24 * 7))} weeks` : 'TBD')}</span>
                  </div>
                  <div className="flex items-center text-teachgage-navy">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{course.code}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-6">
                <button
                  onClick={handleCopyLink}
                  className="p-2 text-teachgage-navy hover:text-teachgage-blue border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Copy course link"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-teachgage-navy hover:text-teachgage-blue border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <Link href={`/dashboard/courses/${course.id}/edit`}>
                  <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Course
                  </button>
                </Link>
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Course Description</h3>
                      <div className="prose max-w-none text-teachgage-navy">
                        <p>{course.description || 'No description provided.'}</p>
                        
                        {course.objectives && course.objectives.length > 0 && (
                          <>
                            <h4 className="text-teachgage-blue font-semibold mt-6 mb-3">Learning Objectives</h4>
                            <ul className="list-disc pl-6 space-y-1">
                              {course.objectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                              ))}
                            </ul>
                          </>
                        )}
                        
                        {course.prerequisites && course.prerequisites.length > 0 && (
                          <>
                            <h4 className="text-teachgage-blue font-semibold mt-6 mb-3">Prerequisites</h4>
                            <ul className="list-disc pl-6 space-y-1">
                              {course.prerequisites.map((prereq, index) => (
                                <li key={index}>{prereq}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Course Details</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-teachgage-navy">Enrollment</span>
                            <span className="text-sm text-teachgage-blue">{Math.round(((course.currentStudents || 0) / (course.capacity || course.maxStudents || 30)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-teachgage-blue h-2 rounded-full"
                              style={{ width: `${((course.currentStudents || 0) / (course.capacity || course.maxStudents || 30)) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-teachgage-navy mt-1">{course.currentStudents || 0} of {course.capacity || course.maxStudents || 30} students</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-teachgage-navy">Start Date:</span>
                            <span className="text-sm font-medium text-teachgage-blue">{course.startDate ? format(new Date(course.startDate), 'MMM d, yyyy') : 'TBD'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-teachgage-navy">End Date:</span>
                            <span className="text-sm font-medium text-teachgage-blue">{course.endDate ? format(new Date(course.endDate), 'MMM d, yyyy') : 'TBD'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-teachgage-navy">Duration:</span>
                            <span className="text-sm font-medium text-teachgage-blue">{course.duration || (course.startDate && course.endDate ? `${Math.ceil((new Date(course.endDate) - new Date(course.startDate)) / (1000 * 60 * 60 * 24 * 7))} weeks` : 'TBD')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-teachgage-navy">Course Code:</span>
                            <span className="text-sm font-medium text-teachgage-blue">{course.code}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Surveys Tab */}
              {activeTab === 'surveys' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-teachgage-blue">Course Surveys</h3>
                    <Link href={`/dashboard/feedback-forms/create?courseId=${course.id}`}>
                      <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Survey
                      </button>
                    </Link>
                  </div>
                  
                  {surveys.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-teachgage-blue mb-2">No Surveys Yet</h3>
                      <p className="text-teachgage-navy mb-6">Create your first survey to collect feedback from students.</p>
                      <Link href={`/dashboard/feedback-forms/create?courseId=${course.id}`}>
                        <button className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Survey
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {surveys.map((survey) => (
                        <div key={survey.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="font-semibold text-teachgage-blue">{survey.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              survey.status === 'active' 
                                ? 'bg-teachgage-green text-white'
                                : survey.status === 'draft'
                                  ? 'bg-gray-100 text-teachgage-navy'
                                  : 'bg-teachgage-orange text-white'
                            }`}>
                              {survey.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-teachgage-navy mb-4">{survey.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-teachgage-navy mb-4">
                            <span>{survey.responses || 0} responses</span>
                            <span>{survey.questions?.length || 0} questions</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link href={`/dashboard/feedback-forms/${survey.id}`}>
                              <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs bg-gray-100 text-teachgage-navy rounded hover:bg-gray-200 transition-colors">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </button>
                            </Link>
                            <Link href={`/dashboard/feedback-forms/${survey.id}/analytics`}>
                              <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs bg-teachgage-blue text-white rounded hover:bg-teachgage-medium-blue transition-colors">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                Analytics
                              </button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Students Tab */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-teachgage-blue">Enrolled Students</h3>
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Export List
                      </button>
                      <button 
                        onClick={() => setShowCSVUpload(true)}
                        className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Enroll Students
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teachgage-navy uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teachgage-navy uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teachgage-navy uppercase tracking-wider">Enrolled</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teachgage-navy uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teachgage-navy uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Sample student data */}
                        {Array.from({ length: Math.min(course.currentStudents, 10) }, (_, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {String.fromCharCode(65 + i)}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-teachgage-blue">Student {i + 1}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-teachgage-navy">
                              student{i + 1}@university.edu
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-teachgage-navy">
                              {course.startDate ? format(new Date(course.startDate), 'MMM d, yyyy') : 'TBD'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-teachgage-green text-white">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-teachgage-blue hover:text-teachgage-medium-blue mr-3">View</button>
                              <button className="text-red-600 hover:text-red-900">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-teachgage-blue">Course Analytics</h3>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-teachgage-blue rounded-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-teachgage-navy">Total Students</p>
                          <p className="text-2xl font-bold text-teachgage-blue">{course.currentStudents}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-teachgage-green rounded-lg">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-teachgage-navy">Survey Responses</p>
                          <p className="text-2xl font-bold text-teachgage-blue">{surveys.reduce((acc, survey) => acc + (survey.responses || 0), 0)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-teachgage-orange rounded-lg">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-teachgage-navy">Avg. Rating</p>
                          <p className="text-2xl font-bold text-teachgage-blue">
                            {courseAnalytics?.averageRating?.toFixed(1) || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-teachgage-navy">Completion Rate</p>
                          <p className="text-2xl font-bold text-teachgage-blue">
                            {courseAnalytics?.completionRate ? `${Math.round(courseAnalytics.completionRate)}%` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Summary */}
                  {courseAnalytics ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="text-md font-semibold text-teachgage-blue mb-4">Performance Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-teachgage-navy">Total Enrollments</span>
                          <span className="text-sm font-medium text-teachgage-blue">{course?.currentStudents || course?.enrollment_count || 0}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-teachgage-navy">Active Surveys</span>
                          <span className="text-sm font-medium text-teachgage-blue">{surveys.filter(s => s.status === 'active').length}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-teachgage-navy">Total Responses</span>
                          <span className="text-sm font-medium text-teachgage-blue">{courseAnalytics?.totalResponses || surveys.reduce((acc, s) => acc + (s.responseCount || s.responses || 0), 0)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-teachgage-navy">Response Rate</span>
                          <span className="text-sm font-medium text-teachgage-blue">{courseAnalytics?.responseRate ? `${Math.round(courseAnalytics.responseRate)}%` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-teachgage-blue mb-2">No Analytics Data Yet</h4>
                      <p className="text-teachgage-navy">Analytics will appear once surveys receive responses.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* CSV Upload Modal */}
      {showCSVUpload && (
        <EnrollmentCSVUpload
          courseId={id}
          courseName={course?.name}
          onClose={() => setShowCSVUpload(false)}
          onSuccess={() => {
            setShowCSVUpload(false)
            // Refresh course data to show new students
            loadCourseData()
          }}
        />
      )}
    </>
  )
}
