import { CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function CompletionFunnel({ total = 0, inProgress = 0, completed = 0 }) {
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No evaluation data available yet
      </div>
    )
  }

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  const progressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0
  const remainingRate = 100 - completionRate - progressRate

  return (
    <div className="space-y-4">
      {/* Funnel Visualization */}
      <div className="space-y-2">
        {/* Total */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Total Evaluations</span>
            <span className="text-sm text-gray-600">{total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8">
            <div 
              className="bg-gray-400 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ width: '100%' }}
            >
              {total}
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">In Progress</span>
            <span className="text-sm text-gray-600">{inProgress} ({progressRate}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8">
            <div 
              className="bg-orange-500 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
              style={{ width: `${progressRate}%` }}
            >
              {progressRate > 10 && `${inProgress}`}
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Completed</span>
            <span className="text-sm text-gray-600">{completed} ({completionRate}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8">
            <div 
              className="bg-green-500 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            >
              {completionRate > 10 && `${completed}`}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="text-lg font-bold text-gray-900">{inProgress}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-lg font-bold text-gray-900">{completed}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Completion Rate</p>
          <p className="text-lg font-bold text-gray-900">{completionRate}%</p>
        </div>
      </div>
    </div>
  )
}
