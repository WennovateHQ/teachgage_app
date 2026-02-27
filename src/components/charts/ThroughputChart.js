import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ThroughputChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Not enough data to display throughput trends yet. Run evaluations through the pipeline to generate insights.
      </div>
    )
  }

  // Format data for chart
  const chartData = data.map(item => ({
    period: item.period || item.date || 'Unknown',
    completed: item.completed || item.throughput || 0,
    inProgress: item.inProgress || 0,
    failed: item.failed || 0
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={192}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="period" 
          tick={{ fontSize: 12, fill: '#666' }}
          interval="preserveStartEnd"
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#666' }}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="completed" 
          stackId="a" 
          fill="#12b76a" 
          name="Completed"
        />
        <Bar 
          dataKey="inProgress" 
          stackId="a" 
          fill="#fb6514" 
          name="In Progress"
        />
        <Bar 
          dataKey="failed" 
          stackId="a" 
          fill="#f04438" 
          name="Failed"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
