import { useState } from 'react'
import { Download, FileText, Image, Table } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function ExportControls({ onExport, stats = {}, trends = [] }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const exportOptions = [
    {
      id: 'pdf-report',
      name: 'PDF Report',
      icon: FileText,
      description: 'Complete analytics report',
      format: 'pdf',
      type: 'report'
    },
    {
      id: 'csv-data',
      name: 'CSV Data',
      icon: Table,
      description: 'Raw data export',
      format: 'csv',
      type: 'data'
    },
    {
      id: 'png-charts',
      name: 'PNG Charts',
      icon: Image,
      description: 'Chart images',
      format: 'png',
      type: 'charts'
    }
  ]

  const handleExport = async (option) => {
    setIsExporting(true)
    setShowDropdown(false)

    try {
      if (option.format === 'pdf') {
        await generatePDFReport()
      } else if (option.format === 'csv') {
        await generateCSVExport()
      } else if (option.format === 'png') {
        await generateChartImages()
      }
      
      // Call parent callback
      if (onExport) {
        await onExport(option.format, option.type)
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const generatePDFReport = async () => {
    const pdf = new jsPDF()
    
    // Add title
    pdf.setFontSize(20)
    pdf.text('TeachGage Analytics Report', 20, 30)
    
    // Add date
    pdf.setFontSize(12)
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
    
    // Add summary section
    pdf.setFontSize(16)
    pdf.text('Executive Summary', 20, 65)
    
    pdf.setFontSize(10)
    const summaryText = [
      `• Total Responses: ${stats.totalResponses || 0}`,
      `• Average Rating: ${(stats.averageRating || 0).toFixed(1)}/5.0`,
      `• Response Rate: ${stats.responseRate || 0}%`,
      `• Active Forms: ${stats.activeForms || 0}`
    ]
    
    summaryText.forEach((text, index) => {
      pdf.text(text, 25, 80 + (index * 8))
    })

    // Try to capture charts if available
    try {
      const chartElements = document.querySelectorAll('[data-chart]')
      let yPosition = 130

      for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
        const element = chartElements[i]
        const canvas = await html2canvas(element, {
          scale: 1,
          useCORS: true,
          allowTaint: true
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 170
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        if (yPosition + imgHeight > 280) {
          pdf.addPage()
          yPosition = 20
        }
        
        pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight)
        yPosition += imgHeight + 20
      }
    } catch (error) {
      console.warn('Could not capture charts for PDF:', error)
    }

    // Save the PDF
    pdf.save('teachgage-analytics-report.pdf')
  }

  const generateCSVExport = async () => {
    // Build CSV from real data
    const csvData = [['Date', 'Responses', 'Average Rating', 'Response Rate']]
    
    if (trends.length > 0) {
      trends.forEach(item => {
        csvData.push([
          item.date || '',
          String(item.responses || item.count || 0),
          String(item.averageRating || item.rating || ''),
          item.responseRate ? `${item.responseRate}%` : ''
        ])
      })
    } else {
      // If no trend data, export summary stats
      csvData.push([
        new Date().toISOString().split('T')[0],
        String(stats.totalResponses || 0),
        String((stats.averageRating || 0).toFixed(1)),
        stats.responseRate ? `${stats.responseRate}%` : '0%'
      ])
    }

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'teachgage-analytics-data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const generateChartImages = async () => {
    const chartElements = document.querySelectorAll('[data-chart]')
    
    for (let i = 0; i < chartElements.length; i++) {
      try {
        const element = chartElements[i]
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        })
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `teachgage-chart-${i + 1}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 'image/png')
      } catch (error) {
        console.error(`Error capturing chart ${i + 1}:`, error)
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
              Export Options
            </div>
            {exportOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleExport(option)}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                >
                  <IconComponent className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {option.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          
          <div className="border-t border-gray-200 p-3">
            <div className="text-xs text-gray-500">
              💡 PDF reports include charts and summaries. CSV exports contain raw data for further analysis.
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
