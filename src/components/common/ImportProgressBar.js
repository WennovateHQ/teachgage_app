import { useState, useEffect, useRef } from 'react'
import { Upload, CheckCircle, AlertTriangle, X, Loader2 } from 'lucide-react'

/**
 * Import Progress Bar with real-time streaming status.
 * Shows file upload progress, row-by-row processing, and final results.
 */
export default function ImportProgressBar({
  isUploading = false,
  totalRows = 0,
  processedRows = 0,
  successCount = 0,
  failureCount = 0,
  errors = [],
  status = 'idle', // idle | uploading | processing | complete | error
  onDismiss,
  batchId // for rollback capability
}) {
  const [showErrors, setShowErrors] = useState(false)
  const progressPercent = totalRows > 0 ? Math.round((processedRows / totalRows) * 100) : 0

  if (status === 'idle') return null

  const statusConfig = {
    uploading: { color: 'blue', icon: <Upload className="h-5 w-5 text-blue-500 animate-bounce" />, label: 'Uploading file...' },
    processing: { color: 'blue', icon: <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />, label: `Processing ${processedRows} of ${totalRows} rows...` },
    complete: { color: 'green', icon: <CheckCircle className="h-5 w-5 text-green-500" />, label: `Import complete: ${successCount} succeeded, ${failureCount} failed` },
    error: { color: 'red', icon: <AlertTriangle className="h-5 w-5 text-red-500" />, label: 'Import failed' },
  }

  const config = statusConfig[status] || statusConfig.uploading

  return (
    <div className={`bg-${config.color}-50 border border-${config.color}-200 rounded-lg p-4 mb-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {config.icon}
          <span className={`text-sm font-medium text-${config.color}-800`}>{config.label}</span>
        </div>
        {onDismiss && status !== 'processing' && (
          <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {(status === 'processing' || status === 'uploading') && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${status === 'uploading' ? 30 : progressPercent}%` }}
          />
        </div>
      )}

      {/* Complete stats */}
      {status === 'complete' && (
        <div className="flex items-center space-x-4 text-xs mt-2">
          <span className="text-green-700">{successCount} succeeded</span>
          {failureCount > 0 && (
            <span className="text-red-700">{failureCount} failed</span>
          )}
          <span className="text-gray-500">{totalRows} total rows</span>
          {batchId && (
            <span className="text-blue-600 cursor-pointer hover:underline" title="You can roll back this import from the Import History page">
              Batch #{batchId.substring(0, 8)}
            </span>
          )}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowErrors(!showErrors)}
            className="text-xs text-red-600 hover:text-red-800"
          >
            {showErrors ? 'Hide' : 'Show'} {errors.length} error(s)
          </button>
          {showErrors && (
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
              {errors.map((err, i) => (
                <div key={i} className="text-xs text-red-700 bg-red-100 p-1.5 rounded flex items-start">
                  <span className="font-medium mr-1">Row {err.row || i + 1}:</span>
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
