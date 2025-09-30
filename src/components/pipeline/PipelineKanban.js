import { useState, useCallback } from 'react'
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

export default function PipelineKanban({ pipelineId }) {
  const [pipeline, setPipeline] = useState({
    id: pipelineId,
    name: 'Standard Evaluation Pipeline',
    stages: [
      {
        id: 'stage_1',
        name: 'Planning',
        color: 'bg-blue-500',
        order: 0,
        evaluations: [
          {
            id: 'evaluation_1',
            courseId: 'course_1',
            courseName: 'Introduction to Psychology',
            instructor: 'Dr. Sarah Johnson',
            currentStage: 'stage_1',
            progress: 10,
            dueDate: '2024-02-15',
            status: 'active',
            priority: 'high',
            lastUpdated: '2024-01-10T10:30:00Z'
          },
          {
            id: 'evaluation_2',
            courseId: 'course_2',
            courseName: 'Advanced Mathematics',
            instructor: 'Prof. Michael Chen',
            currentStage: 'stage_1',
            progress: 25,
            dueDate: '2024-02-20',
            status: 'active',
            priority: 'medium',
            lastUpdated: '2024-01-12T14:15:00Z'
          }
        ]
      },
      {
        id: 'stage_2',
        name: 'Survey Creation',
        color: 'bg-yellow-500',
        order: 1,
        evaluations: [
          {
            id: 'evaluation_3',
            courseId: 'course_3',
            courseName: 'Digital Marketing',
            instructor: 'Dr. Emily Rodriguez',
            currentStage: 'stage_2',
            progress: 45,
            dueDate: '2024-02-18',
            status: 'active',
            priority: 'high',
            lastUpdated: '2024-01-14T09:20:00Z'
          }
        ]
      },
      {
        id: 'stage_3',
        name: 'Data Collection',
        color: 'bg-orange-500',
        order: 2,
        evaluations: [
          {
            id: 'evaluation_4',
            courseId: 'course_4',
            courseName: 'Software Engineering',
            instructor: 'Dr. James Wilson',
            currentStage: 'stage_3',
            progress: 70,
            dueDate: '2024-02-12',
            status: 'active',
            priority: 'medium',
            lastUpdated: '2024-01-15T16:45:00Z'
          },
          {
            id: 'evaluation_5',
            courseId: 'course_5',
            courseName: 'Data Science Fundamentals',
            instructor: 'Prof. Lisa Anderson',
            currentStage: 'stage_3',
            progress: 65,
            dueDate: '2024-02-25',
            status: 'active',
            priority: 'low',
            lastUpdated: '2024-01-16T11:30:00Z'
          }
        ]
      },
      {
        id: 'stage_4',
        name: 'Analysis',
        color: 'bg-purple-500',
        order: 3,
        evaluations: [
          {
            id: 'evaluation_6',
            courseId: 'course_6',
            courseName: 'Business Analytics',
            instructor: 'Dr. Robert Taylor',
            currentStage: 'stage_4',
            progress: 85,
            dueDate: '2024-02-10',
            status: 'active',
            priority: 'high',
            lastUpdated: '2024-01-17T13:20:00Z'
          }
        ]
      },
      {
        id: 'stage_5',
        name: 'Completed',
        color: 'bg-green-500',
        order: 4,
        evaluations: [
          {
            id: 'evaluation_7',
            courseId: 'course_7',
            courseName: 'Web Development',
            instructor: 'Dr. Maria Garcia',
            currentStage: 'stage_5',
            progress: 100,
            dueDate: '2024-01-30',
            status: 'completed',
            priority: 'medium',
            lastUpdated: '2024-01-18T10:15:00Z'
          }
        ]
      }
    ]
  })

  const [activeId, setActiveId] = useState(null)
  const [draggedEvaluation, setDraggedEvaluation] = useState(null)

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

    setActiveId(null)
    setDraggedEvaluation(null)
    
    // Show success message
    if (activeContainer !== overContainer) {
      const overStage = pipeline.stages.find(s => s.id === overContainer)
      toast.success(`Evaluation moved to ${overStage?.name}`)
    }
  }, [pipeline.stages])

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

  const addNewEvaluation = useCallback((stageId) => {
    const newEvaluation = {
      id: `evaluation_${Date.now()}`,
      courseId: `course_${Date.now()}`,
      courseName: 'New Course Evaluation',
      instructor: 'Instructor Name',
      currentStage: stageId,
      progress: 0,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      priority: 'medium',
      lastUpdated: new Date().toISOString()
    }

    setPipeline(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId 
          ? { ...stage, evaluations: [...stage.evaluations, newEvaluation] }
          : stage
      )
    }))

    toast.success('New evaluation added!')
  }, [])

  const updateEvaluation = useCallback((evaluationId, updates) => {
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
  }, [])

  const deleteEvaluation = useCallback((evaluationId) => {
    setPipeline(prev => ({
      ...prev,
      stages: prev.stages.map(stage => ({
        ...stage,
        evaluations: stage.evaluations.filter(evaluation => evaluation.id !== evaluationId)
      }))
    }))
    
    toast.success('Evaluation deleted!')
  }, [])

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
