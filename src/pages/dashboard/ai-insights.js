import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../contexts/AuthContext'
import { aiAPI } from '../../utils/api'
import {
  Brain,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Users,
  BarChart3,
  ChevronRight,
  Plus,
  Loader2,
  Award,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react'

export default function AIInsightsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [plans, setPlans] = useState([])
  const [activePlan, setActivePlan] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && isAuthenticated) loadPlans()
  }, [authLoading, isAuthenticated])

  const loadPlans = async () => {
    try {
      setIsLoading(true)
      const res = await aiAPI.getGrowthPlans({ status: 'active' })
      const data = res.data?.data || res.data || {}
      const list = data.plans || []
      setPlans(list)
      if (list.length > 0) setActivePlan(list[0])
    } catch (err) {
      console.error('Failed to load growth plans:', err)
      setError('Unable to load AI insights')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      const res = await aiAPI.generateGrowthPlan({})
      const plan = res.data?.data || res.data
      if (plan) {
        setActivePlan(plan)
        setPlans(prev => [plan, ...prev])
      }
    } catch (err) {
      console.error('Failed to generate growth plan:', err)
      setError('Failed to generate growth plan. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleMilestoneToggle = async (planId, index, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed'
    try {
      const res = await aiAPI.updateMilestone(planId, index, newStatus)
      const updated = res.data?.data || res.data
      if (updated) setActivePlan(updated)
    } catch (err) {
      console.error('Failed to update milestone:', err)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-teachgage-blue animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const sentimentIcon = (s) => {
    if (!s) return <Minus className="h-4 w-4 text-gray-400" />
    if (s.includes('positive')) return <ThumbsUp className="h-4 w-4 text-green-500" />
    if (s.includes('negative')) return <ThumbsDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const severityColor = (s) => {
    if (s === 'critical') return 'bg-red-100 text-red-800'
    if (s === 'high') return 'bg-orange-100 text-orange-800'
    if (s === 'medium') return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const milestoneTypeIcon = (type) => {
    switch (type) {
      case 'microlearning': return <BookOpen className="h-4 w-4" />
      case 'workshop': return <Users className="h-4 w-4" />
      case 'peer_mentoring': return <Users className="h-4 w-4" />
      case 'course': return <Award className="h-4 w-4" />
      case 'practice': return <Target className="h-4 w-4" />
      case 'reflection': return <Brain className="h-4 w-4" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <>
      <Head>
        <title>AI Insights & Growth Plans - TeachGage</title>
      </Head>

      <DashboardLayout title="AI Insights">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Brain className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Insights & Growth Plans</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Powered by Azure OpenAI — personalized analysis of your evaluation data
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Generate New Plan</>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">{error}</div>
          )}

          {!activePlan && !isGenerating && (
            <div className="space-y-6">
              {/* How it works */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Brain className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">AI-Powered Growth Plans</h2>
                <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                  Generate a personalized professional development plan. The AI analyzes your evaluation feedback,
                  identifies competency gaps, and creates SMART milestones with CEU tracking.
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Sparkles className="h-5 w-5 mr-2" /> Generate Growth Plan
                </button>
                <p className="text-xs text-gray-400 mt-3">
                  No evaluation data yet? A starter plan will be generated to help you get started.
                </p>
              </div>

              {/* How AI Insights works */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-3 bg-blue-50 rounded-xl inline-block mb-3"><BarChart3 className="h-6 w-6 text-blue-600" /></div>
                    <h4 className="font-medium text-gray-800 mb-1">1. Analyze Feedback</h4>
                    <p className="text-sm text-gray-500">AI processes your survey responses using sentiment analysis to understand feedback themes.</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-orange-50 rounded-xl inline-block mb-3"><Target className="h-6 w-6 text-orange-600" /></div>
                    <h4 className="font-medium text-gray-800 mb-1">2. Identify Gaps</h4>
                    <p className="text-sm text-gray-500">Scores are mapped across 6 competency domains to find areas needing improvement.</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-green-50 rounded-xl inline-block mb-3"><TrendingUp className="h-6 w-6 text-green-600" /></div>
                    <h4 className="font-medium text-gray-800 mb-1">3. Build Your Plan</h4>
                    <p className="text-sm text-gray-500">SMART milestones are generated with CEU hours, resources, and success metrics.</p>
                  </div>
                </div>
              </div>

              {/* Competency areas analyzed */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Competency Areas Analyzed</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: 'Communication', desc: 'Clarity, tone, and active listening' },
                    { name: 'Subject Mastery', desc: 'Depth of knowledge and expertise' },
                    { name: 'Student Engagement', desc: 'Participation and interaction' },
                    { name: 'Session Planning', desc: 'Organization and preparation' },
                    { name: 'Feedback & Assessment', desc: 'Quality and timeliness of feedback' },
                    { name: 'Learning Environment', desc: 'Inclusivity and safety' }
                  ].map((area, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 text-sm">{area.name}</p>
                      <p className="text-xs text-gray-500">{area.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePlan && (
            <div className="space-y-6">
              {/* Plan Header */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{activePlan.title}</h2>
                    <p className="text-gray-600 mt-2 max-w-3xl">{activePlan.summary}</p>
                    {activePlan.generationDuration && (
                      <p className="text-xs text-gray-400 mt-2">
                        Generated in {(activePlan.generationDuration / 1000).toFixed(1)}s
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activePlan.status === 'active' ? 'bg-green-100 text-green-800' :
                      activePlan.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activePlan.status}
                    </span>
                    {activePlan.overallScore && (
                      <div className="text-2xl font-bold text-teachgage-blue">{activePlan.overallScore.toFixed(1)}<span className="text-sm text-gray-400">/5</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Target className="h-5 w-5 text-purple-500" />} label="Growth Areas" value={activePlan.priorityGrowthAreas?.length || 0} bg="bg-purple-50" />
                <StatCard icon={<CheckCircle className="h-5 w-5 text-green-500" />} label="Completion" value={`${activePlan.completionPercentage || 0}%`} bg="bg-green-50" />
                <StatCard icon={<Award className="h-5 w-5 text-yellow-500" />} label="CEU Hours" value={`${activePlan.earnedCEUHours || 0}/${activePlan.totalCEUHours || 0}`} bg="bg-yellow-50" />
                <StatCard icon={<Flame className="h-5 w-5 text-orange-500" />} label="Strengths" value={activePlan.strengths?.length || 0} bg="bg-orange-50" />
              </div>

              {/* Sentiment Summary */}
              {activePlan.sentimentSummary && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-teachgage-blue" /> Sentiment Analysis
                  </h3>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-700">{activePlan.sentimentSummary.positivePercentage}% Positive</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Minus className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{activePlan.sentimentSummary.neutralPercentage}% Neutral</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ThumbsDown className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-gray-700">{activePlan.sentimentSummary.negativePercentage}% Negative</span>
                    </div>
                  </div>
                  {/* Sentiment bar */}
                  <div className="w-full h-4 bg-gray-200 rounded-full mt-4 flex overflow-hidden">
                    <div className="bg-green-500 h-4" style={{ width: `${activePlan.sentimentSummary.positivePercentage}%` }} />
                    <div className="bg-gray-400 h-4" style={{ width: `${activePlan.sentimentSummary.neutralPercentage}%` }} />
                    <div className="bg-red-500 h-4" style={{ width: `${activePlan.sentimentSummary.negativePercentage}%` }} />
                  </div>
                </div>
              )}

              {/* Competency Gaps / Heatmap */}
              {activePlan.competencyGaps?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" /> Competency Analysis
                  </h3>
                  <div className="space-y-3">
                    {activePlan.competencyGaps.map((gap, i) => (
                      <div key={i} className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 w-48 truncate">{gap.domain}</span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-4 relative">
                            <div
                              className={`h-4 rounded-full transition-all duration-500 ${
                                gap.currentScore >= 4 ? 'bg-green-500' :
                                gap.currentScore >= 3 ? 'bg-yellow-500' :
                                gap.currentScore >= 2 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(gap.currentScore / 5) * 100}%` }}
                            />
                            {/* benchmark marker */}
                            <div
                              className="absolute top-0 h-4 w-0.5 bg-gray-800"
                              style={{ left: `${(gap.benchmarkScore / 5) * 100}%` }}
                              title={`Benchmark: ${gap.benchmarkScore}`}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{gap.currentScore?.toFixed(1)}</span>
                        <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${severityColor(gap.gapSeverity)}`}>
                          {gap.gapSeverity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Black markers indicate institutional benchmarks</p>
                </div>
              )}

              {/* Milestones */}
              {activePlan.milestones?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-teachgage-blue" /> Growth Milestones
                  </h3>
                  <div className="space-y-3">
                    {activePlan.milestones.map((m, i) => (
                      <div key={i} className={`flex items-start p-4 rounded-lg border transition-colors ${
                        m.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <button
                          onClick={() => handleMilestoneToggle(activePlan._id || activePlan.id, i, m.status)}
                          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            m.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          {m.status === 'completed' && <CheckCircle className="h-4 w-4" />}
                        </button>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">{milestoneTypeIcon(m.type)}</span>
                            <h4 className={`font-medium ${m.status === 'completed' ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                              {m.title}
                            </h4>
                            {m.ceuHours > 0 && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{m.ceuHours} CEU</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{m.description}</p>
                          {m.successMetric && (
                            <p className="text-xs text-gray-400 mt-1 italic">{m.successMetric}</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {m.estimatedDuration || '—'}min
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Plans */}
              {plans.length > 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Plans</h3>
                  <div className="space-y-2">
                    {plans.slice(1).map((p, i) => (
                      <button
                        key={p._id || i}
                        onClick={() => setActivePlan(p)}
                        className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div>
                          <span className="font-medium text-gray-800">{p.title}</span>
                          <span className="text-xs text-gray-400 ml-3">{new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}

function StatCard({ icon, label, value, bg }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-xl ${bg}`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
