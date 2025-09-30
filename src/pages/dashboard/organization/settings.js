import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../components/common/Breadcrumb'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  Building,
  Save,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Palette
} from 'lucide-react'

export default function OrganizationSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'university',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    description: '',
    logo: null,
    branding: {
      primaryColor: '#06325C',
      secondaryColor: '#41543C',
      accentColor: '#F48C06'
    },
    notifications: {
      newUserRegistration: true,
      courseCreated: true,
      surveyCompleted: true,
      weeklyReports: true,
      systemUpdates: true
    },
    security: {
      requireEmailVerification: true,
      enforcePasswordPolicy: true,
      sessionTimeout: 480,
      allowSelfRegistration: false
    }
  })

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/signin')
      return
    }

    if (user && user.role !== 'organization_admin') {
      router.push('/dashboard')
      return
    }

    if (user) {
      loadOrganizationSettings()
    }
  }, [user, isAuthenticated, isLoading, router])

  const loadOrganizationSettings = () => {
    try {
      // Mock organization settings data
      const mockSettings = {
        name: 'Tech University',
        type: 'university',
        website: 'https://techuniversity.edu',
        phone: '+1 (555) 123-4567',
        email: 'admin@techuniversity.edu',
        address: '123 University Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'United States',
        description: 'Leading technology university focused on innovation and excellence in education.',
        branding: {
          primaryColor: '#06325C',
          secondaryColor: '#41543C',
          accentColor: '#F48C06'
        },
        notifications: {
          newUserRegistration: true,
          courseCreated: true,
          surveyCompleted: true,
          weeklyReports: true,
          systemUpdates: true
        },
        security: {
          requireEmailVerification: true,
          enforcePasswordPolicy: true,
          sessionTimeout: 480,
          allowSelfRegistration: false
        }
      }
      
      setFormData(mockSettings)
    } catch (error) {
      console.error('Failed to load organization settings:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [section, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Organization settings saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Settings', href: '/dashboard/organization/settings' }
  ]

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
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

  return (
    <>
      <Head>
        <title>Organization Settings - TeachGage</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Organization Settings</h1>
              <p className="text-teachgage-navy">
                Configure your organization's profile and preferences
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === tab.id
                          ? 'border-teachgage-blue text-teachgage-blue'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organization Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organization Type
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        >
                          <option value="university">University/College</option>
                          <option value="k12_school">K-12 School</option>
                          <option value="training_center">Training Center</option>
                          <option value="corporate">Corporate Training</option>
                          <option value="government">Government Agency</option>
                          <option value="nonprofit">Non-Profit Organization</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        placeholder="Brief description of your organization"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-teachgage-blue">Email Notifications</h3>
                    
                    <div className="space-y-4">
                      {Object.entries(formData.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                            <p className="text-xs text-gray-500">
                              {key === 'newUserRegistration' && 'Get notified when new users register'}
                              {key === 'courseCreated' && 'Get notified when instructors create new courses'}
                              {key === 'surveyCompleted' && 'Get notified when surveys receive responses'}
                              {key === 'weeklyReports' && 'Receive weekly summary reports'}
                              {key === 'systemUpdates' && 'Get notified about system updates and maintenance'}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            name={`notifications.${key}`}
                            checked={value}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-teachgage-blue">Security Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Require Email Verification
                          </label>
                          <p className="text-xs text-gray-500">
                            New users must verify their email before accessing the platform
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name="security.requireEmailVerification"
                          checked={formData.security.requireEmailVerification}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Enforce Password Policy
                          </label>
                          <p className="text-xs text-gray-500">
                            Require strong passwords with complexity requirements
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name="security.enforcePasswordPolicy"
                          checked={formData.security.enforcePasswordPolicy}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          name="security.sessionTimeout"
                          value={formData.security.sessionTimeout}
                          onChange={handleInputChange}
                          min="30"
                          max="1440"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Users will be automatically logged out after this period of inactivity
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex justify-end">
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
                        Save Settings
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
