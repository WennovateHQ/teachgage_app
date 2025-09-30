import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Plus, 
  BookOpen, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings,
  X,
  Zap
} from 'lucide-react'

export default function QuickActions({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const quickActions = [
    {
      name: 'Create Course',
      href: '/dashboard/courses/create',
      icon: BookOpen,
      description: 'Start a new course',
      color: 'bg-teachgage-blue hover:bg-teachgage-medium-blue',
      available: true
    },
    {
      name: 'Create Survey',
      href: '/dashboard/feedback-forms/create',
      icon: MessageSquare,
      description: 'Build a survey',
      color: 'bg-teachgage-green hover:bg-green-600',
      available: true
    },
    {
      name: 'Add Students',
      href: '/dashboard/courses',
      icon: Users,
      description: 'Manage enrollments',
      color: 'bg-teachgage-orange hover:bg-orange-600',
      available: true
    },
    {
      name: 'View Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'Check performance',
      color: 'bg-purple-500 hover:bg-purple-600',
      available: true
    },
    {
      name: 'Account Settings',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'Manage preferences',
      color: 'bg-gray-500 hover:bg-gray-600',
      available: true
    }
  ]

  // Filter actions based on user permissions
  const availableActions = quickActions.filter(action => {
    if (action.name === 'Add Students' && user?.accountTier === 'basic') {
      return false // Basic users might have limited student management
    }
    return action.available
  })

  if (isOpen) {
    return (
      <div className={`fixed inset-0 z-50 ${className}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Quick Actions Panel */}
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-teachgage-blue mr-2" />
              <h2 className="text-lg font-semibold text-teachgage-blue">Quick Actions</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {availableActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.name} href={action.href}>
                    <button
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center p-4 rounded-lg text-white transition-colors ${action.color}`}
                    >
                      <Icon className="w-6 h-6 mr-4" />
                      <div className="text-left">
                        <div className="font-medium">{action.name}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </div>
                    </button>
                  </Link>
                )
              })}
            </div>
            
            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-teachgage-navy mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-teachgage-navy">
                  <div className="w-2 h-2 bg-teachgage-green rounded-full mr-3"></div>
                  <span>Course "Introduction to React" created</span>
                </div>
                <div className="flex items-center text-sm text-teachgage-navy">
                  <div className="w-2 h-2 bg-teachgage-blue rounded-full mr-3"></div>
                  <span>New survey response received</span>
                </div>
                <div className="flex items-center text-sm text-teachgage-navy">
                  <div className="w-2 h-2 bg-teachgage-orange rounded-full mr-3"></div>
                  <span>5 students enrolled in course</span>
                </div>
              </div>
            </div>
            
            {/* Account Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-teachgage-blue">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-teachgage-navy">
                    {user?.accountTier?.charAt(0).toUpperCase() + user?.accountTier?.slice(1)} Account
                  </div>
                </div>
                <Link href="/dashboard/settings">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-teachgage-blue hover:text-teachgage-medium-blue"
                  >
                    Settings
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-teachgage-blue text-white rounded-full shadow-lg hover:bg-teachgage-medium-blue transition-colors z-40 flex items-center justify-center ${className}`}
      title="Quick Actions"
    >
      <Zap className="w-6 h-6" />
    </button>
  )
}
