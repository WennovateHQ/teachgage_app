import { useMemo } from 'react'
import { GitBranch, ArrowRight, Eye, EyeOff, SkipForward, AlertTriangle, CheckCircle } from 'lucide-react'

/**
 * Visual map of conditional logic across all survey questions.
 * Shows which questions depend on which, with color-coded connections.
 */
export default function LogicFlowMap({ questions = [], validationResult }) {
  const logicQuestions = useMemo(
    () => questions.filter(q => q.conditionalLogic?.enabled),
    [questions]
  )

  const questionIndex = useMemo(() => {
    const map = new Map()
    questions.forEach((q, i) => map.set(q.id, { ...q, index: i }))
    return map
  }, [questions])

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Add questions to your survey to see the logic flow map.
      </div>
    )
  }

  const actionIcon = (action) => {
    switch (action) {
      case 'show': return <Eye className="h-3.5 w-3.5 text-green-500" />
      case 'hide': return <EyeOff className="h-3.5 w-3.5 text-red-500" />
      case 'skip_to': return <SkipForward className="h-3.5 w-3.5 text-blue-500" />
      default: return <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
    }
  }

  const hasError = (qId) => validationResult?.errors?.some(e => e.questionId === qId)
  const hasWarning = (qId) => validationResult?.warnings?.some(w => w.questionId === qId)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center">
          <GitBranch className="h-4 w-4 mr-1.5 text-teachgage-blue" />
          Logic Flow Map
        </h4>
        {validationResult && (
          <div className="flex items-center space-x-3 text-xs">
            {validationResult.valid ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> No errors
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" /> {validationResult.errors?.length} error(s)
              </span>
            )}
            {(validationResult.warnings?.length || 0) > 0 && (
              <span className="flex items-center text-yellow-600">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" /> {validationResult.warnings.length} warning(s)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Flow nodes */}
      <div className="space-y-1">
        {questions.map((q, i) => {
          const logic = q.conditionalLogic
          const isLogicEnabled = logic?.enabled
          const errored = hasError(q.id)
          const warned = hasWarning(q.id)

          return (
            <div key={q.id} className="flex items-stretch">
              {/* Node */}
              <div className={`flex-1 flex items-center p-2.5 rounded-lg border text-sm transition-colors ${
                errored ? 'border-red-300 bg-red-50' :
                warned ? 'border-yellow-300 bg-yellow-50' :
                isLogicEnabled ? 'border-blue-200 bg-blue-50' :
                'border-gray-200 bg-white'
              }`}>
                {/* Question number */}
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  errored ? 'bg-red-200 text-red-800' :
                  warned ? 'bg-yellow-200 text-yellow-800' :
                  isLogicEnabled ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {i + 1}
                </span>

                {/* Question text */}
                <span className="ml-2 truncate text-gray-800 flex-1">
                  {(q.question || '').substring(0, 60) || `Question ${i + 1}`}
                  {(q.question || '').length > 60 && '...'}
                </span>

                {/* Logic badge */}
                {isLogicEnabled && (
                  <span className="ml-2 flex items-center space-x-1 flex-shrink-0">
                    {actionIcon(logic.action)}
                    <span className="text-[10px] text-gray-500 uppercase">{logic.action}</span>
                  </span>
                )}

                {/* Error/warning icon */}
                {errored && <AlertTriangle className="h-4 w-4 text-red-500 ml-2 flex-shrink-0" />}
                {warned && !errored && <AlertTriangle className="h-4 w-4 text-yellow-500 ml-2 flex-shrink-0" />}
              </div>

              {/* Connection lines to dependencies */}
              {isLogicEnabled && (logic.conditions || []).length > 0 && (
                <div className="flex items-center ml-2">
                  <div className="text-[10px] text-gray-400 space-y-0.5">
                    {(logic.conditions || []).map((cond, ci) => {
                      const source = questionIndex.get(cond.questionId)
                      return (
                        <div key={ci} className="flex items-center whitespace-nowrap">
                          <span className="text-gray-300">←</span>
                          <span className="mx-1">Q{(source?.index ?? '?') + 1}</span>
                          <span className="text-gray-400">{cond.operator}</span>
                          <span className="ml-1 font-medium text-gray-600">{cond.value || '?'}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Validation messages */}
      {validationResult && (validationResult.errors?.length > 0 || validationResult.warnings?.length > 0) && (
        <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
          {(validationResult.errors || []).map((err, i) => (
            <div key={`e${i}`} className="flex items-start text-xs text-red-700 bg-red-50 p-2 rounded">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>{err.message}</span>
            </div>
          ))}
          {(validationResult.warnings || []).map((warn, i) => (
            <div key={`w${i}`} className="flex items-start text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
              <span>{warn.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center space-x-4 text-[10px] text-gray-400 pt-2 border-t border-gray-100">
        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-300 mr-1" /> Has logic</span>
        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-300 mr-1" /> Error</span>
        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-300 mr-1" /> Warning</span>
        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-200 mr-1" /> No logic</span>
      </div>
    </div>
  )
}
