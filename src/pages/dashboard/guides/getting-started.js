import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import {
  ArrowLeft,
  CheckCircle,
  BookOpen,
  Users,
  FileText,
  BarChart2,
  Settings,
  Loader2,
  ArrowRight,
  PlayCircle
} from 'lucide-react'

const STEPS = [
  {
    title: 'Complete Your Profile',
    description: 'Add your personal information, organization details, and profile photo.',
    path: '/dashboard/settings',
    icon: Settings,
    details: [
      'Navigate to Dashboard → Settings → Profile tab',
      'Fill in your name, title, and department',
      'Upload a professional profile photo (optional)',
      'Configure your notification preferences'
    ]
  },
  {
    title: 'Create Your First Course',
    description: 'Set up a course to organize your students and evaluations.',
    path: '/dashboard/courses/create',
    icon: BookOpen,
    details: [
      'Go to Dashboard → Courses → Create Course',
      'Enter course name, code, and description',
      'Set the course term and dates',
      'Configure course visibility and settings'
    ]
  },
  {
    title: 'Enroll Students',
    description: 'Add students to your course manually or via CSV upload.',
    path: '/dashboard/courses',
    icon: Users,
    details: [
      'Open your course and go to the Students tab',
      'Click "Enroll Students" button',
      'Add emails manually or upload a CSV file',
      'Students will receive welcome emails automatically'
    ]
  },
  {
    title: 'Build a Survey',
    description: 'Create an evaluation form using our visual survey builder.',
    path: '/dashboard/feedback-forms/create',
    icon: FileText,
    details: [
      'Navigate to Dashboard → Surveys → Create Survey',
      'Choose a template or start from scratch',
      'Add questions using drag-and-drop',
      'Configure conditional logic and required fields',
      'Preview your survey before publishing'
    ]
  },
  {
    title: 'Distribute Your Survey',
    description: 'Send survey invitations to your students via email.',
    path: '/dashboard/feedback-forms',
    icon: PlayCircle,
    details: [
      'Open your published survey',
      'Click "Distribute" or "Send Invitations"',
      'Enter student emails or select from enrolled students',
      'Customize your invitation message',
      'Schedule send or distribute immediately'
    ]
  },
  {
    title: 'View Analytics',
    description: 'Monitor response rates and analyze feedback.',
    path: '/dashboard/analytics',
    icon: BarChart2,
    details: [
      'Go to Dashboard → Analytics for overall metrics',
      'Or open a specific survey → Analytics tab',
      'View response trends, rating distributions, and sentiment',
      'Export reports as PDF or CSV'
    ]
  }
]

export default function GettingStartedGuide() {
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
        <title>Getting Started Guide - TeachGage</title>
      </Head>
      <DashboardLayout title="Getting Started Guide">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/dashboard/help" className="inline-flex items-center text-sm text-gray-500 hover:text-teachgage-blue mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Help Center
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-teachgage-blue to-teachgage-medium-blue rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Getting Started with TeachGage</h1>
                <p className="text-blue-100 mt-1">Complete these steps to set up your first evaluation cycle</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-blue-100 mt-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Estimated time: 15–20 minutes</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-teachgage-blue/10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-teachgage-blue font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Icon className="h-5 w-5 mr-2 text-teachgage-blue" />
                          {step.title}
                        </h3>
                        <Link
                          href={step.path}
                          className="text-sm text-teachgage-blue hover:underline flex items-center"
                        >
                          Go <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                      <ul className="mt-4 space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-500">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Next Steps */}
          <div className="mt-10 bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/guides/survey-builder" className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teachgage-blue transition-colors">
                <FileText className="h-5 w-5 text-teachgage-blue mb-2" />
                <span className="text-sm font-medium text-gray-800">Survey Builder Tutorial</span>
              </Link>
              <Link href="/dashboard/guides/pipeline-management" className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teachgage-blue transition-colors">
                <PlayCircle className="h-5 w-5 text-teachgage-blue mb-2" />
                <span className="text-sm font-medium text-gray-800">Pipeline Management</span>
              </Link>
              <Link href="/dashboard/guides/ai-insights" className="bg-white rounded-lg p-4 border border-gray-200 hover:border-teachgage-blue transition-colors">
                <BarChart2 className="h-5 w-5 text-teachgage-blue mb-2" />
                <span className="text-sm font-medium text-gray-800">AI Insights Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
