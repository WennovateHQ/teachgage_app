import { useState } from 'react'
import Head from 'next/head'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../contexts/AuthContext'
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  FileText,
  Video,
  LifeBuoy,
  Send,
  Loader2,
  CheckCircle
} from 'lucide-react'

const FAQ_ITEMS = [
  { q: 'How do I create my first survey?', a: 'Navigate to Dashboard → Feedback Forms → Create. Use the visual survey builder to add questions, configure logic, and preview before publishing. You can also start from a default template.' },
  { q: 'How do I enroll students in a course?', a: 'Go to Dashboard → Courses → select your course → Students tab → click "Enroll Students". You can add students manually or upload a CSV file with email addresses.' },
  { q: 'Are survey responses truly anonymous?', a: 'Yes. TeachGage stores responses without any identifying information (no email, no IP address). Respondents are informed about anonymity before they begin.' },
  { q: 'How does the evaluation pipeline work?', a: 'Pipelines automate your evaluation workflow in stages (Start → Mid → End). Surveys are distributed automatically at each stage. Visit Dashboard → Pipelines to configure triggers and view progress.' },
  { q: 'How do I export my analytics data?', a: 'On any analytics page, click the Export button in the top-right corner. You can choose PDF for formatted reports or CSV for raw data.' },
  { q: 'What is the AI Growth Plan feature?', a: 'The AI Insights page uses Azure OpenAI to analyze your evaluation feedback, identify competency gaps, and generate a personalized professional development plan with SMART milestones.' },
  { q: 'How do I upgrade my account?', a: 'Go to Dashboard → Settings → Billing tab. You\'ll see your current plan and options to upgrade to Professional or Organization tiers.' },
  { q: 'Can I customize the default assessment templates?', a: 'Yes. Default templates can be fully customized — add, remove, or reorder questions, change response types, and save as a new version. No coding required.' },
  { q: 'How do I invite other instructors to my organization?', a: 'Organization admins can go to Admin → Users → Create Instructor or use the CSV bulk import feature to add multiple instructors at once.' },
  { q: 'What happens when my trial expires?', a: 'You\'ll see a subscription overlay prompting you to choose a plan. Your data is preserved for 30 days. You can upgrade at any time to regain full access.' },
]

const GUIDES = [
  { title: 'Getting Started Guide', desc: 'Step-by-step walkthrough for new users', icon: BookOpen, href: '/dashboard/guides/getting-started' },
  { title: 'Survey Builder Tutorial', desc: 'Learn to create effective surveys', icon: FileText, href: '/dashboard/guides/survey-builder' },
  { title: 'Pipeline Management', desc: 'Automate your evaluation workflow', icon: LifeBuoy, href: '/dashboard/guides/pipeline-management' },
  { title: 'Analytics & Reporting', desc: 'Understanding your data and exports', icon: FileText, href: '/dashboard/guides/analytics-reporting' },
  { title: 'AI Insights Guide', desc: 'Using AI-powered growth plans', icon: HelpCircle, href: '/dashboard/guides/ai-insights' },
  { title: 'Organization Admin Guide', desc: 'Managing users, departments, and billing', icon: BookOpen, href: '/dashboard/guides/organization-admin' },
]

export default function HelpPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'medium' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketSubmitted, setTicketSubmitted] = useState(false)

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 text-teachgage-blue animate-spin" /></div>
  if (!isAuthenticated) return null

  const filteredFaq = searchQuery
    ? FAQ_ITEMS.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : FAQ_ITEMS

  const handleTicketSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call — in production this would POST to a support ticket endpoint
    await new Promise(r => setTimeout(r, 1200))
    setIsSubmitting(false)
    setTicketSubmitted(true)
    setTicketForm({ subject: '', message: '', priority: 'medium' })
  }

  return (
    <>
      <Head><title>Help & Support - TeachGage</title></Head>
      <DashboardLayout title="Help & Support">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
              <LifeBuoy className="h-10 w-10 text-teachgage-blue" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">How can we help?</h1>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">Search our knowledge base, browse guides, or submit a support ticket.</p>
            {/* Search */}
            <div className="relative max-w-md mx-auto mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search help articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {GUIDES.map((g, i) => {
              const Icon = g.icon
              return (
                <a key={i} href={g.href} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-teachgage-blue hover:shadow-sm transition-all group">
                  <Icon className="h-6 w-6 text-teachgage-blue mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900">{g.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{g.desc}</p>
                </a>
              )
            })}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <HelpCircle className="h-6 w-6 mr-2 text-teachgage-blue" /> Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {filteredFaq.map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{item.q}</span>
                    {expandedFaq === i ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">{item.a}</div>
                  )}
                </div>
              ))}
              {filteredFaq.length === 0 && (
                <p className="text-center text-gray-400 py-6">No results found for "{searchQuery}"</p>
              )}
            </div>
          </div>

          {/* Support Ticket */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-teachgage-blue" /> Submit a Support Ticket
            </h2>
            {ticketSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Ticket Submitted!</h3>
                <p className="text-gray-500 mt-1">We'll get back to you within 24 hours.</p>
                <button onClick={() => setTicketSubmitted(false)} className="mt-4 text-sm text-teachgage-blue hover:underline">Submit another ticket</button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" required value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent" placeholder="Brief description of your issue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={ticketForm.priority} onChange={e => setTicketForm(f => ({ ...f, priority: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent">
                    <option value="low">Low — General question</option>
                    <option value="medium">Medium — Something isn't working as expected</option>
                    <option value="high">High — Blocking issue, can't complete a task</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={5} value={ticketForm.message} onChange={e => setTicketForm(f => ({ ...f, message: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent resize-none" placeholder="Describe your issue in detail..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-6 py-3 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50">
                  {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4 mr-2" /> Submit Ticket</>}
                </button>
              </form>
            )}
          </div>

          {/* Contact */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <Mail className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Need direct help?</h3>
            <p className="text-sm text-gray-500 mt-1">Email us at <a href="mailto:support@teachgage.com" className="text-teachgage-blue hover:underline">support@teachgage.com</a></p>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
