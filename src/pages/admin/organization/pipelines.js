import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAuth } from '../../../contexts/AuthContext'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import PipelineKanban from '../../../components/pipeline/PipelineKanban'

export default function OrganizationPipelinePage() {
  const { user } = useAuth()
  const [selectedPipeline, setSelectedPipeline] = useState('pipeline_1')
  const [pipelines] = useState([
    { id: 'pipeline_1', name: 'Standard Evaluation Pipeline' },
    { id: 'pipeline_2', name: 'Mid-Semester Review Pipeline' },
    { id: 'pipeline_3', name: 'Final Assessment Pipeline' },
    { id: 'pipeline_4', name: 'Department Review Pipeline' }
  ])

  return (
    <>
      <Head>
        <title>Organization Pipeline - TeachGage</title>
        <meta name="description" content="Manage organization-wide survey evaluation pipelines" />
      </Head>

      <DashboardLayout title="Organization Pipeline">
        <div className="h-full">
          {/* Pipeline Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Organization Pipeline</h1>
                <p className="text-gray-600 mt-1">
                  Monitor all surveys across your organization through evaluation stages
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
              </div>
            </div>
          </div>

          {/* Pipeline Kanban Board */}
          <div className="bg-white rounded-lg border border-gray-200 h-[calc(100vh-250px)]">
            <PipelineKanban pipelineId={selectedPipeline} />
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
