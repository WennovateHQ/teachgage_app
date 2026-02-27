import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import {
  ArrowLeft,
  FileText,
  Loader2,
  CheckSquare,
  Type,
  Star,
  List,
  ToggleLeft,
  Calendar,
  Image,
  Upload,
  Grid,
  ArrowUpDown,
  ThumbsUp,
  Users,
  Lightbulb,
  AlertTriangle,
  Zap
} from 'lucide-react'

const QUESTION_TYPES = [
  { name: 'Short Text', icon: Type, desc: 'Open-ended text responses' },
  { name: 'Long Text', icon: FileText, desc: 'Paragraph-length responses' },
  { name: 'Multiple Choice', icon: List, desc: 'Select one option from a list' },
  { name: 'Checkbox', icon: CheckSquare, desc: 'Select multiple options' },
  { name: 'Rating', icon: Star, desc: 'Star ratings (1-5 or custom)' },
  { name: 'Likert Scale', icon: ToggleLeft, desc: 'Agreement scale (Strongly Disagree to Strongly Agree)' },
  { name: 'NPS', icon: ThumbsUp, desc: 'Net Promoter Score (0-10)' },
  { name: 'Matrix', icon: Grid, desc: 'Grid of questions with same response options' },
  { name: 'Rank Order', icon: ArrowUpDown, desc: 'Drag to rank items in order' },
  { name: 'Dropdown', icon: List, desc: 'Select from a dropdown menu' },
  { name: 'Picture Choice', icon: Image, desc: 'Select from image options' },
  { name: 'File Upload', icon: Upload, desc: 'Upload documents or images' },
  { name: 'Date/Time', icon: Calendar, desc: 'Date and time picker' },
  { name: 'Demographic', icon: Users, desc: 'Pre-built demographic questions' },
  { name: 'Opinion Scale', icon: ToggleLeft, desc: 'Numeric scale with labels' },
]

const BEST_PRACTICES = [
  { title: 'Keep it Short', desc: 'Aim for 10-15 questions maximum. Longer surveys have lower completion rates.' },
  { title: 'Use Clear Language', desc: 'Avoid jargon and double-barreled questions. One concept per question.' },
  { title: 'Mix Question Types', desc: 'Combine rating scales with open-ended questions for quantitative and qualitative data.' },
  { title: 'Start Easy', desc: 'Begin with simple questions to build momentum before asking more thoughtful ones.' },
  { title: 'Test Your Survey', desc: 'Always preview and test before distributing. Check on mobile devices too.' },
  { title: 'Use Conditional Logic', desc: 'Skip irrelevant questions based on previous answers to improve the experience.' },
]

export default function SurveyBuilderGuide() {
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
        <title>Survey Builder Tutorial - TeachGage</title>
      </Head>
      <DashboardLayout title="Survey Builder Tutorial">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/dashboard/help" className="inline-flex items-center text-sm text-gray-500 hover:text-teachgage-blue mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Help Center
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Survey Builder Tutorial</h1>
                <p className="text-purple-100 mt-1">Create effective evaluation surveys with our visual builder</p>
              </div>
            </div>
          </div>

          {/* Creating a Survey */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Creating a New Survey</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  <div>
                    <p className="font-medium text-gray-900">Navigate to Surveys</p>
                    <p className="text-sm text-gray-500">Go to Dashboard → Surveys → Create Survey</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  <div>
                    <p className="font-medium text-gray-900">Choose a Starting Point</p>
                    <p className="text-sm text-gray-500">Select a default template (Peer, Self, or Supervisor evaluation) or start from scratch</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  <div>
                    <p className="font-medium text-gray-900">Add Survey Details</p>
                    <p className="text-sm text-gray-500">Enter title, description, and select the associated course</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  <div>
                    <p className="font-medium text-gray-900">Build Your Questions</p>
                    <p className="text-sm text-gray-500">Use the visual editor to add, reorder, and configure questions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-teachgage-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                  <div>
                    <p className="font-medium text-gray-900">Preview and Publish</p>
                    <p className="text-sm text-gray-500">Test your survey in preview mode, then publish when ready</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Question Types */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Question Types</h2>
            <p className="text-gray-600 mb-4">TeachGage supports 15 question types to capture any kind of feedback:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {QUESTION_TYPES.map((qt, i) => {
                const Icon = qt.icon
                return (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-teachgage-blue transition-colors">
                    <div className="flex items-center mb-2">
                      <Icon className="h-5 w-5 text-teachgage-blue mr-2" />
                      <span className="font-medium text-gray-900">{qt.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{qt.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Conditional Logic */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Conditional Logic
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Conditional logic lets you show or hide questions based on previous answers. This creates a personalized survey experience and keeps surveys short and relevant.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Example</h4>
                <p className="text-sm text-blue-700">
                  If a respondent rates "Overall Satisfaction" as 1-2 stars, show a follow-up question: "What could be improved?" Skip this question for respondents who rated 4-5 stars.
                </p>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">How to Add Conditional Logic:</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Select a question in the builder</li>
                <li>2. Click the "Logic" tab in the question settings</li>
                <li>3. Set the condition (e.g., "If Q1 equals 'Yes'")</li>
                <li>4. Choose the action (Show this question / Skip to question X)</li>
                <li>5. Use the Logic Flow Map to visualize your survey flow</li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  Always validate your logic before publishing. TeachGage will warn you about circular logic, unreachable questions, and conflicts.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Best Practices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BEST_PRACTICES.map((bp, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-1">{bp.title}</h4>
                  <p className="text-sm text-gray-500">{bp.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-teachgage-blue/5 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Ready to Build?</h3>
            <p className="text-gray-600 mb-4">Create your first survey using our visual builder.</p>
            <Link
              href="/dashboard/feedback-forms/create"
              className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" /> Create Survey
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
