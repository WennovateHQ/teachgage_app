import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Shield, Settings, Users, BarChart3, Database, Lock, ArrowRight } from 'lucide-react'

export default function AdminLanding() {
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')
    
    if (adminToken && adminUser) {
      const user = JSON.parse(adminUser)
      // Redirect to appropriate admin dashboard
      if (user.adminType === 'platform') {
        router.push('/admin/platform/dashboard')
      } else {
        router.push('/admin/organization/dashboard')
      }
    }
  }, [router])

  const adminFeatures = [
    {
      icon: Settings,
      title: 'Platform Administration',
      description: 'Manage system-wide settings, user accounts, and platform configuration',
      color: 'bg-blue-500',
      href: '/admin/login?type=platform'
    },
    {
      icon: Users,
      title: 'Organization Management',
      description: 'Oversee organizational accounts, departments, and user permissions',
      color: 'bg-green-500',
      href: '/admin/login?type=organization'
    },
    {
      icon: BarChart3,
      title: 'System Analytics',
      description: 'Monitor platform performance, usage metrics, and system health',
      color: 'bg-purple-500',
      href: '/admin/platform/analytics'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Handle bulk operations, data exports, and system maintenance',
      color: 'bg-orange-500',
      href: '/admin/platform/data'
    }
  ]

  return (
    <>
      <Head>
        <title>Admin Portal - TeachGage</title>
        <meta name="description" content="TeachGage administrative portal for platform and organization management" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <div className="bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-teachgage-blue mr-3" />
                <h1 className="text-2xl font-bold text-white">TeachGage Admin</h1>
              </div>
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Back to Main Site
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-12 w-12 text-teachgage-blue" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Administrative Portal
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Secure access to TeachGage platform administration, organization management, 
              and system oversight tools.
            </p>
          </div>

          {/* Admin Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {adminFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="group bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-teachgage-blue transition-all duration-300 hover:bg-opacity-20"
                >
                  <div className="flex items-start">
                    <div className={`${feature.color} rounded-lg p-3 mr-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teachgage-blue transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-teachgage-blue group-hover:text-white transition-colors">
                        <span className="text-sm font-medium">Access Portal</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Quick Access */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Quick Access
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin/login"
                className="flex items-center justify-center px-8 py-4 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors font-medium"
              >
                <Shield className="h-5 w-5 mr-2" />
                Admin Login
              </Link>
              <Link
                href="/admin/platform/dashboard"
                className="flex items-center justify-center px-8 py-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                <Settings className="h-5 w-5 mr-2" />
                Platform Dashboard
              </Link>
              <Link
                href="/admin/organization/dashboard"
                className="flex items-center justify-center px-8 py-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                <Users className="h-5 w-5 mr-2" />
                Organization Dashboard
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-12 bg-red-900 bg-opacity-20 border border-red-700 rounded-xl p-6">
            <div className="flex items-start">
              <Lock className="h-6 w-6 text-red-400 mr-3 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-2">
                  Security Notice
                </h4>
                <p className="text-red-300 text-sm">
                  This is a restricted administrative area. All access is logged and monitored. 
                  Unauthorized access attempts will be reported and may result in legal action.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black bg-opacity-20 backdrop-blur-sm border-t border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-400 text-sm">
              <p>&copy; 2024 TeachGage. All rights reserved. Administrative Portal v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
