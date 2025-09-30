import { useMemo } from 'react'

export default function TrendCharts({ data, metric }) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return []
    
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item[metric] || 0
    }))
  }, [data, metric])

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(item => item.value), 1)
  }, [chartData])

  const getMetricLabel = (metric) => {
    const labels = {
      responses: 'Responses',
      averageRating: 'Avg Rating',
      responseRate: 'Response Rate (%)'
    }
    return labels[metric] || metric
  }

  const getMetricColor = (metric) => {
    const colors = {
      responses: 'stroke-blue-500 fill-blue-100',
      averageRating: 'stroke-yellow-500 fill-yellow-100',
      responseRate: 'stroke-green-500 fill-green-100'
    }
    return colors[metric] || 'stroke-gray-500 fill-gray-100'
  }

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No trend data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64" data-chart="trend-chart">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700">{getMetricLabel(metric)} Over Time</h4>
      </div>
      
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Chart area */}
          <g transform="translate(40, 20)">
            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = 160 - (ratio * 160)
              const value = Math.round(maxValue * ratio)
              return (
                <g key={index}>
                  <line x1="0" y1={y} x2="320" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  <text x="-5" y={y + 4} textAnchor="end" className="text-xs fill-gray-500">
                    {metric === 'averageRating' ? value.toFixed(1) : value}
                  </text>
                </g>
              )
            })}
            
            {/* Chart line and area */}
            {chartData.length > 1 && (
              <>
                {/* Area fill */}
                <path
                  d={`M 0 160 ${chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 320
                    const y = 160 - ((point.value / maxValue) * 160)
                    return `L ${x} ${y}`
                  }).join(' ')} L 320 160 Z`}
                  className={getMetricColor(metric).split(' ')[1]}
                  fillOpacity="0.3"
                />
                
                {/* Line */}
                <path
                  d={`M ${chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 320
                    const y = 160 - ((point.value / maxValue) * 160)
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')}`}
                  className={getMetricColor(metric).split(' ')[0]}
                  strokeWidth="2"
                  fill="none"
                />
                
                {/* Data points */}
                {chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 320
                  const y = 160 - ((point.value / maxValue) * 160)
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        className={getMetricColor(metric).split(' ')[0]}
                        fill="white"
                        strokeWidth="2"
                      />
                      {/* Tooltip on hover */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="transparent"
                        className="hover:fill-black hover:fill-opacity-10 cursor-pointer"
                      >
                        <title>{`${point.date}: ${point.value}`}</title>
                      </circle>
                    </g>
                  )
                })}
              </>
            )}
            
            {/* X-axis labels */}
            {chartData.map((point, index) => {
              if (index % Math.ceil(chartData.length / 5) === 0) {
                const x = (index / (chartData.length - 1)) * 320
                return (
                  <text
                    key={index}
                    x={x}
                    y="180"
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {point.date}
                  </text>
                )
              }
              return null
            })}
          </g>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-2">
        <div className="flex items-center text-sm text-gray-600">
          <div className={`w-3 h-3 rounded-full mr-2 ${getMetricColor(metric).split(' ')[0].replace('stroke-', 'bg-')}`}></div>
          {getMetricLabel(metric)}
        </div>
      </div>
    </div>
  )
}
