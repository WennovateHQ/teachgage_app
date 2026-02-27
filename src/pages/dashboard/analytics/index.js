import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { useResponseTrends, useDashboardStats } from '../../../hooks/useApi'
import ExportControls from '../../../components/analytics/ExportControls'
import { 
  TrendingUp, 
  TrendingDown, 
  Star,
  Download,
  FileText
} from 'lucide-react'

// SVG Donut Chart for average rating
function RatingDonut({ rating, maxRating = 5 }) {
  const pct = Math.min((rating / maxRating) * 100, 100)
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  // Color segments based on rating ranges
  const getColor = (r) => {
    if (r >= 4) return '#3B82F6'   // blue
    if (r >= 3) return '#10B981'   // green
    if (r >= 2) return '#F59E0B'   // amber
    return '#EF4444'               // red
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Background circle */}
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="14" />
        {/* Colored arc */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={getColor(rating)}
          strokeWidth="14"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</span>
        <div className="flex items-center justify-center mt-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              className={`h-4 w-4 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Simple SVG line/area chart
function MiniLineChart({ data, dataKey, height = 100, color = '#3B82F6' }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data yet</div>
  }

  const values = data.map(d => d[dataKey] || 0)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const w = 280
  const h = height
  const padding = 4

  const points = values.map((v, i) => {
    const x = padding + (i / Math.max(values.length - 1, 1)) * (w - padding * 2)
    const y = h - padding - ((v - min) / range) * (h - padding * 2)
    return `${x},${y}`
  })

  const polyline = points.join(' ')
  const areaPoints = `${padding},${h - padding} ${polyline} ${w - padding},${h - padding}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      {/* Area fill */}
      <polygon points={areaPoints} fill={color} fillOpacity="0.1" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* End dot */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].split(',')[0]}
          cy={points[points.length - 1].split(',')[1]}
          r="4" fill={color}
        />
      )}
    </svg>
  )
}

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [dateRange, setDateRange] = useState('30d')

  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: trendsData, isLoading: trendsLoading } = useResponseTrends({ range: dateRange })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const statsRaw = statsData?.data?.data || statsData?.data || {}
  const stats = typeof statsRaw === 'object' && !Array.isArray(statsRaw) ? statsRaw : {}
  const trendsRaw = trendsData?.data?.data?.data || trendsData?.data?.data || trendsData?.data || []
  const trends = Array.isArray(trendsRaw) ? trendsRaw : []

  const avgRating = stats.averageRating || 0
  const responseRate = stats.responseRate || 0
  const ratingChange = stats.ratingChange || 0
  const responseRateChange = stats.responseRateChange || 0
  const strengths = stats.strengths || []
  const weaknesses = stats.weaknesses || []

  return (
    <>
      <Head>
        <title>Instructor Evaluation - TeachGage</title>
        <meta name="description" content="View analytics and insights for your evaluations" />
      </Head>

      <DashboardLayout title="Analytics">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Instructor Evaluation</h1>
              <div className="flex items-center space-x-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <ExportControls stats={stats} trends={trends} />
              </div>
            </div>
            <div className="mt-1 border-b border-gray-200" />
          </div>

          {/* Overview label */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>

          {/* Row 1: Rating Donut + Rating Trend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Average Rating Donut */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-center" data-chart>
              <RatingDonut rating={avgRating} />
            </div>

            {/* Rating Trend */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6" data-chart>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rating Trend</h3>
                <div className="flex items-center space-x-1">
                  {ratingChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {ratingChange >= 0 ? '+' : ''}{ratingChange.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="h-32">
                <MiniLineChart data={trends} dataKey="rating" height={128} color="#3B82F6" />
              </div>
            </div>
          </div>

          {/* Row 2: Response Rate + Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Response Rate */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Response Rate</h3>
                <div className="flex items-center space-x-1">
                  {responseRateChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${responseRateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {responseRateChange >= 0 ? '+' : ''}{responseRateChange}%
                  </span>
                </div>
              </div>
              <p className="text-5xl font-bold text-gray-900 mb-4">{responseRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-teachgage-blue h-3 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(responseRate, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {stats.totalResponses || 0} of {stats.totalSent || stats.totalInvitations || '-'} responded
              </p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths & Weaknesses</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Strengths</h4>
                  {strengths.length > 0 ? (
                    <ul className="space-y-1">
                      {strengths.slice(0, 4).map((s, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-1.5 mt-0.5">&#8226;</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li className="flex items-start"><span className="text-green-400 mr-1.5 mt-0.5">&#8226;</span>Collect more responses to see strengths</li>
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Weaknesses</h4>
                  {weaknesses.length > 0 ? (
                    <ul className="space-y-1">
                      {weaknesses.slice(0, 4).map((w, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start">
                          <span className="text-red-500 mr-1.5 mt-0.5">&#8226;</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li className="flex items-start"><span className="text-red-400 mr-1.5 mt-0.5">&#8226;</span>Collect more responses to see areas for improvement</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Historical Trend (full width) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6" data-chart>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Trend</h3>
            {trendsLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
              </div>
            ) : trends.length > 0 ? (
              <div className="h-56">
                <HistoricalChart data={trends} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <p>Not enough data to display historical trends yet. Collect more evaluation responses.</p>
              </div>
            )}
          </div>

          {/* Row 4: Rating Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const pct = stats.ratingDistribution?.[rating] || 0
                return (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-teachgage-blue h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-10 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

// Historical trend chart with dual lines (rating + responses)
function HistoricalChart({ data }) {
  if (!data || data.length === 0) return null

  const ratings = data.map(d => d.rating || d.averageRating || 0)
  const responses = data.map(d => d.responses || d.count || 0)

  const maxRating = 5
  const maxResponses = Math.max(...responses, 1)

  const w = 700
  const h = 200
  const padL = 30
  const padR = 10
  const padT = 10
  const padB = 30

  const chartW = w - padL - padR
  const chartH = h - padT - padB

  const ratingPoints = ratings.map((v, i) => {
    const x = padL + (i / Math.max(data.length - 1, 1)) * chartW
    const y = padT + chartH - (v / maxRating) * chartH
    return `${x},${y}`
  }).join(' ')

  const responsePoints = responses.map((v, i) => {
    const x = padL + (i / Math.max(data.length - 1, 1)) * chartW
    const y = padT + chartH - (v / maxResponses) * chartH
    return `${x},${y}`
  }).join(' ')

  // Y-axis labels for rating
  const yLabels = [1, 2, 3, 4, 5]

  // X-axis labels (dates)
  const step = Math.max(1, Math.floor(data.length / 6))
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      {/* Grid lines */}
      {yLabels.map(v => {
        const y = padT + chartH - (v / maxRating) * chartH
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{v}.0</text>
          </g>
        )
      })}

      {/* Rating line (blue) */}
      <polyline points={ratingPoints} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Response line (dark gray) */}
      <polyline points={responsePoints} fill="none" stroke="#374151" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 2" />

      {/* X-axis labels */}
      {xLabels.map((item, idx) => {
        const origIdx = data.indexOf(item)
        const x = padL + (origIdx / Math.max(data.length - 1, 1)) * chartW
        const label = item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short' }) : ''
        return (
          <text key={idx} x={x} y={h - 6} textAnchor="middle" fontSize="10" fill="#9CA3AF">{label}</text>
        )
      })}

      {/* Legend */}
      <line x1={w - 160} y1={12} x2={w - 140} y2={12} stroke="#3B82F6" strokeWidth="2.5" />
      <text x={w - 135} y={16} fontSize="10" fill="#6B7280">Rating</text>
      <line x1={w - 85} y1={12} x2={w - 65} y2={12} stroke="#374151" strokeWidth="2" strokeDasharray="4 2" />
      <text x={w - 60} y={16} fontSize="10" fill="#6B7280">Responses</text>
    </svg>
  )
}
