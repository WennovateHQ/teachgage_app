import { useState, useRef } from 'react'
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  Eye,
  Users
} from 'lucide-react'
import { courseAPI } from '../../utils/api'

export default function EnrollmentCSVUpload({ courseId, courseName, onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

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
        
        // Must have email column
        if (!headers.includes('email')) {
          setErrors(['CSV must contain an "email" column'])
          return
        }

        // Parse all rows
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim())
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })

        // Validate emails
        const invalidEmails = rows.filter(r => !r.email || !r.email.includes('@'))
        if (invalidEmails.length > 0 && invalidEmails.length === rows.length) {
          setErrors(['No valid email addresses found in the CSV'])
          return
        }

        setPreviewData({
          headers,
          rows: rows.slice(0, 5),
          totalRows: rows.length,
          allRows: rows,
          validCount: rows.filter(r => r.email && r.email.includes('@')).length,
          invalidCount: rows.filter(r => !r.email || !r.email.includes('@')).length
        })
        setErrors([])
      } catch (error) {
        setErrors(['Error parsing CSV file. Please check the format.'])
      }
    }
    reader.readAsText(file)
  }

  const handleUpload = async () => {
    if (!file || !previewData) return

    setIsUploading(true)
    setErrors([])

    try {
      // Build students array from parsed CSV
      const students = previewData.allRows
        .filter(r => r.email && r.email.includes('@'))
        .map(r => ({
          email: r.email.trim().toLowerCase(),
          name: r.name || r.full_name || r.first_name ? `${r.first_name || ''} ${r.last_name || ''}`.trim() : '',
          studentId: r.student_id || r.id || null
        }))

      const response = await courseAPI.batchEnrollStudents(courseId, students)
      const result = response.data?.data || response.data

      setUploadResults({
        success: true,
        enrolled: result.enrolled || 0,
        duplicates: result.duplicates || 0,
        errors: result.errors || [],
        total: result.total || students.length
      })
      
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setErrors([error.response?.data?.message || 'Failed to enroll students. Please try again.'])
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      'email,name,student_id',
      'john.doe@example.com,John Doe,STU001',
      'jane.smith@example.com,Jane Smith,STU002',
      'mike.wilson@example.com,Mike Wilson,STU003'
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'enrollment_template.csv'
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

  // Success state
  if (uploadResults?.success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Complete!</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{uploadResults.enrolled}</div>
                  <div className="text-sm text-gray-600">Enrolled</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{uploadResults.duplicates}</div>
                  <div className="text-sm text-gray-600">Already Enrolled</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{uploadResults.errors?.length || 0}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
            </div>

            {uploadResults.errors?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Issues:</h3>
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
                Upload More
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
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teachgage-blue to-teachgage-medium-blue text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Batch Enroll Participants
              </h2>
              <p className="text-blue-100 mt-1">
                {courseName ? `Course: ${courseName}` : 'Upload a CSV file with participant emails'}
              </p>
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
            <h3 className="text-sm font-semibold text-blue-900 mb-2">How to Enroll Participants</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Download the CSV template below</li>
              <li>Add participant email addresses (required) and optional name/ID</li>
              <li>Upload the file to enroll all participants at once</li>
            </ol>
          </div>

          {/* Template Download */}
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </button>
          </div>

          {/* Column Requirements */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Required Column</h4>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                email
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Optional Columns</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center"><div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>name</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>student_id</li>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Select CSV File</h3>
                <p className="text-gray-600 mb-4">Choose a CSV file with participant email addresses</p>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{file.name}</h3>
                <p className="text-gray-600 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors"
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
                <h3 className="text-lg font-semibold text-gray-800">
                  Preview ({previewData.totalRows} participants)
                </h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">{previewData.validCount} valid</span>
                  {previewData.invalidCount > 0 && (
                    <span className="text-red-600">{previewData.invalidCount} invalid</span>
                  )}
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
              {previewData.totalRows > 5 && (
                <p className="text-xs text-gray-500 mt-1">Showing first 5 of {previewData.totalRows} rows</p>
              )}
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
              disabled={!file || errors.length > 0 || isUploading || !previewData}
              className="px-6 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enrolling...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Enroll {previewData?.validCount || 0} Participants
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
