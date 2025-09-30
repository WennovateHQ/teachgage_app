import { useState } from 'react'
import { X, Building2, Mail, Phone, MapPin, Users, CreditCard } from 'lucide-react'

export default function CreateOrganizationModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Organization Info
    name: '',
    type: 'academic',
    website: '',
    description: '',
    
    // Contact Info
    email: '',
    phone: '',
    
    // Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Subscription
    subscriptionTier: 'basic',
    maxUsers: 50,
    
    // Admin User
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: ''
  })

  const [validationErrors, setValidationErrors] = useState({})

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

  const validateStep = (stepNumber) => {
    const errors = {}

    if (stepNumber === 1) {
      if (!formData.name.trim()) errors.name = 'Organization name is required'
      if (!formData.email.trim()) errors.email = 'Email is required'
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email format is invalid'
      }
    }

    if (stepNumber === 2) {
      if (!formData.street.trim()) errors.street = 'Street address is required'
      if (!formData.city.trim()) errors.city = 'City is required'
      if (!formData.state.trim()) errors.state = 'State is required'
      if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required'
    }

    if (stepNumber === 3) {
      if (!formData.adminFirstName.trim()) errors.adminFirstName = 'First name is required'
      if (!formData.adminLastName.trim()) errors.adminLastName = 'Last name is required'
      if (!formData.adminEmail.trim()) errors.adminEmail = 'Admin email is required'
      if (formData.adminEmail && !/\S+@\S+\.\S+/.test(formData.adminEmail)) {
        errors.adminEmail = 'Email format is invalid'
      }
    }

    return errors
  }

  const handleNext = () => {
    const errors = validateStep(step)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    const errors = validateStep(3)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would call the backend API
      console.log('Creating organization:', formData)
      
      onSuccess()
    } catch (error) {
      console.error('Error creating organization:', error)
      alert('Failed to create organization. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const subscriptionTiers = [
    { value: 'basic', label: 'Basic', maxUsers: 50, price: '$29/month' },
    { value: 'professional', label: 'Professional', maxUsers: 200, price: '$99/month' },
    { value: 'enterprise', label: 'Enterprise', maxUsers: 1000, price: '$299/month' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="w-6 h-6 text-teachgage-blue mr-2" />
            <h2 className="text-xl font-semibold text-teachgage-blue">
              Create New Organization
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step 
                    ? 'bg-teachgage-blue text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNum < step ? 'bg-teachgage-blue' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Organization Info</span>
            <span>Address & Subscription</span>
            <span>Admin Account</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Organization Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name *
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
                    placeholder="e.g., Stanford University"
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  >
                    <option value="academic">Academic Institution</option>
                    <option value="corporate">Corporate</option>
                    <option value="nonprofit">Non-Profit</option>
                    <option value="government">Government</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email *
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
                    placeholder="contact@organization.com"
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
                    placeholder="Brief description of the organization"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address & Subscription */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                        validationErrors.street ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {validationErrors.street && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.street}</p>
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                        validationErrors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="San Francisco"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                        validationErrors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="CA"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                        validationErrors.zipCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="94105"
                    />
                    {validationErrors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptionTiers.map((tier) => (
                    <div
                      key={tier.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.subscriptionTier === tier.value
                          ? 'border-teachgage-blue bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        subscriptionTier: tier.value,
                        maxUsers: tier.maxUsers 
                      }))}
                    >
                      <div className="text-center">
                        <h4 className="font-medium text-gray-900">{tier.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">{tier.price}</p>
                        <p className="text-sm text-gray-600">Up to {tier.maxUsers} users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Admin Account */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Administrator Account</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adminFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="adminFirstName"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                      validationErrors.adminFirstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {validationErrors.adminFirstName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.adminFirstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="adminLastName"
                    name="adminLastName"
                    value={formData.adminLastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                      validationErrors.adminLastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {validationErrors.adminLastName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.adminLastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                      validationErrors.adminEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="admin@organization.com"
                  />
                  {validationErrors.adminEmail && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.adminEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adminPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="adminPhone"
                    name="adminPhone"
                    value={formData.adminPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The administrator will receive an email with login instructions and will be required to set up their password on first login.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-between">
            <div>
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Organization'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
