import { useState, useRef } from 'react'
import { 
  Mail, 
  Upload, 
  Users, 
  Send, 
  X, 
  Plus, 
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react'

export default function EmailDistribution({ surveyId, surveyTitle, onClose, onSent }) {
  const [activeTab, setActiveTab] = useState('manual')
  const [emails, setEmails] = useState([''])
  const [csvFile, setCsvFile] = useState(null)
  const [csvEmails, setCsvEmails] = useState([])
  const [subject, setSubject] = useState(`Invitation to participate in: ${surveyTitle}`)
  const [message, setMessage] = useState(`You have been invited to participate in a survey: "${surveyTitle}". Please click the link below to get started.`)
  const [isSending, setIsSending] = useState(false)
  const [sendResults, setSendResults] = useState(null)
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const addEmailField = () => {
    setEmails([...emails, ''])
  }

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index)
      setEmails(newEmails)
    }
  }

  const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setErrors(['Please select a CSV file'])
      return
    }

    setCsvFile(file)
    setErrors([])

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length === 0) {
          setErrors(['CSV file is empty'])
          return
        }

        // Try to detect if first line is header
        const firstLine = lines[0].toLowerCase()
        const hasEmailHeader = firstLine.includes('email') || firstLine.includes('mail')
        
        const emailLines = hasEmailHeader ? lines.slice(1) : lines
        const extractedEmails = []

        emailLines.forEach((line, index) => {
          const columns = line.split(',').map(col => col.trim().replace(/"/g, ''))
          
          // Find email in the row (look for @ symbol)
          const email = columns.find(col => col.includes('@'))
          
          if (email && isValidEmail(email)) {
            extractedEmails.push(email)
          } else if (email) {
            setErrors(prev => [...prev, `Row ${index + (hasEmailHeader ? 2 : 1)}: Invalid email format "${email}"`])
          }
        })

        if (extractedEmails.length === 0) {
          setErrors(['No valid email addresses found in CSV file'])
          return
        }

        setCsvEmails(extractedEmails)
        setErrors([])
      } catch (error) {
        setErrors(['Error reading CSV file. Please check the format.'])
      }
    }
    reader.readAsText(file)
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateEmails = (emailList) => {
    const validEmails = []
    const invalidEmails = []

    emailList.forEach(email => {
      const trimmedEmail = email.trim()
      if (trimmedEmail) {
        if (isValidEmail(trimmedEmail)) {
          validEmails.push(trimmedEmail)
        } else {
          invalidEmails.push(trimmedEmail)
        }
      }
    })

    return { validEmails, invalidEmails }
  }

  const handleSend = async () => {
    setIsSending(true)
    setErrors([])

    try {
      let emailsToSend = []
      
      if (activeTab === 'manual') {
        emailsToSend = emails.filter(email => email.trim())
      } else {
        emailsToSend = csvEmails
      }

      const { validEmails, invalidEmails } = validateEmails(emailsToSend)

      if (validEmails.length === 0) {
        setErrors(['No valid email addresses to send to'])
        setIsSending(false)
        return
      }

      if (invalidEmails.length > 0) {
        setErrors([`Invalid email addresses: ${invalidEmails.join(', ')}`])
      }

      // Send invitations via API
      const response = await fetch('/api/surveys/send-invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId,
          emails: validEmails,
          subject,
          message,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSendResults({
          success: true,
          sent: result.sent || validEmails.length,
          failed: result.failed || 0,
          total: validEmails.length,
          errors: result.errors || []
        })
        
        if (onSent) {
          onSent(result)
        }
      } else {
        setErrors([result.message || 'Failed to send invitations'])
      }
    } catch (error) {
      console.error('Send invitations error:', error)
      setErrors(['Network error. Please try again.'])
    } finally {
      setIsSending(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = 'email,name\nexample1@email.com,John Doe\nexample2@email.com,Jane Smith'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'email_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (sendResults?.success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-teachgage-green rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-teachgage-blue mb-2">
              Invitations Sent!
            </h2>
            
            <div className="bg-teachgage-cream p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-teachgage-green">
                    {sendResults.sent}
                  </div>
                  <div className="text-sm text-teachgage-navy">Successfully Sent</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teachgage-orange">
                    {sendResults.failed}
                  </div>
                  <div className="text-sm text-teachgage-navy">Failed</div>
                </div>
              </div>
            </div>

            {sendResults.errors?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Some invitations failed:
                </h3>
                <ul className="text-sm text-red-700 space-y-1">
                  {sendResults.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {sendResults.errors.length > 5 && (
                    <li>• ... and {sendResults.errors.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
            >
              Done
            </button>
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
              <h2 className="text-2xl font-bold">Send Survey Invitations</h2>
              <p className="text-teachgage-cream opacity-90">Distribute your survey via email</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isSending}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Survey Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-teachgage-blue">Survey: {surveyTitle}</h3>
            <p className="text-sm text-teachgage-navy mt-1">
              Recipients will receive an email with a unique link to access this survey.
            </p>
          </div>

          {/* Email Input Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'manual'
                    ? 'bg-white text-teachgage-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Manual Entry
              </button>
              <button
                onClick={() => setActiveTab('csv')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'csv'
                    ? 'bg-white text-teachgage-blue shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                CSV Upload
              </button>
            </div>
          </div>

          {/* Manual Email Entry */}
          {activeTab === 'manual' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-teachgage-blue mb-3">Email Addresses</h3>
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                    />
                    {emails.length > 1 && (
                      <button
                        onClick={() => removeEmailField(index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addEmailField}
                  className="flex items-center text-teachgage-blue hover:text-teachgage-orange transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Another Email
                </button>
              </div>
            </div>
          )}

          {/* CSV Upload */}
          {activeTab === 'csv' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-teachgage-blue">Upload Email List</h3>
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-teachgage-blue hover:text-teachgage-orange flex items-center"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download Template
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                
                {!csvFile ? (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-teachgage-navy mb-2">Upload a CSV file with email addresses</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                ) : (
                  <div>
                    <FileText className="w-8 h-8 text-teachgage-blue mx-auto mb-2" />
                    <p className="text-teachgage-blue font-medium">{csvFile.name}</p>
                    <p className="text-sm text-teachgage-navy mt-1">
                      {csvEmails.length} email addresses found
                    </p>
                    <button
                      onClick={() => {
                        setCsvFile(null)
                        setCsvEmails([])
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove File
                    </button>
                  </div>
                )}
              </div>

              {csvEmails.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-teachgage-blue mb-2">Preview:</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {csvEmails.slice(0, 10).map((email, index) => (
                      <div key={index} className="text-sm text-teachgage-navy">
                        {email}
                      </div>
                    ))}
                    {csvEmails.length > 10 && (
                      <div className="text-sm text-gray-500 mt-1">
                        ... and {csvEmails.length - 10} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teachgage-blue mb-3">Email Content</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teachgage-blue focus:border-transparent"
                  placeholder="Enter your message"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A unique survey link will be automatically added to each email.
                </p>
              </div>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-sm font-semibold text-red-800">Errors</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Send Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || (!emails.some(e => e.trim()) && csvEmails.length === 0)}
              className="px-6 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitations
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
