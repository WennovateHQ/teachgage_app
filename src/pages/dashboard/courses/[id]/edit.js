import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../../components/layout/DashboardLayout'
import { useAuth } from '../../../../contexts/AuthContext'
import { getDemoCourseById } from '../../../../data/demoData'
import { 
  ArrowLeft,
  Save,
  X,
  Calendar,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function EditCoursePage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    startDate: '',
    endDate: '',
    maxStudents: '',
    status: 'draft',
    category: '',
    prerequisites: '',
    learningObjectives: ''
  })

  useEffect(() => {
    if (id) {
      const courseData = getDemoCourseById(id)
      if (courseData) {
        setCourse(courseData)
        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          code: courseData.code || '',
          startDate: courseData.startDate ? courseData.startDate.split('T')[0] : '',
          endDate: courseData.endDate ? courseData.endDate.split('T')[0] : '',
          maxStudents: courseData.maxStudents?.toString() || '',
          status: courseData.status || 'draft',
          category: courseData.category || '',
          prerequisites: courseData.prerequisites || '',
          learningObjectives: courseData.learningObjectives || ''
        })
      }
      setIsLoading(false)
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

  if (!course) {
    return (
      <DashboardLayout title="Course Not Found">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-teachgage-blue mb-2">Course Not Found</h2>
          <p className="text-teachgage-navy mb-6">The course you're trying to edit doesn't exist or you don't have access to it.</p>
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    // Basic validation
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Course title is required.' })
      setIsSaving(false)
      return
    }

    if (!formData.code.trim()) {
      setMessage({ type: 'error', text: 'Course code is required.' })
      setIsSaving(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMessage({ type: 'success', text: 'Course updated successfully!' })
      
      // Redirect after successful save
      setTimeout(() => {
        router.push(`/dashboard/courses/${id}`)
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update course. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/courses/${id}`)
  }

  return (
    <>
      <Head>
        <title>Edit {course.title} - TeachGage</title>
        <meta name="description" content={`Edit course: ${course.title}`} />
      </Head>

      <DashboardLayout title={`Edit ${course.title}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-teachgage-navy">
            <Link href="/dashboard" className="hover:text-teachgage-blue">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/courses" className="hover:text-teachgage-blue">Courses</Link>
            <span>/</span>
            <Link href={`/dashboard/courses/${id}`} className="hover:text-teachgage-blue">{course.title}</Link>
            <span>/</span>
            <span className="text-teachgage-blue font-medium">Edit</span>
          </nav>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Edit Course</h1>
              <p className="text-teachgage-navy">Update course information and settings</p>
            </div>
            <Link href={`/dashboard/courses/${id}`}>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </button>
            </Link>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          )}

          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-teachgage-blue mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="Enter course title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="e.g., CS101"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-teachgage-navy mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    placeholder="Describe what this course covers..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="computer-science">Computer Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="business">Business</option>
                      <option value="engineering">Engineering</option>
                      <option value="arts">Arts & Humanities</option>
                      <option value="science">Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule & Enrollment */}
              <div>
                <h2 className="text-lg font-semibold text-teachgage-blue mb-4">Schedule & Enrollment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Max Students
                    </label>
                    <input
                      type="number"
                      name="maxStudents"
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="e.g., 30"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h2 className="text-lg font-semibold text-teachgage-blue mb-4">Additional Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Prerequisites
                    </label>
                    <textarea
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="List any prerequisites for this course..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-teachgage-navy mb-2">
                      Learning Objectives
                    </label>
                    <textarea
                      name="learningObjectives"
                      value={formData.learningObjectives}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="What will students learn in this course?"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
