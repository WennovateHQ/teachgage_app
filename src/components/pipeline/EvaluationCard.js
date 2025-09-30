import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MoreHorizontal,
  GripVertical 
} from 'lucide-react'

export default function EvaluationCard({ 
  evaluation, 
  isDragging = false, 
  onUpdate, 
  onDelete 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: evaluation.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: sortableIsDragging || isDragging ? 0.5 : 1,
  }

  const isOverdue = new Date(evaluation.dueDate) < new Date() && evaluation.status !== 'completed'
  const priorityColors = {
    high: 'border-red-400 bg-red-50',
    medium: 'border-yellow-400 bg-yellow-50',
    low: 'border-green-400 bg-green-50'
  }

  const statusIcons = {
    active: <Clock className="h-4 w-4 text-blue-500" />,
    completed: <CheckCircle className="h-4 w-4 text-green-500" />,
    overdue: <AlertTriangle className="h-4 w-4 text-red-500" />
  }

  const getStatusIcon = () => {
    if (isOverdue) return statusIcons.overdue
    return statusIcons[evaluation.status] || statusIcons.active
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        priorityColors[evaluation.priority] || 'border-gray-400 bg-gray-50'
      } ${sortableIsDragging ? 'rotate-3 scale-105' : ''}`}
    >
      <div className="p-4">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">
              {evaluation.courseName}
            </h4>
            <div className="flex items-center text-xs text-gray-600">
              <User className="h-3 w-3 mr-1" />
              <span>{evaluation.instructor}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{evaluation.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                evaluation.progress === 100 
                  ? 'bg-green-500' 
                  : evaluation.progress >= 50 
                  ? 'bg-blue-500' 
                  : 'bg-yellow-500'
              }`}
              style={{ width: `${evaluation.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="h-3 w-3 mr-1" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {new Date(evaluation.dueDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Priority Badge */}
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              evaluation.priority === 'high' 
                ? 'bg-red-100 text-red-700'
                : evaluation.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {evaluation.priority}
            </span>
            
            {/* Status Icon */}
            {getStatusIcon()}
          </div>
        </div>

        {/* Overdue Warning */}
        {isOverdue && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <div className="flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>Overdue by {Math.ceil((new Date() - new Date(evaluation.dueDate)) / (1000 * 60 * 60 * 24))} days</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
