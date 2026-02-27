import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import {
  ArrowLeft,
  Brain,
  Loader2,
  Target,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  Users,
  BarChart2,
  Sparkles,
  Clock,
  Award,
  BookOpen
} from 'lucide-react'

const COMPETENCY_AREAS = [
  { name: 'Communication', desc: 'Clarity, responsiveness, and presentation skills' },
  { name: 'Subject Mastery', desc: 'Depth of knowledge and expertise' },
  { name: 'Engagement', desc: 'Student interaction and motivation techniques' },
  { name: 'Organization', desc: 'Course structure, time management, preparation' },
  { name: 'Feedback Quality', desc: 'Timeliness, specificity, and constructiveness' },
  { name: 'Adaptability', desc: 'Responsiveness to student needs and flexibility' },
]

const GROWTH_PLAN_FEATURES = [
  { title: 'SMART Milestones', icon: Target, desc: 'Specific, measurable goals with deadlines' },
  { title: 'Resource Recommendations', icon: BookOpen, desc: 'AI-suggested learning materials and courses' },
  { title: 'Progress Tracking', icon: TrendingUp, desc: 'Monitor completion and update milestones' },
  { title: 'CEU/PD Tracking', icon: Award, desc: 'Track continuing education credits' },
]

export default function AIInsightsGuide() {
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
        <title>AI Insights Guide - TeachGage</title>
      </Head>
      <DashboardLayout title="AI Insights Guide">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/dashboard/help" className="inline-flex items-center text-sm text-gray-500 hover:text-teachgage-blue mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Help Center
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Insights Guide</h1>
                <p className="text-violet-100 mt-1">Leverage AI-powered analytics for professional growth</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-violet-100 mt-4">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Powered by Azure OpenAI</span>
            </div>
          </div>

          {/* What is AI Insights */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What is AI Insights?</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                AI Insights uses advanced machine learning to analyze your evaluation feedback and provide actionable intelligence. Instead of manually reviewing hundreds of responses, our AI identifies patterns, highlights areas for improvement, and generates personalized growth plans.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-violet-50 rounded-lg p-4 text-center">
                  <Brain className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Sentiment Analysis</p>
                  <p className="text-sm text-gray-500">Understand the emotional tone of feedback</p>
                </div>
                <div className="bg-violet-50 rounded-lg p-4 text-center">
                  <Target className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Competency Gaps</p>
                  <p className="text-sm text-gray-500">Identify specific areas for improvement</p>
                </div>
                <div className="bg-violet-50 rounded-lg p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Growth Plans</p>
                  <p className="text-sm text-gray-500">AI-generated development roadmaps</p>
                </div>
              </div>
            </div>
          </section>

          {/* Accessing AI Insights */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Accessing AI Insights</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  <div>
                    <p className="font-medium text-gray-900">Navigate to AI Insights</p>
                    <p className="text-sm text-gray-500">Go to Dashboard → AI Insights from the main navigation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  <div>
                    <p className="font-medium text-gray-900">Generate a Growth Plan</p>
                    <p className="text-sm text-gray-500">Click "Generate Growth Plan" to analyze your recent feedback and create a personalized development roadmap</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  <div>
                    <p className="font-medium text-gray-900">Review Competency Gaps</p>
                    <p className="text-sm text-gray-500">See a heatmap of your competencies with scores across 6 key areas</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  <div>
                    <p className="font-medium text-gray-900">Track Your Progress</p>
                    <p className="text-sm text-gray-500">Update milestone status as you complete development activities</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Competency Areas */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-violet-600" />
              Competency Areas Analyzed
            </h2>
            <p className="text-gray-600 mb-4">
              The AI analyzes feedback across six key competency areas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPETENCY_AREAS.map((area, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900">{area.name}</h4>
                  <p className="text-sm text-gray-500">{area.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                Each competency receives a score from 0-100 based on sentiment analysis of relevant feedback. Scores below 70 are flagged as potential areas for improvement.
              </p>
            </div>
          </section>

          {/* Growth Plans */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Understanding Growth Plans
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Growth plans are personalized professional development roadmaps generated by AI based on your evaluation feedback. Each plan includes:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GROWTH_PLAN_FEATURES.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <div key={i} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <Icon className="h-6 w-6 text-violet-600 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-500">{feature.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Working with Milestones */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Working with Milestones
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Each growth plan contains milestones — specific, actionable goals with deadlines. Here's how to work with them:
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pending</p>
                    <p className="text-sm text-gray-500">Milestone is scheduled but not yet started. Review the action items and begin when ready.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">In Progress</p>
                    <p className="text-sm text-gray-500">You're actively working on this milestone. Update status when complete.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Completed</p>
                    <p className="text-sm text-gray-500">Milestone achieved. Your progress percentage will update automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* For Organization Admins */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-teachgage-blue" />
              For Organization Admins
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Organization administrators have access to aggregated AI analytics across all instructors:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Organization-wide competency trends</strong> — See aggregate scores across departments</span>
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Growth plan adoption</strong> — Track how many instructors have active growth plans</span>
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Sentiment trends</strong> — Monitor overall feedback sentiment over time</span>
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>PD recommendations</strong> — Identify common gaps for organization-wide training initiatives</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-violet-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-4">Generate your first AI-powered growth plan today.</p>
            <Link
              href="/dashboard/ai-insights"
              className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Brain className="h-4 w-4 mr-2" /> View AI Insights
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
