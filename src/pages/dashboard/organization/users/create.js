import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../../components/common/Breadcrumb'
import { useAuth } from '../../../../contexts/AuthContext'
import { 
  User, 
  Mail, 
  Building2, 
  Save, 
  X,
  Eye,
  EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateUserPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'instructor',
    departmentId: '',
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true,
    requirePasswordChange: true
  })

  const [errors, setErrors] = useState({})

  // Mock departments data
  const departments = [
    { id: 'dept_1', name: 'Computer Science' },
    { id: 'dept_2', name: 'Mathematics' },
    { id: 'dept_3', name: 'Physics' },
    { id: 'dept_4', name: 'Engineering' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('User created successfully!')
      router.push('/dashboard/organization/users')
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/organization/users')
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Users', href: '/dashboard/organization/users' },
    { label: 'Create User', href: '/dashboard/organization/users/create' }
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated || user?.role !== 'organization_admin') {
    router.push('/dashboard')
    return null
  }

  return (
    <>
      <Head>
        <title>Create User - TeachGage</title>
        <meta name="description" content="Create a new user for your organization" />
      </Head>

      <DashboardLayout title="Create User">
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Create New User</h1>
              <p className="text-teachgage-navy">Add a new instructor or staff member to your organization</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter first name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter last name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="instructor">Instructor</option>
                      <option value="department_admin">Department Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <select
                        value={formData.departmentId}
                        onChange={(e) => handleInputChange('departmentId', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                          errors.departmentId ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.departmentId && (
                      <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Setup */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Setup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temporary Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter temporary password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendWelcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked)}
                      className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                    />
                    <label htmlFor="sendWelcomeEmail" className="ml-2 text-sm text-gray-700">
                      Send welcome email with login instructions
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requirePasswordChange"
                      checked={formData.requirePasswordChange}
                      onChange={(e) => handleInputChange('requirePasswordChange', e.target.checked)}
                      className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                    />
                    <label htmlFor="requirePasswordChange" className="ml-2 text-sm text-gray-700">
                      Require password change on first login
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  )
}
