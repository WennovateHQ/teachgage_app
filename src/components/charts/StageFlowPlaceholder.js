import { ArrowRight, Plus } from 'lucide-react'

export default function StageFlowPlaceholder() {
  return (
    <div className="space-y-4">
      {/* Placeholder stages */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-gray-400 font-semibold">1</span>
            </div>
            <h4 className="font-medium text-gray-700">Start Stage</h4>
            <p className="text-sm text-gray-500">Survey distribution and initial collection</p>
            <div className="text-xs text-gray-400">0 evaluations</div>
          </div>
        </div>
        
        <ArrowRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
        
        <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-gray-400 font-semibold">2</span>
            </div>
            <h4 className="font-medium text-gray-700">Mid Stage</h4>
            <p className="text-sm text-gray-500">Active evaluation and feedback collection</p>
            <div className="text-xs text-gray-400">0 evaluations</div>
          </div>
        </div>
        
        <ArrowRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
        
        <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-gray-400 font-semibold">3</span>
            </div>
            <h4 className="font-medium text-gray-700">End Stage</h4>
            <p className="text-sm text-gray-500">Review, reporting, and completion</p>
            <div className="text-xs text-gray-400">0 evaluations</div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Plus className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-800">Start Your First Evaluation</h4>
            <p className="text-sm text-blue-600 mt-1">
              Create surveys and move them through the pipeline to see stage performance metrics
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">How Pipeline Analytics Work:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Create surveys and assign them to evaluation stages</li>
          <li>• Track evaluations as they move through each stage</li>
          <li>• Monitor completion rates and average time per stage</li>
          <li>• Identify bottlenecks and optimize your evaluation process</li>
        </ul>
      </div>
    </div>
  )
}
