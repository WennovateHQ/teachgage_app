import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon
} from 'lucide-react'

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organizationName || '',
    department: user?.department || '',
    title: user?.title || ''
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    surveyResponses: true,
    courseUpdates: true,
    systemUpdates: false,
    marketingEmails: false
  })

  if (isLoading) {
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      setIsSaving(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' })
      setIsSaving(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Password updated successfully!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Notification preferences updated!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'password', name: 'Password', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  return (
    <>
      <Head>
        <title>Settings - TeachGage</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Head>

      <DashboardLayout title="Settings">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center">
              <SettingsIcon className="w-8 h-8 text-teachgage-blue mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-teachgage-blue">Account Settings</h1>
                <p className="text-teachgage-navy">Manage your account preferences and security settings</p>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setMessage({ type: '', text: '' })
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-teachgage-blue text-white'
                          : 'text-teachgage-navy hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-semibold text-teachgage-blue mb-6">Profile Information</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-teachgage-navy mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-teachgage-navy mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-teachgage-navy mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-teachgage-navy mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-teachgage-navy mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={profileData.title}
                            onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-teachgage-navy mb-2">
                            Organization
                          </label>
                          <input
                            type="text"
                            value={profileData.organization}
                            onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-teachgage-navy mb-2">
                            Department
                          </label>
                          <input
                            type="text"
                            value={profileData.department}
                            onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
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
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                  <div>
                    <h2 className="text-xl font-semibold text-teachgage-blue mb-6">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-teachgage-navy mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-teachgage-navy mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-teachgage-navy mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                        />
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-teachgage-navy mb-2">Password Requirements:</h4>
                        <ul className="text-sm text-teachgage-navy space-y-1">
                          <li>• At least 8 characters long</li>
                          <li>• Contains uppercase and lowercase letters</li>
                          <li>• Contains at least one number</li>
                          <li>• Contains at least one special character</li>
                        </ul>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          {isSaving ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold text-teachgage-blue mb-6">Notification Preferences</h2>
                    <form onSubmit={handleNotificationSubmit} className="space-y-6">
                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h4 className="text-sm font-medium text-teachgage-navy">
                                {key === 'emailNotifications' && 'Email Notifications'}
                                {key === 'surveyResponses' && 'Survey Response Alerts'}
                                {key === 'courseUpdates' && 'Course Update Notifications'}
                                {key === 'systemUpdates' && 'System Update Notifications'}
                                {key === 'marketingEmails' && 'Marketing Emails'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                                {key === 'surveyResponses' && 'Get notified when someone responds to your surveys'}
                                {key === 'courseUpdates' && 'Notifications about course changes and updates'}
                                {key === 'systemUpdates' && 'System maintenance and feature announcements'}
                                {key === 'marketingEmails' && 'Product updates and educational content'}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teachgage-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teachgage-blue"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save Preferences'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div>
                    <h2 className="text-xl font-semibold text-teachgage-blue mb-6">Billing & Subscription</h2>
                    <div className="space-y-6">
                      {/* Current Plan */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-teachgage-blue">Current Plan</h3>
                            <p className="text-teachgage-navy">{user?.accountTier || 'Basic'} Account</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-teachgage-blue">
                              {user?.accountTier === 'basic' ? 'Free' : user?.accountTier === 'professional' ? '$29/mo' : '$99/mo'}
                            </p>
                            {user?.accountTier !== 'basic' && (
                              <p className="text-sm text-teachgage-navy">Next billing: Dec 26, 2024</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                            Upgrade Plan
                          </button>
                          {user?.accountTier !== 'basic' && (
                            <button className="px-4 py-2 border border-gray-300 text-teachgage-navy rounded-lg hover:bg-gray-50 transition-colors">
                              Cancel Subscription
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Billing History */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-teachgage-blue mb-4">Billing History</h3>
                        <div className="space-y-3">
                          {user?.accountTier !== 'basic' ? (
                            <>
                              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div>
                                  <p className="text-sm font-medium text-teachgage-navy">Professional Plan</p>
                                  <p className="text-xs text-gray-500">Nov 26, 2024</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-teachgage-navy">$29.00</p>
                                  <p className="text-xs text-green-600">Paid</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div>
                                  <p className="text-sm font-medium text-teachgage-navy">Professional Plan</p>
                                  <p className="text-xs text-gray-500">Oct 26, 2024</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-teachgage-navy">$29.00</p>
                                  <p className="text-xs text-green-600">Paid</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No billing history available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold text-teachgage-blue mb-6">Security Settings</h2>
                    <div className="space-y-6">
                      {/* Two-Factor Authentication */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-teachgage-blue">Two-Factor Authentication</h3>
                            <p className="text-sm text-teachgage-navy">Add an extra layer of security to your account</p>
                          </div>
                          <button className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
                            Enable 2FA
                          </button>
                        </div>
                      </div>

                      {/* Login Sessions */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-teachgage-blue mb-4">Active Sessions</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div>
                              <p className="text-sm font-medium text-teachgage-navy">Current Session</p>
                              <p className="text-xs text-gray-500">Windows • Chrome • Your current session</p>
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                          </div>
                        </div>
                      </div>

                      {/* Account Deletion */}
                      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                        <h3 className="text-lg font-medium text-red-600 mb-2">Delete Account</h3>
                        <p className="text-sm text-red-600 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
