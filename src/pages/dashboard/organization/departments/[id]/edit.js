import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../../../components/common/Breadcrumb'
import { useAuth } from '../../../../../contexts/AuthContext'
import { 
  demoDepartments,
  demoUsers,
  demoOrganizations
} from '../../../../../data/demoData'
import { 
  Building,
  Save,
  X,
  Users
} from 'lucide-react'

export default function EditDepartmentPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading } = useAuth()
  const [department, setDepartment] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [departmentUsers, setDepartmentUsers] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    headId: '',
    email: '',
    phone: '',
    location: ''
  })

  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/signin')
      return
    }

    if (user && user.role !== 'organization_admin') {
      router.push('/dashboard')
      return
    }

    if (id && user?.organizationId) {
      loadDepartmentData()
    }
  }, [id, user, isAuthenticated, isLoading, router])

  const loadDepartmentData = () => {
    try {
      // Get department details
      const deptData = demoDepartments.find(dept => 
        dept.id === id && dept.organizationId === user.organizationId
      )
      
      if (!deptData) {
        router.push('/dashboard/organization/departments')
        return
      }
      
      setDepartment(deptData)
      setFormData({
        name: deptData.name || '',
        code: deptData.code || '',
        description: deptData.description || '',
        headId: deptData.headId || '',
        email: deptData.email || '',
        phone: deptData.phone || '',
        location: deptData.location || ''
      })

      // Get organization details
      const orgData = demoOrganizations.find(org => org.id === user.organizationId)
      setOrganization(orgData)

      // Get department users for head selection
      const deptUsers = demoUsers.organizationInstructors.filter(
        instructor => instructor.departmentId === id && instructor.organizationId === user.organizationId
      )
      setDepartmentUsers(deptUsers)
    } catch (error) {
      console.error('Failed to load department data:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Department name is required'
    }

    if (!formData.code.trim()) {
      errors.code = 'Department code is required'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email format is invalid'
    }

    return errors
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would call the backend API
      alert('Department updated successfully!')
      router.push(`/dashboard/organization/departments/${id}`)
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to update department. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/organization/departments/${id}`)
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Departments', href: '/dashboard/organization/departments' },
    { label: department?.name || 'Department', href: `/dashboard/organization/departments/${id}` },
    { label: 'Edit', href: `/dashboard/organization/departments/${id}/edit` }
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

  if (!department) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Department Not Found</h3>
          <p className="text-gray-500 mb-6">
            The department you're trying to edit doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => router.push('/dashboard/organization/departments')}
            className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            Back to Departments
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Edit {department.name} - TeachGage</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Edit Department</h1>
              <p className="text-teachgage-navy">
                Update department information for {organization?.name}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSave}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Basic Information</h3>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                        validationErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Computer Science"
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                      Department Code *
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                        validationErrors.code ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., CS"
                    />
                    {validationErrors.code && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.code}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="Brief description of the department"
                    />
                  </div>

                  {/* Department Head */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Department Head</h3>
                  </div>

                  <div>
                    <label htmlFor="headId" className="block text-sm font-medium text-gray-700 mb-1">
                      Department Head
                    </label>
                    <select
                      id="headId"
                      name="headId"
                      value={formData.headId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="">Select department head</option>
                      {departmentUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contact Information */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Contact Information</h3>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Department Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                        validationErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="department@organization.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      placeholder="Building name, floor, room number"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
