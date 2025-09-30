import { TrendingUp, TrendingDown, Users, BookOpen, Star, Activity } from 'lucide-react'

export default function MetricsCards({ metrics }) {
  const cards = [
    {
      title: 'Total Responses',
      value: metrics.totalResponses?.toLocaleString() || '0',
      change: `+${metrics.participationGrowth || 0}%`,
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Average Rating',
      value: `${metrics.averageRating || 0}/5.0`,
      change: `+${metrics.satisfactionTrend || 0}%`,
      changeType: 'positive',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      title: 'Response Rate',
      value: `${metrics.responseRate || 0}%`,
      change: '+5.2%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      title: 'Active Courses',
      value: metrics.totalCourses || '0',
      change: '+12%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium flex items-center ${
                card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {card.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
