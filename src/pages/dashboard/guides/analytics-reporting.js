import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import {
  ArrowLeft,
  BarChart2,
  Loader2,
  PieChart,
  TrendingUp,
  Download,
  FileText,
  Table,
  Filter,
  Calendar,
  Star,
  Users,
  Activity,
  Eye
} from 'lucide-react'

const METRICS = [
  { name: 'Response Rate', icon: Users, desc: 'Percentage of invitees who completed the survey' },
  { name: 'Average Rating', icon: Star, desc: 'Mean score across all rating questions' },
  { name: 'Completion Time', icon: Activity, desc: 'Average time to complete the survey' },
  { name: 'NPS Score', icon: TrendingUp, desc: 'Net Promoter Score from NPS questions' },
  { name: 'Response Trends', icon: BarChart2, desc: 'How metrics change over time' },
  { name: 'Question Breakdown', icon: PieChart, desc: 'Per-question response distribution' },
]

const EXPORT_FORMATS = [
  { name: 'PDF Report', icon: FileText, desc: 'Professionally formatted report with charts and summaries', best: 'Sharing with stakeholders' },
  { name: 'CSV Export', icon: Table, desc: 'Raw data in spreadsheet format for further analysis', best: 'Data analysis in Excel/Sheets' },
  { name: 'JSON Export', icon: Download, desc: 'Structured data for integration with other tools', best: 'API integrations' },
]

export default function AnalyticsReportingGuide() {
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
        <title>Analytics & Reporting Guide - TeachGage</title>
      </Head>
      <DashboardLayout title="Analytics & Reporting Guide">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/dashboard/help" className="inline-flex items-center text-sm text-gray-500 hover:text-teachgage-blue mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Help Center
          </Link>

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <BarChart2 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Analytics & Reporting</h1>
                <p className="text-teal-100 mt-1">Understand your data and generate professional reports</p>
              </div>
            </div>
          </div>

          {/* Dashboard Overview */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics Dashboard Overview</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                TeachGage provides multiple levels of analytics:
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Main Dashboard Analytics</h4>
                    <p className="text-sm text-gray-500">Overview of all your courses, surveys, and response rates in one place. Access via Dashboard → Analytics.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Survey-Level Analytics</h4>
                    <p className="text-sm text-gray-500">Detailed breakdown for a specific survey. Open any survey → Analytics tab to see per-question results.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Course Analytics</h4>
                    <p className="text-sm text-gray-500">Aggregated data across all surveys in a course. Compare performance over the term.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <BarChart2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Organization Analytics</h4>
                    <p className="text-sm text-gray-500">(For Organization Admins) Cross-department reporting and comparative analytics.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Metrics */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Metrics Explained</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {METRICS.map((metric, i) => {
                const Icon = metric.icon
                return (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center mb-2">
                      <Icon className="h-5 w-5 text-teachgage-blue mr-2" />
                      <span className="font-medium text-gray-900">{metric.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">{metric.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Filtering Data */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-teachgage-blue" />
              Filtering Your Data
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Use filters to narrow down your analytics view:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Date Range</span>
                  </div>
                  <p className="text-sm text-gray-500">Filter by specific time periods (Last 7 days, Last month, Custom range)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Survey</span>
                  </div>
                  <p className="text-sm text-gray-500">Select specific surveys to analyze</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Course</span>
                  </div>
                  <p className="text-sm text-gray-500">Filter by course to compare across sections</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Rating Threshold</span>
                  </div>
                  <p className="text-sm text-gray-500">Show only responses above/below a rating</p>
                </div>
              </div>
            </div>
          </section>

          {/* Exporting Reports */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2 text-teachgage-blue" />
              Exporting Reports
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                Export your analytics data in multiple formats:
              </p>
              <div className="space-y-4">
                {EXPORT_FORMATS.map((format, i) => {
                  const Icon = format.icon
                  return (
                    <div key={i} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <Icon className="h-6 w-6 text-teachgage-blue mr-4 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">{format.name}</h4>
                        <p className="text-sm text-gray-500">{format.desc}</p>
                        <p className="text-xs text-blue-600 mt-1">Best for: {format.best}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How to Export</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Navigate to any analytics page</li>
                  <li>2. Apply your desired filters</li>
                  <li>3. Click the "Export" button in the top-right corner</li>
                  <li>4. Select your preferred format (PDF, CSV, or JSON)</li>
                  <li>5. Your download will begin automatically</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Reading Charts */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Your Charts</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-teachgage-blue" /> Bar Charts
                  </h4>
                  <p className="text-sm text-gray-500">Used for comparing values across categories (e.g., ratings distribution, responses per question).</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-teachgage-blue" /> Line Charts
                  </h4>
                  <p className="text-sm text-gray-500">Used for showing trends over time (e.g., response rate over the term).</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <PieChart className="h-4 w-4 mr-2 text-teachgage-blue" /> Pie Charts
                  </h4>
                  <p className="text-sm text-gray-500">Used for showing proportion breakdowns (e.g., response distribution for a single question).</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-teachgage-blue" /> Heat Maps
                  </h4>
                  <p className="text-sm text-gray-500">Used for showing intensity across dimensions (e.g., competency gap analysis).</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-teal-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Explore Your Data</h3>
            <p className="text-gray-600 mb-4">View your analytics dashboard and generate your first report.</p>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <BarChart2 className="h-4 w-4 mr-2" /> View Analytics
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
