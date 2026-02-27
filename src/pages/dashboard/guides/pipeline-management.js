import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import {
  ArrowLeft,
  GitBranch,
  Loader2,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Calendar,
  Target,
  Zap,
  Settings,
  BarChart2,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

const PIPELINE_STAGES = [
  { name: 'Start of Term', icon: Play, color: 'bg-green-500', desc: 'Initial baseline evaluation when the course begins' },
  { name: 'Mid-Term', icon: Pause, color: 'bg-yellow-500', desc: 'Progress check to identify areas needing attention' },
  { name: 'End of Term', icon: CheckCircle, color: 'bg-blue-500', desc: 'Final comprehensive evaluation' },
]

const TRIGGER_TYPES = [
  { name: 'Date-Based', icon: Calendar, desc: 'Trigger on specific dates or relative to course start' },
  { name: 'Milestone', icon: Target, desc: 'Trigger when a course reaches a specific milestone' },
  { name: 'Event', icon: Zap, desc: 'Trigger based on system events (e.g., course completion)' },
  { name: 'Manual', icon: Settings, desc: 'Manually advance evaluations through stages' },
]

export default function PipelineManagementGuide() {
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
        <title>Pipeline Management Guide - TeachGage</title>
      </Head>
      <DashboardLayout title="Pipeline Management Guide">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/dashboard/help" className="inline-flex items-center text-sm text-gray-500 hover:text-teachgage-blue mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Help Center
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <GitBranch className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Pipeline Management</h1>
                <p className="text-orange-100 mt-1">Automate your evaluation workflow with intelligent pipelines</p>
              </div>
            </div>
          </div>

          {/* What is a Pipeline */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What is an Evaluation Pipeline?</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                A pipeline is an automated workflow that manages the evaluation cycle for a course. Instead of manually sending surveys at each stage, pipelines automatically distribute evaluations based on triggers you configure.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Default Pipeline Stages</h4>
                <div className="flex items-center justify-between">
                  {PIPELINE_STAGES.map((stage, i) => {
                    const Icon = stage.icon
                    return (
                      <div key={i} className="flex items-center">
                        <div className={`w-10 h-10 ${stage.color} rounded-full flex items-center justify-center text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900 text-sm">{stage.name}</p>
                          <p className="text-xs text-gray-500">{stage.desc}</p>
                        </div>
                        {i < PIPELINE_STAGES.length - 1 && (
                          <ArrowRight className="h-5 w-5 text-gray-300 mx-4" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Setting Up a Pipeline */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Setting Up a Pipeline</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  <div>
                    <p className="font-medium text-gray-900">Navigate to Pipelines</p>
                    <p className="text-sm text-gray-500">Go to Dashboard → Pipelines. A default pipeline is created automatically for new courses.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  <div>
                    <p className="font-medium text-gray-900">Configure Stages</p>
                    <p className="text-sm text-gray-500">Click on a pipeline to view its stages. You can rename stages, add new ones, or reorder them.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  <div>
                    <p className="font-medium text-gray-900">Assign Surveys</p>
                    <p className="text-sm text-gray-500">Link a survey to each stage. When that stage triggers, the survey is automatically distributed.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  <div>
                    <p className="font-medium text-gray-900">Set Triggers</p>
                    <p className="text-sm text-gray-500">Configure when each stage should activate (date, milestone, or event-based).</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                  <div>
                    <p className="font-medium text-gray-900">Activate Pipeline</p>
                    <p className="text-sm text-gray-500">Enable the pipeline. It will now run automatically based on your configuration.</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Trigger Types */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-teachgage-blue" />
              Trigger Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TRIGGER_TYPES.map((trigger, i) => {
                const Icon = trigger.icon
                return (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center mb-2">
                      <Icon className="h-5 w-5 text-teachgage-blue mr-2" />
                      <span className="font-medium text-gray-900">{trigger.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">{trigger.desc}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Example Configuration</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Start of Term:</strong> Trigger 1 week after course start date</li>
                <li>• <strong>Mid-Term:</strong> Trigger at 50% course completion</li>
                <li>• <strong>End of Term:</strong> Trigger 1 week before course end date</li>
              </ul>
            </div>
          </section>

          {/* Pipeline Analytics */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-teachgage-blue" />
              Pipeline Analytics
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                TeachGage provides real-time analytics for each pipeline stage:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-teachgage-blue">Response Rate</p>
                  <p className="text-sm text-gray-500">Track completion percentage</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-teachgage-blue">Stage Duration</p>
                  <p className="text-sm text-gray-500">Time spent in each stage</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-teachgage-blue">Bottlenecks</p>
                  <p className="text-sm text-gray-500">Identify slow-moving stages</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Use the Pipeline Optimizer for AI-powered recommendations on improving your workflow efficiency.
              </p>
            </div>
          </section>

          {/* Manual Override */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
              Manual Overrides
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Sometimes you need to manually move an evaluation through stages. TeachGage supports manual overrides:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Move Forward:</strong> Advance an evaluation to the next stage immediately</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Move Back:</strong> Return to a previous stage if needed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Skip Stage:</strong> Jump over a stage for specific evaluations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Pause Pipeline:</strong> Temporarily halt all automated triggers</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                All manual actions are logged in the audit trail for accountability.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Start Automating</h3>
            <p className="text-gray-600 mb-4">Configure your first pipeline and streamline your evaluation process.</p>
            <Link
              href="/dashboard/pipelines"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <GitBranch className="h-4 w-4 mr-2" /> View Pipelines
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
