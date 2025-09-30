import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, MoreVertical } from 'lucide-react'
import EvaluationCard from './EvaluationCard'

export default function KanbanColumn({ 
  stage, 
  evaluations, 
  onAddEvaluation, 
  onUpdateEvaluation, 
  onDeleteEvaluation 
}) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  })

  return (
    <div className="w-80 bg-gray-100 rounded-lg p-4">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
          <h3 className="font-semibold text-gray-900">{stage.name}</h3>
          <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            {evaluations.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAddEvaluation(stage.id)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Add evaluation"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className="min-h-[200px] space-y-3"
      >
        <SortableContext 
          items={evaluations.map(eval => eval.id)}
          strategy={verticalListSortingStrategy}
        >
          {evaluations.map((evaluation) => (
            <EvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              onUpdate={onUpdateEvaluation}
              onDelete={onDeleteEvaluation}
            />
          ))}
        </SortableContext>

        {/* Empty State */}
        {evaluations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="bg-gray-200 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <p className="text-sm">No evaluations in this stage</p>
              <button
                onClick={() => onAddEvaluation(stage.id)}
                className="mt-2 text-teachgage-blue hover:text-teachgage-medium-blue text-sm font-medium"
              >
                Add first evaluation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
