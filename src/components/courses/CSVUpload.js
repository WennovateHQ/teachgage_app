import { useState, useRef } from 'react'
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  Eye
} from 'lucide-react'

export default function CSVUpload({ onUpload, onClose }) {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

  const requiredColumns = [
    'title',
    'code', 
    'description',
    'start_date',
    'end_date',
    'max_students'
  ]

  const optionalColumns = [
    'objectives',
    'prerequisites',
    'allow_self_enrollment',
    'send_notifications'
  ]

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setErrors(['Please select a CSV file'])
        return
      }
      
      setFile(selectedFile)
      setErrors([])
      parseCSVPreview(selectedFile)
    }
  }

  const parseCSVPreview = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          setErrors(['CSV file must contain at least a header row and one data row'])
          return
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        const missingRequired = requiredColumns.filter(col => !headers.includes(col))
        
        if (missingRequired.length > 0) {
          setErrors([`Missing required columns: ${missingRequired.join(', ')}`])
          return
        }

        // Parse first few rows for preview
        const previewRows = lines.slice(1, 4).map(line => {
          const values = line.split(',').map(v => v.trim())
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })

        setPreviewData({
          headers,
          rows: previewRows,
          totalRows: lines.length - 1
        })
        setErrors([])
      } catch (error) {
        setErrors(['Error parsing CSV file. Please check the format.'])
      }
    }
    reader.readAsText(file)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setErrors([])

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/courses/bulk-upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResults({
          success: true,
          created: result.created || 0,
          updated: result.updated || 0,
          errors: result.errors || [],
          total: result.total || 0
        })
        
        if (onUpload) {
          onUpload(result)
        }
      } else {
        setErrors([result.message || 'Upload failed'])
      }
    } catch (error) {
      console.error('Upload error:', error)
      setErrors(['Network error. Please try again.'])
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const headers = [...requiredColumns, ...optionalColumns]
    const sampleData = [
      'Introduction to Psychology,PSY101,Basic psychology course covering fundamental concepts,2024-01-15,2024-05-15,30,Learn basic psychological principles,None,true,true',
      'Advanced Mathematics,MATH301,Advanced calculus and linear algebra,2024-02-01,2024-06-01,25,Master advanced mathematical concepts,MATH201,false,true'
    ]
    
    const csvContent = [headers.join(','), ...sampleData].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'course_upload_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetUpload = () => {
    setFile(null)
    setPreviewData(null)
    setUploadResults(null)
    setErrors([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (uploadResults?.success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-teachgage-green rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-teachgage-blue mb-2">
              Upload Successful!
            </h2>
            
            <div className="bg-teachgage-cream p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-teachgage-blue">
                    {uploadResults.created}
                  </div>
                  <div className="text-sm text-teachgage-navy">Courses Created</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teachgage-orange">
                    {uploadResults.updated}
                  </div>
                  <div className="text-sm text-teachgage-navy">Courses Updated</div>
                </div>
              </div>
            </div>

            {uploadResults.errors?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Some rows had issues:
                </h3>
                <ul className="text-sm text-red-700 space-y-1">
                  {uploadResults.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {uploadResults.errors.length > 5 && (
                    <li>• ... and {uploadResults.errors.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={resetUpload}
                className="flex-1 px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors"
              >
                Upload Another File
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teachgage-blue to-teachgage-medium-blue text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Bulk Course Upload</h2>
              <p className="text-teachgage-cream opacity-90">Upload multiple courses from a CSV file</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isUploading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-teachgage-blue mb-2">
              How to Upload Courses
            </h3>
            <ol className="text-sm text-teachgage-navy space-y-1 list-decimal list-inside">
              <li>Download the CSV template below</li>
              <li>Fill in your course data (required columns must be completed)</li>
              <li>Save the file as CSV format</li>
              <li>Upload the file using the button below</li>
            </ol>
          </div>

          {/* Template Download */}
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 bg-teachgage-green text-white rounded-lg hover:bg-teachgage-green/90 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </button>
          </div>

          {/* Column Requirements */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-teachgage-blue mb-2">Required Columns</h4>
              <ul className="text-sm text-teachgage-navy space-y-1">
                {requiredColumns.map(col => (
                  <li key={col} className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    {col}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-teachgage-blue mb-2">Optional Columns</h4>
              <ul className="text-sm text-teachgage-navy space-y-1">
                {optionalColumns.map(col => (
                  <li key={col} className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    {col}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!file ? (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-teachgage-blue mb-2">
                  Select CSV File
                </h3>
                <p className="text-teachgage-navy mb-4">
                  Choose a CSV file with your course data
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div>
                <FileText className="w-12 h-12 text-teachgage-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-teachgage-blue mb-2">
                  {file.name}
                </h3>
                <p className="text-teachgage-navy mb-4">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors mr-2"
                >
                  Change File
                </button>
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-sm font-semibold text-red-800">Validation Errors</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {previewData && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-teachgage-blue">
                  Preview ({previewData.totalRows} rows total)
                </h3>
                <div className="flex items-center text-sm text-teachgage-navy">
                  <Eye className="w-4 h-4 mr-1" />
                  Showing first 3 rows
                </div>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {previewData.headers.map(header => (
                        <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.rows.map((row, index) => (
                      <tr key={index}>
                        {previewData.headers.map(header => (
                          <td key={header} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {row[header] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || errors.length > 0 || isUploading}
              className="px-6 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Courses
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
