import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { 
  Menu, 
  X, 
  Shield, 
  Settings, 
  Users, 
  BarChart3, 
  Database,
  Bell,
  Search,
  LogOut,
  User,
  Home,
  FileText,
  Layers,
  Mail,
  CreditCard,
  Activity
} from 'lucide-react'

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (!token || !user) {
      router.push('/admin/login')
      return
    }
    
    try {
      setAdminUser(JSON.parse(user))
    } catch (error) {
      console.error('Error parsing admin user:', error)
      router.push('/admin/login')
    }
  }, [router])

  const platformNavigation = [
    { name: 'Dashboard', href: '/admin/platform/dashboard', icon: Home, current: router.pathname === '/admin/platform/dashboard' },
    { name: 'Organizations', href: '/admin/platform/organizations', icon: Users, current: router.pathname.startsWith('/admin/platform/organizations') },
    { name: 'System Analytics', href: '/admin/platform/analytics', icon: BarChart3, current: router.pathname.startsWith('/admin/platform/analytics') },
    { name: 'User Management', href: '/admin/platform/users', icon: User, current: router.pathname.startsWith('/admin/platform/users') },
    { name: 'Data Management', href: '/admin/platform/data-management', icon: Database, current: router.pathname.startsWith('/admin/platform/data-management') },
    { name: 'System Health', href: '/admin/platform/system-health', icon: Activity, current: router.pathname.startsWith('/admin/platform/system-health') },
    { name: 'Audit Logs', href: '/admin/platform/audit-logs', icon: FileText, current: router.pathname.startsWith('/admin/platform/audit-logs') },
    { name: 'Settings', href: '/admin/platform/settings', icon: Settings, current: router.pathname.startsWith('/admin/platform/settings') },
  ]

  const organizationNavigation = [
    { name: 'Dashboard', href: '/admin/organization/dashboard', icon: Home, current: router.pathname === '/admin/organization/dashboard' },
    { name: 'Users', href: '/admin/organization/users', icon: Users, current: router.pathname.startsWith('/admin/organization/users') },
    { name: 'Departments', href: '/admin/organization/departments', icon: Layers, current: router.pathname.startsWith('/admin/organization/departments') },
    { name: 'Analytics', href: '/admin/organization/analytics', icon: BarChart3, current: router.pathname.startsWith('/admin/organization/analytics') },
    { name: 'Billing', href: '/admin/organization/billing', icon: CreditCard, current: router.pathname.startsWith('/admin/organization/billing') },
    { name: 'Notifications', href: '/admin/organization/notifications', icon: Mail, current: router.pathname.startsWith('/admin/organization/notifications') },
    { name: 'Settings', href: '/admin/organization/settings', icon: Settings, current: router.pathname.startsWith('/admin/organization/settings') },
  ]

  const navigation = router.pathname.startsWith('/admin/platform') ? platformNavigation : organizationNavigation
  const adminType = router.pathname.startsWith('/admin/platform') ? 'Platform' : 'Organization'

  const handleSignOut = async () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-teachgage-blue mr-2" />
            <div>
              <h1 className="text-lg font-bold text-white">TeachGage</h1>
              <p className="text-xs text-gray-400">{adminType} Admin</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const IconComponent = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-teachgage-blue text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <IconComponent className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Admin Profile Section */}
        <div className="absolute bottom-0 w-full p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {adminUser?.firstName} {adminUser?.lastName}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {adminUser?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search admin..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent w-64"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Admin Badge */}
              <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4 mr-1" />
                {adminType} Admin
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
