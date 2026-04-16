import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PipelineKanban from '../../components/pipeline/PipelineKanban'
import PipelineAnalytics from '../../components/pipeline/PipelineAnalytics'
import TriggerConfigPanel from '../../components/pipeline/TriggerConfigPanel'
import { pipelineAPI } from '../../utils/api'
import { LayoutGrid, BarChart3, Zap, CheckCircle, X, Info, Plus, Loader2 } from 'lucide-react'

export default function InstructorPipelinePage() {
  const { user } = useAuth()
  const [selectedPipeline, setSelectedPipeline] = useState('')
  const [pipelines, setPipelines] = useState([])
  const [pipelineStages, setPipelineStages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('kanban')
  const [showDefaultPipelineNotification, setShowDefaultPipelineNotification] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', description: '', type: 'instructor_evaluation' })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadPipelines()
  }, [])

  const loadPipelines = async () => {
    try {
      setIsLoading(true)
      const response = await pipelineAPI.getPipelines()
      const data = response.data?.data || response.data || []
      const pipelineList = Array.isArray(data) ? data : []
      
      // Check if this is the first time loading and a default pipeline was created
      const hadNoPipelinesInitially = pipelines.length === 0
      const hasNewPipeline = pipelineList.length > 0 && pipelineList.length > pipelines.length
      
      setPipelines(pipelineList.map(p => ({ id: p._id || p.id, name: p.name })))
      if (pipelineList.length > 0) {
        const first = pipelineList[0]
        setSelectedPipeline(first._id || first.id)
        setPipelineStages(first.stages || [])
        
        // Show notification if a default pipeline was auto-seeded
        if (hadNoPipelinesInitially && hasNewPipeline && first.name === 'Default Evaluation Pipeline') {
          setShowDefaultPipelineNotification(true)
        }
      }
    } catch (err) {
      console.error('Failed to load pipelines:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load stages when pipeline selection changes
  useEffect(() => {
    const loadStages = async () => {
      if (!selectedPipeline) return
      try {
        const response = await pipelineAPI.getPipeline(selectedPipeline)
        const data = response.data?.data || response.data
        setPipelineStages(data?.stages || [])
      } catch (err) {
        console.error('Failed to load pipeline stages:', err)
      }
    }
    loadStages()
  }, [selectedPipeline])

  const handleCreatePipeline = async (e) => {
    e.preventDefault()
    if (!createForm.name.trim()) return
    setIsCreating(true)
    try {
      const response = await pipelineAPI.createPipeline({
        name: createForm.name,
        description: createForm.description,
        type: createForm.type,
        stages: [
          { name: 'Start', description: 'Initial evaluation stage', order: 0, type: 'survey' },
          { name: 'Mid', description: 'Mid-term evaluation', order: 1, type: 'survey' },
          { name: 'End', description: 'Final evaluation', order: 2, type: 'review' }
        ]
      })
      setShowCreateModal(false)
      setCreateForm({ name: '', description: '', type: 'instructor_evaluation' })
      await loadPipelines()
    } catch (err) {
      console.error('Failed to create pipeline:', err)
      alert('Failed to create pipeline. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const tabs = [
    { id: 'kanban', label: 'Board', icon: LayoutGrid },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'triggers', label: 'Triggers', icon: Zap }
  ]

  return (
    <>
      <Head>
        <title>Survey Pipeline - TeachGage</title>
        <meta name="description" content="Track your surveys through evaluation stages" />
      </Head>

      <DashboardLayout title="Survey Pipeline">
        <div className="h-full">
          {/* Pipeline Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Survey Pipeline</h1>
                <p className="text-gray-600 mt-1">
                  Track your surveys through each stage of the evaluation process
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Pipeline:</label>
                <select
                  value={selectedPipeline}
                  onChange={(e) => setSelectedPipeline(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                >
                  {pipelines.map(pipeline => (
                    <option key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /> New Pipeline
                </button>
              </div>
            </div>

            {/* Default Pipeline Notification */}
            {showDefaultPipelineNotification && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-blue-800">
                      Default Pipeline Created
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        We've automatically created a default 3-stage evaluation pipeline for you: 
                        <strong> Start → Mid → End</strong>. You can customize the stages, 
                        add triggers, and configure automated actions in the settings.
                      </p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => setShowDefaultPipelineNotification(false)}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Got it
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('triggers')
                          setShowDefaultPipelineNotification(false)
                        }}
                        className="text-blue-700 hover:text-blue-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Configure Pipeline
                      </button>
                    </div>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setShowDefaultPipelineNotification(false)}
                      className="inline-flex text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center space-x-1 mt-4 border-b border-gray-200">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-teachgage-blue text-teachgage-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          {activeTab === 'kanban' ? (
            <div className="bg-white rounded-lg border border-gray-200 h-[calc(100vh-300px)]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
                </div>
              ) : selectedPipeline ? (
                <PipelineKanban pipelineId={selectedPipeline} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500 text-lg">No pipelines available</p>
                    <p className="text-gray-400 mt-1">Create a pipeline to start tracking evaluations</p>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'analytics' ? (
            <div className="bg-gray-50 rounded-lg">
              {selectedPipeline ? (
                <PipelineAnalytics pipelineId={selectedPipeline} />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-400">Select a pipeline to view analytics</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              {selectedPipeline ? (
                <TriggerConfigPanel pipelineId={selectedPipeline} stages={pipelineStages} />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-400">Select a pipeline to manage triggers</p>
                </div>
              )}
            </div>
          )}

          {/* Create Pipeline Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Pipeline</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreatePipeline} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Name *</label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => setCreateForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Spring 2026 Evaluations"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => setCreateForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Describe the purpose of this pipeline..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Type</label>
                    <select
                      value={createForm.type}
                      onChange={(e) => setCreateForm(p => ({ ...p, type: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    >
                      <option value="instructor_evaluation">Instructor Evaluation</option>
                      <option value="course_evaluation">Course Evaluation</option>
                      <option value="professional_development">Professional Development</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500">
                    A default 3-stage pipeline (Start → Mid → End) will be created. You can customize stages afterwards.
                  </p>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="inline-flex items-center px-5 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-dark-blue transition-colors disabled:opacity-50"
                    >
                      {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : 'Create Pipeline'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}
