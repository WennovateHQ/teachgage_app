import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'

const TOOLTIP_CONTENT = {
  'survey-builder': 'Use the visual survey builder to add questions, configure logic, and preview your survey before publishing.',
  'course-creation': 'Create courses with titles, descriptions, schedules, and learning objectives. You can enroll students individually or via CSV upload.',
  'pipeline-kanban': 'Drag evaluations between stages to track their progress. Automated triggers can move evaluations automatically.',
  'pipeline-triggers': 'Configure time-based, event-based, or milestone-based triggers to automate survey distribution and stage transitions.',
  'analytics-dashboard': 'View aggregated metrics across all your courses and surveys. Use filters to drill down into specific data.',
  'survey-analytics': 'See response rates, rating distributions, per-question analysis, and trends for this specific survey.',
  'ai-insights': 'AI Insights uses Azure OpenAI to analyze your evaluation feedback, identify competency gaps, and generate personalized growth plans.',
  'csv-enrollment': 'Upload a CSV file with email addresses to enroll multiple students at once. Required column: email. Optional: name, student_id.',
  'question-bank': 'Browse and search role-specific questions. Click any question to add it to your survey instantly.',
  'templates': 'Start with a professionally designed template for your role type, then customize it to fit your needs.',
  'export-controls': 'Export your data as PDF for formatted reports or CSV for raw data analysis in spreadsheet tools.',
  'conditional-logic': 'Set show/hide rules so questions appear only when specific conditions are met based on previous answers.',
  'response-anonymity': 'All survey responses are collected without any identifying information. IP addresses and emails are never stored with responses.',
  'trial-info': 'Your trial includes full access to all features. Data is preserved for 30 days after trial expiration.',
  'branding': 'Customize your organization\'s logo, colors, and fonts. Changes apply across all dashboards, reports, and emails.',
  'import-rollback': 'Every batch import is tracked. You can roll back an import within 30 days to undo all changes made by that import.',
  'growth-plan': 'AI-generated growth plans include SMART milestones, CEU tracking, and personalized recommendations based on your evaluation data.',
  'nps-question': 'Net Promoter Score measures recommendation likelihood on a 0-10 scale. Scores 0-6 are detractors, 7-8 passive, 9-10 promoters.',
}

export default function HelpTooltip({ id, children, position = 'top' }) {
  const [isOpen, setIsOpen] = useState(false)
  const content = TOOLTIP_CONTENT[id]

  if (!content) return children || null

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <span className="relative inline-flex items-center">
      {children}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="ml-1.5 text-gray-400 hover:text-teachgage-blue transition-colors focus:outline-none"
        aria-label="Help"
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className={`absolute z-50 ${positionClasses[position]} w-64`}>
          <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
            <div className="flex items-start justify-between">
              <p className="leading-relaxed pr-2">{content}</p>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white flex-shrink-0">
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  )
}

export { TOOLTIP_CONTENT }
