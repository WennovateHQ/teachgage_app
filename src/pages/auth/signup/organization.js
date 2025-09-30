import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

export default function OrganizationSignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'university',
    organizationSize: '50-200',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const [validationErrors, setValidationErrors] = useState({})

  const organizationTypes = [
    { value: 'university', label: 'University/College' },
    { value: 'k12_school', label: 'K-12 School' },
    { value: 'training_center', label: 'Training Center' },
    { value: 'corporate', label: 'Corporate Training' },
    { value: 'government', label: 'Government Agency' },
    { value: 'nonprofit', label: 'Non-Profit Organization' }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) setError('')
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.organizationName.trim()) errors.organizationName = 'Organization name is required'
    if (!formData.address.trim()) errors.address = 'Address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.state.trim()) errors.state = 'State is required'
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required'
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required'
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/auth/signup/success?type=organization&email=${encodeURIComponent(formData.email)}`)
      } else {
        setError(data.message || 'Failed to create organization account')
      }
    } catch (error) {
      console.error('Organization signup error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create Organization Account - TeachGage</title>
        <meta name="description" content="Create an organization account for TeachGage" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Building2 className="mx-auto h-12 w-12 text-teachgage-blue" />
            <h1 className="mt-4 text-3xl font-extrabold text-teachgage-blue">
              Create Organization Account
            </h1>
            <p className="mt-2 text-sm text-teachgage-navy">
              Set up your organization's TeachGage account with a 30-day free trial
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Information */}
              <div>
                <h2 className="text-lg font-semibold text-teachgage-blue mb-4">
                  Organization Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.organizationName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your organization name"
                    />
                    {validationErrors.organizationName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.organizationName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Type
                    </label>
                    <select
                      id="organizationType"
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue"
                    >
                      {organizationTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="organizationSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Size
                    </label>
                    <select
                      id="organizationSize"
                      name="organizationSize"
                      value={formData.organizationSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue"
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501+">501+ employees</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Street address"
                    />
                    {validationErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    {validationErrors.city && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    {validationErrors.state && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.zipCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="ZIP Code"
                    />
                    {validationErrors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Administrator Account */}
              <div>
                <h2 className="text-lg font-semibold text-teachgage-blue mb-4">
                  Administrator Account
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="First name"
                    />
                    {validationErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Last name"
                    />
                    {validationErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="admin@organization.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.jobTitle ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Director of Academic Affairs"
                    />
                    {validationErrors.jobTitle && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.jobTitle}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                          validationErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Must be 8+ characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trial Benefits */}
              <div className="bg-teachgage-cream p-6 rounded-lg">
                <h3 className="text-lg font-medium text-teachgage-blue mb-3">
                  Your 30-Day Free Trial Includes:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-teachgage-green mr-2" />
                    <span className="text-sm text-teachgage-navy">Unlimited Surveys</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-teachgage-green mr-2" />
                    <span className="text-sm text-teachgage-navy">Advanced Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-teachgage-green mr-2" />
                    <span className="text-sm text-teachgage-navy">User Management</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-teachgage-green mr-2" />
                    <span className="text-sm text-teachgage-navy">Priority Support</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded mt-1"
                  />
                  <div className="ml-3">
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-teachgage-blue hover:text-teachgage-orange">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-teachgage-blue hover:text-teachgage-orange">
                        Privacy Policy
                      </Link>
                    </label>
                    {validationErrors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.agreeToTerms}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teachgage-blue hover:bg-teachgage-medium-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teachgage-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Start Free Trial'
                  )}
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-teachgage-navy">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-teachgage-blue hover:text-teachgage-orange font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
