import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
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
  Palette,
  Database,
  Key
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminOrganizationSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  
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
      lowResponseRate: true,
      systemAlerts: true,
      billingUpdates: true
    },
    security: {
      requireEmailVerification: true,
      allowSelfRegistration: false,
      sessionTimeout: 30,
      passwordPolicy: 'medium',
      twoFactorRequired: false
    },
    features: {
      allowBulkUpload: true,
      enableAnalytics: true,
      customBranding: true,
      apiAccess: false,
      ssoEnabled: false
    }
  })

  useEffect(() => {
    loadOrganizationSettings()
  }, [])

  const loadOrganizationSettings = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock organization settings data
      const mockSettings = {
        name: 'Stanford University',
        type: 'university',
        website: 'https://stanford.edu',
        phone: '+1-650-723-2300',
        email: 'admin@stanford.edu',
        address: '450 Serra Mall',
        city: 'Stanford',
        state: 'CA',
        zipCode: '94305',
        country: 'United States',
        description: 'Stanford University is a private research university in Stanford, California.',
        logo: null,
        branding: {
          primaryColor: '#8C1515',
          secondaryColor: '#2E2D29',
          accentColor: '#B83A4B'
        },
        notifications: {
          newUserRegistration: true,
          courseCreated: true,
          surveyCompleted: true,
          lowResponseRate: true,
          systemAlerts: true,
          billingUpdates: false
        },
        security: {
          requireEmailVerification: true,
          allowSelfRegistration: false,
          sessionTimeout: 60,
          passwordPolicy: 'strong',
          twoFactorRequired: false
        },
        features: {
          allowBulkUpload: true,
          enableAnalytics: true,
          customBranding: true,
          apiAccess: true,
          ssoEnabled: false
        }
      }
      
      setFormData(mockSettings)
    } catch (error) {
      console.error('Failed to load organization settings:', error)
      toast.error('Failed to load organization settings')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Organization settings saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // In a real app, this would upload to a server
      toast.success('Logo uploaded successfully!')
      setFormData(prev => ({ ...prev, logo: file.name }))
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'features', label: 'Features', icon: SettingsIcon }
  ]

  if (loading) {
    return (
      <AdminLayout title="Organization Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Settings - TeachGage Admin</title>
        <meta name="description" content="Manage organization settings and configuration" />
      </Head>

      <AdminLayout title="Organization Settings">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
            <p className="text-gray-600">Configure organization preferences and settings</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-teachgage-blue text-teachgage-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange(null, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="university">University</option>
                      <option value="college">College</option>
                      <option value="school">School</option>
                      <option value="corporate">Corporate</option>
                      <option value="nonprofit">Non-Profit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange(null, 'website', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange(null, 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange(null, 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange(null, 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange(null, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Branding & Appearance</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Logo</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {formData.logo ? (
                        <span className="text-xs text-gray-600">{formData.logo}</span>
                      ) : (
                        <Building className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                      <Upload className="w-4 h-4 inline mr-2" />
                      Upload Logo
                      <input type="file" className="sr-only" onChange={handleLogoUpload} accept="image/*" />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.branding.primaryColor}
                        onChange={(e) => handleInputChange('branding', 'primaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.branding.primaryColor}
                        onChange={(e) => handleInputChange('branding', 'primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.branding.secondaryColor}
                        onChange={(e) => handleInputChange('branding', 'secondaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.branding.secondaryColor}
                        onChange={(e) => handleInputChange('branding', 'secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.branding.accentColor}
                        onChange={(e) => handleInputChange('branding', 'accentColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.branding.accentColor}
                        onChange={(e) => handleInputChange('branding', 'accentColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(formData.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
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
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Require Email Verification</label>
                      <p className="text-xs text-gray-500">Users must verify their email before accessing the platform</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.security.requireEmailVerification}
                      onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
                      className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Allow Self Registration</label>
                      <p className="text-xs text-gray-500">Users can register without admin approval</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.security.allowSelfRegistration}
                      onChange={(e) => handleInputChange('security', 'allowSelfRegistration', e.target.checked)}
                      className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={formData.security.sessionTimeout}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Policy</label>
                    <select
                      value={formData.security.passwordPolicy}
                      onChange={(e) => handleInputChange('security', 'passwordPolicy', e.target.value)}
                      className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="weak">Weak (6+ characters)</option>
                      <option value="medium">Medium (8+ characters, mixed case)</option>
                      <option value="strong">Strong (12+ characters, mixed case, numbers, symbols)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Feature Settings</h3>
                <div className="space-y-4">
                  {Object.entries(formData.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange('features', key, e.target.checked)}
                        className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
