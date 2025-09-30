import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../../../components/layout/AdminLayout'
import { 
  Building2, 
  Save,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  CreditCard
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditOrganizationPage() {
  const router = useRouter()
  const { id } = router.query
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'academic',
    website: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    subscriptionTier: 'basic',
    maxUsers: 50,
    status: 'active'
  })

  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (id) {
      fetchOrganizationDetails()
    }
  }, [id])

  const fetchOrganizationDetails = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock organization data
      const mockOrganization = {
        id: id,
        name: 'Stanford University',
        type: 'academic',
        subscriptionTier: 'enterprise',
        status: 'active',
        maxUsers: 500,
        contactInfo: {
          email: 'admin@stanford.edu',
          phone: '+1-650-723-2300',
          website: 'https://stanford.edu'
        },
        address: {
          street: '450 Serra Mall',
          city: 'Stanford',
          state: 'CA',
          zipCode: '94305',
          country: 'US'
        }
      }
      
      setOrganization(mockOrganization)
      setFormData({
        name: mockOrganization.name,
        type: mockOrganization.type,
        website: mockOrganization.contactInfo.website,
        email: mockOrganization.contactInfo.email,
        phone: mockOrganization.contactInfo.phone,
        street: mockOrganization.address.street,
        city: mockOrganization.address.city,
        state: mockOrganization.address.state,
        zipCode: mockOrganization.address.zipCode,
        country: mockOrganization.address.country,
        subscriptionTier: mockOrganization.subscriptionTier,
        maxUsers: mockOrganization.maxUsers,
        status: mockOrganization.status
      })
    } catch (error) {
      console.error('Error fetching organization details:', error)
      toast.error('Failed to load organization details')
    } finally {
      setLoading(false)
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
      errors.name = 'Organization name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email format is invalid'
    }

    if (!formData.street.trim()) {
      errors.street = 'Street address is required'
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required'
    }

    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required'
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Website must be a valid URL'
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

    setSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would call the backend API
      console.log('Updating organization:', formData)
      
      toast.success('Organization updated successfully!')
      router.push(`/admin/platform/organizations/${id}`)
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to update organization. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/platform/organizations/${id}`)
  }

  const subscriptionTiers = [
    { value: 'basic', label: 'Basic', maxUsers: 50 },
    { value: 'professional', label: 'Professional', maxUsers: 200 },
    { value: 'enterprise', label: 'Enterprise', maxUsers: 1000 }
  ]

  if (loading) {
    return (
      <AdminLayout title="Edit Organization">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!organization) {
    return (
      <AdminLayout title="Organization Not Found">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Not Found</h3>
          <p className="text-gray-500 mb-6">
            The organization you're trying to edit doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/admin/platform/organizations')}
            className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
          >
            Back to Organizations
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Edit {organization.name} - TeachGage Admin</title>
        <meta name="description" content={`Edit organization details for ${organization.name}`} />
      </Head>

      <AdminLayout title="Edit Organization">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Organization</h1>
              <p className="text-gray-600">Update organization information and settings</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSave}>
              <div className="p-6">
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-teachgage-blue" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="trial">Trial</option>
                          <option value="suspended">Suspended</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                              validationErrors.website ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="https://example.com"
                          />
                        </div>
                        {validationErrors.website && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.website}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-teachgage-blue" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent ${
                              validationErrors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="contact@organization.com"
                          />
                        </div>
                        {validationErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-teachgage-blue" />
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* Subscription Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-teachgage-blue" />
                      Subscription Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="subscriptionTier" className="block text-sm font-medium text-gray-700 mb-1">
                          Subscription Tier
                        </label>
                        <select
                          id="subscriptionTier"
                          name="subscriptionTier"
                          value={formData.subscriptionTier}
                          onChange={(e) => {
                            const selectedTier = subscriptionTiers.find(tier => tier.value === e.target.value)
                            setFormData(prev => ({
                              ...prev,
                              subscriptionTier: e.target.value,
                              maxUsers: selectedTier ? selectedTier.maxUsers : prev.maxUsers
                            }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        >
                          {subscriptionTiers.map((tier) => (
                            <option key={tier.value} value={tier.value}>
                              {tier.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Users
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="number"
                            id="maxUsers"
                            name="maxUsers"
                            value={formData.maxUsers}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                            placeholder="50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
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
      </AdminLayout>
    </>
  )
}
