import { useState, useEffect, useCallback } from 'react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  User, 
  Clock,
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react'
import toast from 'react-hot-toast'
import KanbanColumn from './KanbanColumn'
import EvaluationCard from './EvaluationCard'
import { pipelineAPI } from '../../utils/api'

export default function PipelineKanban({ pipelineId }) {
  const [pipeline, setPipeline] = useState({
    id: pipelineId,
    name: '',
    stages: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeId, setActiveId] = useState(null)
  const [draggedEvaluation, setDraggedEvaluation] = useState(null)

  useEffect(() => {
    loadPipelineData()
  }, [pipelineId])

  const loadPipelineData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await pipelineAPI.getPipeline(pipelineId)
      const data = response.data?.data || response.data
      if (data) {
        setPipeline({
          id: data._id || data.id || pipelineId,
          name: data.name || 'Pipeline',
          stages: (data.stages || []).map(stage => ({
            ...stage,
            id: stage._id || stage.id,
            evaluations: (stage.evaluations || []).map(ev => ({
              ...ev,
              id: ev._id || ev.id
            }))
          }))
        })
      }
    } catch (err) {
      console.error('Failed to load pipeline data:', err)
      setError('Failed to load pipeline data. The pipeline feature may not be configured yet.')
    } finally {
      setIsLoading(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = useCallback((event) => {
    const { active } = event
    setActiveId(active.id)
    
    // Find the evaluation being dragged
    const evaluation = findEvaluationById(active.id)
    setDraggedEvaluation(evaluation)
  }, [])

  const handleDragOver = useCallback((event) => {
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find the containers
    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return
    if (activeContainer === overContainer) return

    setPipeline(prev => {
      const activeStage = prev.stages.find(stage => stage.id === activeContainer)
      const overStage = prev.stages.find(stage => stage.id === overContainer)
      
      if (!activeStage || !overStage) return prev

      const activeEvaluation = activeStage.evaluations.find(evaluation => evaluation.id === activeId)
      if (!activeEvaluation) return prev

      // Remove from active stage
      const newActiveEvaluations = activeStage.evaluations.filter(evaluation => evaluation.id !== activeId)
      
      // Add to over stage
      const updatedEvaluation = {
        ...activeEvaluation,
        currentStage: overStage.id,
        lastUpdated: new Date().toISOString()
      }
      
      const newOverEvaluations = [...overStage.evaluations, updatedEvaluation]

      return {
        ...prev,
        stages: prev.stages.map(stage => {
          if (stage.id === activeContainer) {
            return { ...stage, evaluations: newActiveEvaluations }
          }
          if (stage.id === overContainer) {
            return { ...stage, evaluations: newOverEvaluations }
          }
          return stage
        })
      }
    })
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      setDraggedEvaluation(null)
      return
    }

    const activeId = active.id
    const overId = over.id

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) {
      setActiveId(null)
      setDraggedEvaluation(null)
      return
    }

    if (activeContainer === overContainer) {
      // Reordering within the same column
      setPipeline(prev => {
        const stage = prev.stages.find(s => s.id === activeContainer)
        if (!stage) return prev

        const oldIndex = stage.evaluations.findIndex(evaluation => evaluation.id === activeId)
        const newIndex = stage.evaluations.findIndex(evaluation => evaluation.id === overId)

        if (oldIndex !== newIndex) {
          const newEvaluations = arrayMove(stage.evaluations, oldIndex, newIndex)
          
          return {
            ...prev,
            stages: prev.stages.map(s => 
              s.id === activeContainer 
                ? { ...s, evaluations: newEvaluations }
                : s
            )
          }
        }
        
        return prev
      })
    }

    // Persist move to backend if moved to different stage
    if (activeContainer !== overContainer) {
      const overStage = pipeline.stages.find(s => s.id === overContainer)
      
      // Call API to persist the move
      pipelineAPI.moveEvaluation(pipelineId, activeId, overContainer)
        .then(() => {
          toast.success(`Evaluation moved to ${overStage?.name}`)
        })
        .catch((err) => {
          console.error('Failed to persist evaluation move:', err)
          toast.error('Failed to save move. Please refresh the page.')
          // Reload pipeline data to restore correct state
          loadPipelineData()
        })
    }

    setActiveId(null)
    setDraggedEvaluation(null)
  }, [pipeline.stages, pipelineId])

  const findContainer = useCallback((id) => {
    // Check if it's a stage
    if (pipeline.stages.find(stage => stage.id === id)) {
      return id
    }
    
    // Find which stage contains this evaluation
    return pipeline.stages.find(stage => 
      stage.evaluations.some(evaluation => evaluation.id === id)
    )?.id
  }, [pipeline.stages])

  const findEvaluationById = useCallback((id) => {
    for (const stage of pipeline.stages) {
      const evaluation = stage.evaluations.find(evaluation => evaluation.id === id)
      if (evaluation) return evaluation
    }
    return null
  }, [pipeline.stages])

  const addNewEvaluation = useCallback(async (stageId) => {
    try {
      const evalData = {
        currentStage: stageId,
        progress: 0,
        status: 'active',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      const response = await pipelineAPI.createEvaluation(pipelineId, evalData)
      const newEval = response.data?.data || response.data
      setPipeline(prev => ({
        ...prev,
        stages: prev.stages.map(stage =>
          stage.id === stageId
            ? { ...stage, evaluations: [...stage.evaluations, { ...newEval, id: newEval._id || newEval.id }] }
            : stage
        )
      }))
      toast.success('New evaluation added!')
    } catch (err) {
      console.error('Failed to create evaluation:', err)
      toast.error('Failed to create evaluation')
    }
  }, [pipelineId])

  const updateEvaluation = useCallback(async (evaluationId, updates) => {
    try {
      await pipelineAPI.updateEvaluation(pipelineId, evaluationId, updates)
      setPipeline(prev => ({
        ...prev,
        stages: prev.stages.map(stage => ({
          ...stage,
          evaluations: stage.evaluations.map(evaluation =>
            evaluation.id === evaluationId
              ? { ...evaluation, ...updates, lastUpdated: new Date().toISOString() }
              : evaluation
          )
        }))
      }))
    } catch (err) {
      console.error('Failed to update evaluation:', err)
      toast.error('Failed to update evaluation')
    }
  }, [pipelineId])

  const deleteEvaluation = useCallback(async (evaluationId) => {
    try {
      await pipelineAPI.updateEvaluation(pipelineId, evaluationId, { status: 'deleted' })
      setPipeline(prev => ({
        ...prev,
        stages: prev.stages.map(stage => ({
          ...stage,
          evaluations: stage.evaluations.filter(evaluation => evaluation.id !== evaluationId)
        }))
      }))
      toast.success('Evaluation deleted!')
    } catch (err) {
      console.error('Failed to delete evaluation:', err)
      toast.error('Failed to delete evaluation')
    }
  }, [pipelineId])

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue mx-auto"></div>
          <p className="text-gray-600 mt-3">Loading pipeline...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Pipeline Not Available</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (pipeline.stages.length === 0) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Pipeline Stages</h3>
          <p className="text-gray-600">This pipeline has no stages configured yet. Create stages to start tracking evaluations.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Pipeline Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pipeline.name}</h1>
            <p className="text-gray-600 mt-1">
              Manage course evaluations through their lifecycle
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-1 text-green-500" />
                <span>{getTotalEvaluations('active')} Active</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />
                <span>{getTotalEvaluations('completed')} Completed</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                <span>{getOverdueCount()} Overdue</span>
              </div>
            </div>
            
            <button className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New Evaluation
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-6 min-w-max">
            {pipeline.stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                evaluations={stage.evaluations}
                onAddEvaluation={addNewEvaluation}
                onUpdateEvaluation={updateEvaluation}
                onDeleteEvaluation={deleteEvaluation}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId && draggedEvaluation ? (
              <EvaluationCard
                evaluation={draggedEvaluation}
                isDragging={true}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )

  function getTotalEvaluations(status) {
    return pipeline.stages.reduce((total, stage) => 
      total + stage.evaluations.filter(evaluation => evaluation.status === status).length, 0
    )
  }

  function getOverdueCount() {
    const today = new Date().toISOString().split('T')[0]
    return pipeline.stages.reduce((total, stage) => 
      total + stage.evaluations.filter(evaluation => 
        evaluation.status === 'active' && evaluation.dueDate < today
      ).length, 0
    )
  }
}
