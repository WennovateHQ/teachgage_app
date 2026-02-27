'use client';

import { useState, useEffect, useCallback } from 'react';
import { pipelineAPI } from '@/utils/api';
import {
  Zap,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Play,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  History,
  X,
  Save
} from 'lucide-react';

const TRIGGER_TYPES = [
  { value: 'entry', label: 'Stage Entry', desc: 'Fires when an evaluation enters this stage' },
  { value: 'exit', label: 'Stage Exit', desc: 'Fires when an evaluation leaves this stage' },
  { value: 'periodic', label: 'Periodic', desc: 'Fires on a recurring schedule' },
  { value: 'conditional', label: 'Conditional', desc: 'Fires when conditions are met' }
];

const CONDITION_TYPES = [
  { value: 'time_based', label: 'Time Based' },
  { value: 'response_count', label: 'Response Count' },
  { value: 'completion_rate', label: 'Completion Rate' },
  { value: 'date_reached', label: 'Date Reached' },
  { value: 'survey_completed', label: 'Survey Completed' },
  { value: 'score_threshold', label: 'Score Threshold' }
];

const OPERATORS = [
  { value: 'equals', label: '=' },
  { value: 'not_equals', label: '!=' },
  { value: 'greater_than', label: '>' },
  { value: 'less_than', label: '<' },
  { value: 'greater_equal', label: '>=' },
  { value: 'less_equal', label: '<=' }
];

const ACTION_TYPES = [
  { value: 'send_notification', label: 'Send Notification', icon: '🔔' },
  { value: 'send_email', label: 'Send Email', icon: '✉️' },
  { value: 'move_to_stage', label: 'Move to Stage', icon: '➡️' },
  { value: 'create_task', label: 'Create Task', icon: '📋' },
  { value: 'set_reminder', label: 'Set Reminder', icon: '⏰' },
  { value: 'log_event', label: 'Log Event', icon: '📝' }
];

