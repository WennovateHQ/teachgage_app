import { useState, useEffect } from 'react'
import { analyticsAPI } from '../../utils/api'
import {
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowRight,
  Loader2
} from 'lucide-react'

export default function PipelineAnalytics({ pipelineId }) {
  const [metrics, setMetrics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMetrics = async () => {
      if (!pipelineId) return
      setIsLoading(true)
      setError(null)

      try {
        const response = await analyticsAPI.getPipelineMetrics({ pipelineId })
        const data = response.data?.data || response.data || {}
        setMetrics(data)
      } catch (err) {
        console.error('Failed to load pipeline metrics:', err)
        setError('Unable to load pipeline analytics')
        // Set safe defaults so the UI still renders
        setMetrics({})
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [pipelineId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-teachgage-blue animate-spin" />
      </div>
    )
  }

  // Safely extract data
  const totalEvaluations = metrics?.totalEvaluations || metrics?.totalInstances || 0
  const completedEvaluations = metrics?.completedEvaluations || metrics?.completed || 0
  const inProgressEvaluations = metrics?.inProgressEvaluations || metrics?.inProgress || 0
  const overdueEvaluations = metrics?.overdueEvaluations || metrics?.overdue || 0
  const completionRate = totalEvaluations > 0
    ? Math.round((completedEvaluations / totalEvaluations) * 100)
    : 0
  const stageMetrics = metrics?.stageMetrics || metrics?.stages || []
  const throughputTrend = metrics?.throughputTrend || metrics?.trend || []

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          {error}. Showing placeholder data.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="h-5 w-5 text-blue-500" />}
          label="Total Evaluations"
          value={totalEvaluations}
          bgColor="bg-blue-50"
        />
        <MetricCard
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          label="Completed"
          value={completedEvaluations}
          bgColor="bg-green-50"
          subText={`${completionRate}% completion rate`}
        />
        <MetricCard
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
          label="In Progress"
          value={inProgressEvaluations}
          bgColor="bg-yellow-50"
        />
        <MetricCard
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          label="Overdue"
          value={overdueEvaluations}
          bgColor="bg-red-50"
        />
      </div>

      {/* Stage Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-teachgage-blue" />
          Stage Performance
        </h3>

        {stageMetrics.length > 0 ? (
          <div className="space-y-4">
            {stageMetrics.map((stage, index) => (
              <StageRow
                key={stage.stageId || stage.name || index}
                name={stage.name || stage.stageName || `Stage ${index + 1}`}
                count={stage.count || stage.evaluations || 0}
                avgDays={stage.avgDays || stage.averageDuration || 0}
                completionRate={stage.completionRate || 0}
                isLast={index === stageMetrics.length - 1}
              />
            ))}
          </div>
        ) : (
          <StageFlowPlaceholder />
        )}
      </div>

      {/* Throughput Trend */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-teachgage-blue" />
          Pipeline Throughput
        </h3>

        {throughputTrend.length > 0 ? (
          <div className="h-48">
            <ThroughputChart data={throughputTrend} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Not enough data to display throughput trends yet. Run evaluations through the pipeline to generate insights.
          </div>
        )}
      </div>

      {/* Completion Funnel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Funnel</h3>
        <CompletionFunnel
          total={totalEvaluations}
          inProgress={inProgressEvaluations}
          completed={completedEvaluations}
        />
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, bgColor, subText }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-xl ${bgColor}`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subText && <p className="text-xs text-gray-400 mt-0.5">{subText}</p>}
        </div>
      </div>
    </div>
  )
}

function StageRow({ name, count, avgDays, completionRate, isLast }) {
  return (
    <div className="flex items-center">
      <div className="flex-1 border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <span className="text-sm text-gray-500">{count} evaluations</span>
        </div>
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <span className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
            Avg {avgDays > 0 ? `${avgDays.toFixed(1)} days` : '—'}
          </span>
          {completionRate > 0 && (
            <span className="flex items-center">
              <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-400" />
              {completionRate}% complete
            </span>
          )}
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div
            className="bg-teachgage-blue h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(completionRate, 100)}%` }}
          />
        </div>
      </div>
      {!isLast && (
        <ArrowRight className="h-5 w-5 text-gray-300 mx-2 flex-shrink-0" />
      )}
    </div>
  )
}

function StageFlowPlaceholder() {
  const stages = ['Start', 'Mid', 'End']
  return (
    <div className="flex items-center justify-center space-x-3 py-8">
      {stages.map((stage, i) => (
        <div key={stage} className="flex items-center">
          <div className="px-6 py-3 bg-gray-100 rounded-lg text-center">
            <p className="font-medium text-gray-700">{stage}</p>
            <p className="text-xs text-gray-400 mt-1">0 evaluations</p>
          </div>
          {i < stages.length - 1 && (
            <ArrowRight className="h-5 w-5 text-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  )
}

function CompletionFunnel({ total, inProgress, completed }) {
  const maxWidth = 100
  const inProgressWidth = total > 0 ? (inProgress / total) * maxWidth : 0
  const completedWidth = total > 0 ? (completed / total) * maxWidth : 0

  const rows = [
    { label: 'Started', value: total, width: maxWidth, color: 'bg-blue-500' },
    { label: 'In Progress', value: inProgress, width: Math.max(inProgressWidth, 5), color: 'bg-yellow-500' },
    { label: 'Completed', value: completed, width: Math.max(completedWidth, 5), color: 'bg-green-500' }
  ]

  return (
    <div className="space-y-3">
      {rows.map(row => (
        <div key={row.label} className="flex items-center">
          <span className="text-sm text-gray-600 w-24">{row.label}</span>
          <div className="flex-1 mx-4">
            <div
              className={`h-8 ${row.color} rounded-lg flex items-center justify-end pr-3 transition-all duration-700`}
              style={{ width: `${row.width}%` }}
            >
              <span className="text-white text-xs font-medium">{row.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ThroughputChart({ data }) {
  if (!data || data.length === 0) return null

  const values = data.map(d => d.count || d.completed || 0)
  const max = Math.max(...values, 1)

  const w = 500
  const h = 170
  const padL = 30
  const padR = 10
  const padT = 10
  const padB = 25
  const chartW = w - padL - padR
  const chartH = h - padT - padB

  const barWidth = Math.min(30, (chartW / values.length) * 0.6)
  const gap = (chartW - barWidth * values.length) / Math.max(values.length - 1, 1)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      {/* Grid */}
      {[0, 0.5, 1].map(pct => {
        const y = padT + chartH - pct * chartH
        return (
          <g key={pct}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">
              {Math.round(max * pct)}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {values.map((v, i) => {
        const x = padL + i * (barWidth + gap)
        const barH = (v / max) * chartH
        const y = padT + chartH - barH
        const label = data[i].date
          ? new Date(data[i].date).toLocaleDateString('en-US', { month: 'short' })
          : data[i].period || ''

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx="3"
              fill="#3B82F6"
              fillOpacity="0.8"
            />
            <text
              x={x + barWidth / 2}
              y={h - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#9CA3AF"
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
