import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import QuickActions from '../common/QuickActions'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Settings, 
  User, 
  LogOut,
  Bell,
  Search,
  Users,
  Building2,
  CreditCard,
  Mail,
  Layers
} from 'lucide-react'

export default function DashboardLayout({ children, title = 'Dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  // Base navigation for all users
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: router.pathname === '/dashboard' },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen, current: router.pathname.startsWith('/dashboard/courses') },
    { name: 'Surveys', href: '/dashboard/feedback-forms', icon: FileText, current: router.pathname.startsWith('/dashboard/feedback-forms') },
    { name: 'Pipeline', href: '/dashboard/pipelines', icon: Layers, current: router.pathname.startsWith('/dashboard/pipelines') },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, current: router.pathname.startsWith('/dashboard/analytics') },
  ]

  // Additional navigation for organization admins
  const organizationNavigation = [
    { name: 'Organization', href: '/dashboard/organization', icon: Building2, current: router.pathname === '/dashboard/organization' },
    { name: 'Users', href: '/dashboard/organization/users', icon: Users, current: router.pathname.startsWith('/dashboard/organization/users') },
    { name: 'Departments', href: '/dashboard/organization/departments', icon: Building2, current: router.pathname.startsWith('/dashboard/organization/departments') },
    { name: 'Billing', href: '/dashboard/organization/billing', icon: CreditCard, current: router.pathname.startsWith('/dashboard/organization/billing') },
    { name: 'Notifications', href: '/dashboard/organization/notifications', icon: Mail, current: router.pathname.startsWith('/dashboard/organization/notifications') },
  ]

  // Settings always at the end
  const settingsNavigation = [
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, current: router.pathname.startsWith('/dashboard/settings') },
  ]

  // Combine navigation based on user role
  const navigation = user?.role === 'organization_admin' 
    ? [...baseNavigation, ...organizationNavigation, ...settingsNavigation]
    : [...baseNavigation, ...settingsNavigation]

  const handleSignOut = async () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed inset-y-0 left-0 z-50 w-64 bg-teachgage-blue transform transition-transform duration-300 ease-in-out lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-teachgage-dark-blue">
          <Image 
            src="/teachgage-blue-logo.png" 
            alt="TeachGage Logo" 
            width={80} 
            height={50}
            className="w-[80px] h-[50px] brightness-0 invert"
            priority={false}
          />
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-teachgage-medium-blue text-white'
                        : 'text-gray-300 hover:bg-teachgage-medium-blue hover:text-white'
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 bg-teachgage-dark-blue">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-teachgage-green rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teachgage-green rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.firstName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