const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export default function TriggerConfigPanel({ pipelineId, stages = [] }) {
  const [triggers, setTriggers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedTrigger, setExpandedTrigger] = useState(null);
  const [historyTrigger, setHistoryTrigger] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadTriggers = useCallback(async () => {
    if (!pipelineId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await pipelineAPI.getTriggersByPipeline(pipelineId);
      const data = response.data?.data || response.data || [];
      setTriggers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load triggers:', err);
      setError('Failed to load triggers');
      setTriggers([]);
    } finally {
      setIsLoading(false);
    }
  }, [pipelineId]);

  useEffect(() => {
    loadTriggers();
  }, [loadTriggers]);

  const handleToggle = async (trigger) => {
    const newEnabled = !trigger.settings?.enabled;
    try {
      await pipelineAPI.toggleTrigger(trigger._id || trigger.id, newEnabled);
      setTriggers(prev =>
        prev.map(t =>
          (t._id || t.id) === (trigger._id || trigger.id)
            ? { ...t, settings: { ...t.settings, enabled: newEnabled } }
            : t
        )
      );
    } catch (err) {
      console.error('Failed to toggle trigger:', err);
      alert('Failed to toggle trigger');
    }
  };

  const handleDelete = async (triggerId) => {
    if (!window.confirm('Are you sure you want to delete this trigger?')) return;
    try {
      await pipelineAPI.deleteTrigger(triggerId);
      setTriggers(prev => prev.filter(t => (t._id || t.id) !== triggerId));
    } catch (err) {
      console.error('Failed to delete trigger:', err);
      alert('Failed to delete trigger');
    }
  };

  const handleExecute = async (triggerId) => {
    try {
      await pipelineAPI.executeTrigger(triggerId, {});
      alert('Trigger queued for execution');
    } catch (err) {
      console.error('Failed to execute trigger:', err);
      alert('Failed to execute trigger');
    }
  };

  const loadHistory = async (triggerId) => {
    setHistoryTrigger(triggerId);
    setHistoryLoading(true);
    try {
      const response = await pipelineAPI.getTriggerHistory(triggerId);
      const data = response.data?.data?.history || response.data?.data || [];
      setHistoryData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTriggerCreated = (newTrigger) => {
    setTriggers(prev => [newTrigger, ...prev]);
    setShowCreateModal(false);
  };

  const getStageName = (stageId) => {
    const stage = stages.find(s => (s._id || s.id) === stageId);
    return stage?.name || 'Unknown Stage';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Automation Triggers
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure automated actions for pipeline stage events
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Trigger
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Triggers List */}
      {triggers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No triggers configured</h3>
          <p className="text-gray-500 mb-4">
            Create triggers to automate actions when evaluations move through pipeline stages.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Trigger
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {triggers.map(trigger => {
            const tid = trigger._id || trigger.id;
            const isExpanded = expandedTrigger === tid;
            const enabled = trigger.settings?.enabled !== false;

            return (
              <div key={tid} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Trigger Row */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <button onClick={() => handleToggle(trigger)} title={enabled ? 'Disable' : 'Enable'}>
                      {enabled ? (
                        <ToggleRight className="h-6 w-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 truncate">{trigger.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          trigger.triggerType === 'entry' ? 'bg-blue-100 text-blue-800' :
                          trigger.triggerType === 'exit' ? 'bg-orange-100 text-orange-800' :
                          trigger.triggerType === 'periodic' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {TRIGGER_TYPES.find(t => t.value === trigger.triggerType)?.label || trigger.triggerType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Stage: {getStageName(trigger.stageId)} &bull; {trigger.actions?.length || 0} action{trigger.actions?.length !== 1 ? 's' : ''} &bull; {trigger.execution?.totalExecutions || 0} executions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-4">
                    {trigger.execution?.lastExecutionStatus && getStatusIcon(trigger.execution.lastExecutionStatus)}

                    <button
                      onClick={() => handleExecute(tid)}
                      className="p-1.5 text-gray-400 hover:text-green-600 rounded"
                      title="Run Now"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => loadHistory(tid)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                      title="History"
                    >
                      <History className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tid)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setExpandedTrigger(isExpanded ? null : tid)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 text-sm space-y-3">
                    {trigger.description && (
                      <p className="text-gray-600">{trigger.description}</p>
                    )}

                    {/* Conditions */}
                    {trigger.conditions?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Conditions ({trigger.conditionLogic || 'AND'})</h4>
                        <div className="space-y-1">
                          {trigger.conditions.map((cond, i) => (
                            <div key={i} className="flex items-center space-x-2 text-gray-600">
                              <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">{cond.type}</span>
                              <span>{OPERATORS.find(o => o.value === cond.operator)?.label || cond.operator}</span>
                              <span className="font-medium">{String(cond.value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {trigger.actions?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Actions</h4>
                        <div className="space-y-1">
                          {trigger.actions.map((action, i) => {
                            const at = ACTION_TYPES.find(a => a.value === action.type);
                            return (
                              <div key={i} className="flex items-center space-x-2 text-gray-600">
                                <span>{at?.icon || '⚡'}</span>
                                <span>{at?.label || action.type}</span>
                                {action.delay > 0 && (
                                  <span className="text-xs text-gray-400">(delay: {action.delay}m)</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Settings */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {trigger.settings?.frequency && trigger.settings.frequency !== 'once' && (
                        <span>Frequency: {trigger.settings.frequency}</span>
                      )}
                      {trigger.execution?.lastExecuted && (
                        <span>Last run: {new Date(trigger.execution.lastExecuted).toLocaleString()}</span>
                      )}
                      {trigger.execution?.nextScheduledExecution && (
                        <span>Next run: {new Date(trigger.execution.nextScheduledExecution).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Trigger Modal */}
      {showCreateModal && (
        <CreateTriggerModal
          pipelineId={pipelineId}
          stages={stages}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleTriggerCreated}
        />
      )}

      {/* History Modal */}
      {historyTrigger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Execution History</h3>
              <button onClick={() => setHistoryTrigger(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teachgage-blue"></div>
                </div>
              ) : historyData.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No execution history yet.</p>
              ) : (
                <div className="space-y-2">
                  {historyData.map((exec, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(exec.status)}
                        <span className="capitalize font-medium">{exec.status}</span>
                      </div>
                      <div className="text-right text-gray-500">
                        <div>{new Date(exec.executedAt).toLocaleString()}</div>
                        {exec.executionTime && <div className="text-xs">{exec.executionTime}ms</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Create Trigger Modal ─── */
function CreateTriggerModal({ pipelineId, stages, onClose, onCreated }) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    triggerType: 'entry',
    stageId: stages[0]?._id || stages[0]?.id || '',
    conditionLogic: 'AND',
    conditions: [],
    actions: [{ type: 'send_notification', parameters: { title: '', message: '' }, delay: 0 }],
    frequency: 'once'
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  // Conditions helpers
  const addCondition = () => {
    updateForm('conditions', [...form.conditions, { type: 'response_count', operator: 'greater_than', value: '' }]);
  };
  const removeCondition = (i) => {
    updateForm('conditions', form.conditions.filter((_, idx) => idx !== i));
  };
  const updateCondition = (i, field, value) => {
    updateForm('conditions', form.conditions.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  };

  // Actions helpers
  const addAction = () => {
    updateForm('actions', [...form.actions, { type: 'send_notification', parameters: { title: '', message: '' }, delay: 0 }]);
  };
  const removeAction = (i) => {
    if (form.actions.length <= 1) return;
    updateForm('actions', form.actions.filter((_, idx) => idx !== i));
  };
  const updateAction = (i, field, value) => {
    updateForm('actions', form.actions.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  };
  const updateActionParam = (i, param, value) => {
    updateForm('actions', form.actions.map((a, idx) =>
      idx === i ? { ...a, parameters: { ...a.parameters, [param]: value } } : a
    ));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Trigger name is required');
    if (!form.stageId) return alert('Please select a stage');
    if (form.actions.length === 0) return alert('At least one action is required');

    setIsSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        pipelineId,
        stageId: form.stageId,
        triggerType: form.triggerType,
        conditionLogic: form.conditionLogic,
        conditions: form.conditions.filter(c => c.value !== ''),
        actions: form.actions,
        settings: {
          enabled: true,
          frequency: form.frequency
        }
      };
      const response = await pipelineAPI.createTrigger(payload);
      const newTrigger = response.data?.data || response.data;
      onCreated(newTrigger);
    } catch (err) {
      console.error('Failed to create trigger:', err);
      alert(err.response?.data?.message || 'Failed to create trigger');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-teachgage-blue" />
            Create Trigger
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                placeholder="e.g., Send reminder when entering review stage"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                placeholder="Optional description..."
              />
            </div>
          </div>

          {/* Trigger Type & Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type *</label>
              <select
                value={form.triggerType}
                onChange={(e) => updateForm('triggerType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              >
                {TRIGGER_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {TRIGGER_TYPES.find(t => t.value === form.triggerType)?.desc}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage *</label>
              <select
                value={form.stageId}
                onChange={(e) => updateForm('stageId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              >
                {stages.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Frequency (for periodic) */}
          {form.triggerType === 'periodic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => updateForm('frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
              >
                {FREQUENCY_OPTIONS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Conditions</label>
              <div className="flex items-center space-x-2">
                {form.conditions.length > 1 && (
                  <select
                    value={form.conditionLogic}
                    onChange={(e) => updateForm('conditionLogic', e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="AND">Match ALL</option>
                    <option value="OR">Match ANY</option>
                  </select>
                )}
                <button
                  type="button"
                  onClick={addCondition}
                  className="text-xs text-teachgage-blue hover:underline flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Condition
                </button>
              </div>
            </div>
            {form.conditions.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No conditions — trigger will fire on every event.</p>
            ) : (
              <div className="space-y-2">
                {form.conditions.map((cond, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <select
                      value={cond.type}
                      onChange={(e) => updateCondition(i, 'type', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                      {CONDITION_TYPES.map(ct => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                      ))}
                    </select>
                    <select
                      value={cond.operator}
                      onChange={(e) => updateCondition(i, 'operator', e.target.value)}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-center"
                    >
                      {OPERATORS.map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={cond.value}
                      onChange={(e) => updateCondition(i, 'value', e.target.value)}
                      className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm"
                      placeholder="Value"
                    />
                    <button onClick={() => removeCondition(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Actions *</label>
              <button
                type="button"
                onClick={addAction}
                className="text-xs text-teachgage-blue hover:underline flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Action
              </button>
            </div>
            <div className="space-y-3">
              {form.actions.map((action, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <select
                      value={action.type}
                      onChange={(e) => updateAction(i, 'type', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm mr-2"
                    >
                      {ACTION_TYPES.map(at => (
                        <option key={at.value} value={at.value}>{at.icon} {at.label}</option>
                      ))}
                    </select>
                    {form.actions.length > 1 && (
                      <button onClick={() => removeAction(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Action Parameters based on type */}
                  {(action.type === 'send_notification' || action.type === 'send_email') && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={action.parameters?.title || ''}
                        onChange={(e) => updateActionParam(i, 'title', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder={action.type === 'send_email' ? 'Email subject...' : 'Notification title...'}
                      />
                      <input
                        type="text"
                        value={action.parameters?.message || ''}
                        onChange={(e) => updateActionParam(i, 'message', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Message body... (use {{variable}} for dynamic values)"
                      />
                    </div>
                  )}

                  {action.type === 'move_to_stage' && (
                    <select
                      value={action.parameters?.targetStageId || ''}
                      onChange={(e) => updateActionParam(i, 'targetStageId', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select target stage...</option>
                      {stages.map(s => (
                        <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                      ))}
                    </select>
                  )}

                  {action.type === 'set_reminder' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={action.parameters?.message || ''}
                        onChange={(e) => updateActionParam(i, 'message', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Reminder message..."
                      />
                    </div>
                  )}

                  {action.type === 'create_task' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={action.parameters?.title || ''}
                        onChange={(e) => updateActionParam(i, 'title', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Task title..."
                      />
                      <input
                        type="text"
                        value={action.parameters?.description || ''}
                        onChange={(e) => updateActionParam(i, 'description', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Task description..."
                      />
                    </div>
                  )}

                  {action.type === 'log_event' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={action.parameters?.eventType || ''}
                        onChange={(e) => updateActionParam(i, 'eventType', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Event type..."
                      />
                      <input
                        type="text"
                        value={action.parameters?.message || ''}
                        onChange={(e) => updateActionParam(i, 'message', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Log message..."
                      />
                    </div>
                  )}

                  {/* Delay */}
                  <div className="mt-2 flex items-center space-x-2">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <label className="text-xs text-gray-500">Delay (min):</label>
                    <input
                      type="number"
                      min="0"
                      value={action.delay || 0}
                      onChange={(e) => updateAction(i, 'delay', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teachgage-blue rounded-lg hover:bg-teachgage-medium-blue disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Creating...' : 'Create Trigger'}
          </button>
        </div>
      </div>
    </div>
  );
}
