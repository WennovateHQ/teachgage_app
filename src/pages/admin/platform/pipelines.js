import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import PipelineKanban from '../../../components/pipeline/PipelineKanban'

export default function PipelinePage() {
  const [selectedPipeline, setSelectedPipeline] = useState('pipeline_1')
  const [pipelines] = useState([
    { id: 'pipeline_1', name: 'Standard Evaluation Pipeline' },
    { id: 'pipeline_2', name: 'Mid-Semester Review Pipeline' },
    { id: 'pipeline_3', name: 'Final Assessment Pipeline' }
  ])

  return (
    <>
      <Head>
        <title>Pipeline Management - TeachGage Admin</title>
        <meta name="description" content="Manage evaluation pipelines and workflows" />
      </Head>

      <AdminLayout title="Pipeline Management">
        <div className="h-full">
          {/* Pipeline Selector */}
          <div className="mb-6">
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
            </div>
          </div>

          {/* Pipeline Kanban Board */}
          <div className="bg-white rounded-lg border border-gray-200 h-[calc(100vh-200px)]">
            <PipelineKanban pipelineId={selectedPipeline} />
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
