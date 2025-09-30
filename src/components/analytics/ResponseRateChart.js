export default function ResponseRateChart({ data }) {
  if (!data || !Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">⏰</div>
          <p>No response rate data available</p>
        </div>
      </div>
    )
  }

  const maxRate = Math.max(...data.map(item => item.rate), 100)

  return (
    <div className="h-48" data-chart="response-rate-chart">
      <div className="flex items-end justify-between h-40 px-2">
        {data.map((item, index) => {
          const height = (item.rate / maxRate) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              <div className="relative w-full">
                <div
                  className="bg-teachgage-blue rounded-t transition-all duration-500 hover:bg-teachgage-medium-blue cursor-pointer"
                  style={{ height: `${height * 1.6}px` }}
                  title={`${item.hour}: ${item.rate}% response rate`}
                >
                  {/* Value label on hover */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 hover:opacity-100 transition-opacity">
                    {item.rate}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
                {item.hour}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-gray-500 -ml-8">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
    </div>
  )
}
