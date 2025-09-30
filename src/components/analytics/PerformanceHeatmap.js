export default function PerformanceHeatmap({ data }) {
  if (!data || !Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🔥</div>
          <p>No heatmap data available</p>
        </div>
      </div>
    )
  }

  // Group data by course and week
  const courses = [...new Set(data.map(item => item.course))]
  const weeks = [...new Set(data.map(item => item.week))].sort((a, b) => a - b)
  
  const getIntensity = (course, week) => {
    const item = data.find(d => d.course === course && d.week === week)
    if (!item) return 0
    
    // Normalize rating to 0-1 scale for color intensity
    return item.rating / 5
  }

  const getResponseCount = (course, week) => {
    const item = data.find(d => d.course === course && d.week === week)
    return item ? item.responses : 0
  }

  const getColorClass = (intensity) => {
    if (intensity === 0) return 'bg-gray-100'
    if (intensity < 0.6) return 'bg-red-200'
    if (intensity < 0.7) return 'bg-yellow-200'
    if (intensity < 0.8) return 'bg-green-200'
    if (intensity < 0.9) return 'bg-green-300'
    return 'bg-green-400'
  }

  return (
    <div className="overflow-x-auto" data-chart="performance-heatmap">
      <div className="min-w-max">
        {/* Header */}
        <div className="flex mb-2">
          <div className="w-24 text-sm font-medium text-gray-700 py-2">Course</div>
          {weeks.map(week => (
            <div key={week} className="w-20 text-center text-sm font-medium text-gray-700 py-2">
              Week {week}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-1">
          {courses.map(course => (
            <div key={course} className="flex">
              <div className="w-24 text-sm text-gray-900 py-3 pr-4 font-medium">
                {course}
              </div>
              {weeks.map(week => {
                const intensity = getIntensity(course, week)
                const responses = getResponseCount(course, week)
                const rating = data.find(d => d.course === course && d.week === week)?.rating || 0
                
                return (
                  <div
                    key={`${course}-${week}`}
                    className={`w-20 h-12 border border-gray-200 flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:scale-105 hover:shadow-md ${getColorClass(intensity)}`}
                    title={`${course} - Week ${week}\nRating: ${rating}/5.0\nResponses: ${responses}`}
                  >
                    <div className="text-center">
                      <div className="font-bold">{rating.toFixed(1)}</div>
                      <div className="text-xs text-gray-600">{responses}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Rating:</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-red-200 border border-gray-300"></div>
              <span className="text-xs text-gray-500">Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-yellow-200 border border-gray-300"></div>
              <span className="text-xs text-gray-500">Fair</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-200 border border-gray-300"></div>
              <span className="text-xs text-gray-500">Good</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-400 border border-gray-300"></div>
              <span className="text-xs text-gray-500">Excellent</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-lg font-bold text-gray-900">
              {(data.reduce((sum, item) => sum + item.rating, 0) / data.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-lg font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.responses, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Responses</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-lg font-bold text-gray-900">
              {courses.length}
            </div>
            <div className="text-sm text-gray-600">Courses Tracked</div>
          </div>
        </div>
      </div>
    </div>
  )
}
