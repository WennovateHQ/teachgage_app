import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import {
  ArrowLeft,
  Building2,
  Loader2,
  Users,
  Briefcase,
  CreditCard,
  Shield,
  Settings,
  Upload,
  BarChart2,
  CheckCircle,
  UserPlus,
  FolderTree,
  FileText,
  Palette,
  Bell
} from 'lucide-react'

const ADMIN_SECTIONS = [
  { name: 'User Management', icon: Users, path: '/admin/organization/users', desc: 'Add, edit, and manage instructor accounts' },
  { name: 'Departments', icon: FolderTree, path: '/admin/organization/departments', desc: 'Create and configure department structure' },
  { name: 'Billing', icon: CreditCard, path: '/admin/organization/billing', desc: 'Manage subscription and payment methods' },
  { name: 'Reports', icon: BarChart2, path: '/admin/organization/reports', desc: 'Organization-wide analytics and exports' },
  { name: 'Settings', icon: Settings, path: '/admin/organization/settings', desc: 'Organization profile, branding, and preferences' },
]

export default function OrganizationAdminGuide() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-teachgage-blue animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <>
      <Head>
        <title>Organization Admin Guide - TeachGage</title>
      </Head>
      <DashboardLayout title="Organization Admin Guide">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/dashboard/help" className="inline-flex items-center text-sm text-gray-500 hover:text-teachgage-blue mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Help Center
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Organization Admin Guide</h1>
                <p className="text-emerald-100 mt-1">Managing users, departments, and billing</p>
              </div>
            </div>
          </div>

          {/* Admin Dashboard Overview */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Dashboard Overview</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                As an Organization Admin, you have access to a dedicated admin area for managing your institution. Access it via <strong>Admin</strong> in the main navigation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ADMIN_SECTIONS.map((section, i) => {
                  const Icon = section.icon
                  return (
                    <Link key={i} href={section.path} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors group">
                      <Icon className="h-6 w-6 text-emerald-600 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-medium text-gray-900">{section.name}</h4>
                        <p className="text-sm text-gray-500">{section.desc}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* User Management */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-emerald-600" />
              User Management
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-3">Adding Instructors</h4>
              <ol className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  <div>
                    <p className="text-gray-700">Go to Admin → Users → Create Instructor</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  <div>
                    <p className="text-gray-700">Enter instructor details (name, email, department)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  <div>
                    <p className="text-gray-700">Set initial password or send invitation email</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  <div>
                    <p className="text-gray-700">Instructor will be prompted to change password on first login</p>
                  </div>
                </li>
              </ol>

              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Upload className="h-4 w-4 mr-2" /> Bulk Import
              </h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-2">
                  Import multiple instructors at once using CSV:
                </p>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Download the CSV template</li>
                  <li>2. Fill in instructor details (one per row)</li>
                  <li>3. Upload the file via Admin → Users → Bulk Import</li>
                  <li>4. Review validation results and confirm import</li>
                </ol>
              </div>

              <h4 className="font-medium text-gray-900 mt-6 mb-3">User Roles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">Organization Admin</p>
                  <p className="text-xs text-gray-500">Full access to all organization features</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">Department Admin</p>
                  <p className="text-xs text-gray-500">Manage users and reports within their department</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">Lead Instructor</p>
                  <p className="text-xs text-gray-500">Standard instructor with team oversight capabilities</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">Instructor</p>
                  <p className="text-xs text-gray-500">Standard instructor access to courses and surveys</p>
                </div>
              </div>
            </div>
          </section>

          {/* Department Management */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FolderTree className="h-5 w-5 mr-2 text-emerald-600" />
              Department Management
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Departments help you organize instructors and generate department-specific analytics.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Create Departments</p>
                    <p className="text-sm text-gray-500">Go to Admin → Departments → Create Department. Add name, description, and optional department admin.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Assign Instructors</p>
                    <p className="text-sm text-gray-500">Instructors can be assigned to one or more departments. This scopes their analytics and visibility.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Department Analytics</p>
                    <p className="text-sm text-gray-500">View aggregated performance data per department in Admin → Reports.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Cross-Department Comparison</p>
                    <p className="text-sm text-gray-500">Compare response rates and satisfaction scores across departments.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Billing & Subscription */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
              Billing & Subscription
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Manage your organization's subscription and payment methods:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="h-6 w-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Current Plan</h4>
                  <p className="text-sm text-gray-500">View your plan details, user limits, and features</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="h-6 w-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Payment Methods</h4>
                  <p className="text-sm text-gray-500">Add, update, or remove credit cards</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <FileText className="h-6 w-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Invoices</h4>
                  <p className="text-sm text-gray-500">Download past invoices for accounting</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <UserPlus className="h-6 w-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Add Seats</h4>
                  <p className="text-sm text-gray-500">Upgrade to add more instructor seats</p>
                </div>
              </div>
            </div>
          </section>

          {/* Organization Settings */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-emerald-600" />
              Organization Settings
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building2 className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Organization Profile</p>
                    <p className="text-sm text-gray-500">Update organization name, address, and contact information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Palette className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Branding</p>
                    <p className="text-sm text-gray-500">Upload logo and customize colors for a white-label experience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Security & Privacy</p>
                    <p className="text-sm text-gray-500">Configure password policies, session timeouts, and data retention</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Bell className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Notification Defaults</p>
                    <p className="text-sm text-gray-500">Set default notification preferences for new users</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reports */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-emerald-600" />
              Organization Reports
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Access comprehensive analytics for your entire organization:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Overall participation rates</strong> — Track survey completion across all departments</span>
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Average satisfaction scores</strong> — Monitor organization-wide instructor ratings</span>
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Department comparisons</strong> — Compare metrics across departments</span>
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Trend analysis</strong> — See how metrics change over time</span>
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Export options</strong> — Download reports as PDF or CSV</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-emerald-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Start Managing</h3>
            <p className="text-gray-600 mb-4">Access your organization admin dashboard.</p>
            <Link
              href="/admin/organization/users"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Building2 className="h-4 w-4 mr-2" /> Go to Admin
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
