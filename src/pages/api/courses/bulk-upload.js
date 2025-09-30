import formidable from 'formidable'
import fs from 'fs'
import csv from 'csv-parser'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = formidable({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    const [fields, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    if (!file.originalFilename?.endsWith('.csv')) {
      return res.status(400).json({ message: 'File must be a CSV' })
    }

    const results = []
    const errors = []
    let rowIndex = 0

    const requiredColumns = ['title', 'code', 'description', 'start_date', 'end_date', 'max_students']

    // Parse CSV
    const parsePromise = new Promise((resolve, reject) => {
      fs.createReadStream(file.filepath)
        .pipe(csv())
        .on('data', (row) => {
          rowIndex++
          
          // Validate required columns
          const missingColumns = requiredColumns.filter(col => !row[col] || row[col].trim() === '')
          if (missingColumns.length > 0) {
            errors.push(`Row ${rowIndex}: Missing required columns: ${missingColumns.join(', ')}`)
            return
          }

          // Validate dates
          const startDate = new Date(row.start_date)
          const endDate = new Date(row.end_date)
          
          if (isNaN(startDate.getTime())) {
            errors.push(`Row ${rowIndex}: Invalid start_date format`)
            return
          }
          
          if (isNaN(endDate.getTime())) {
            errors.push(`Row ${rowIndex}: Invalid end_date format`)
            return
          }
          
          if (startDate >= endDate) {
            errors.push(`Row ${rowIndex}: start_date must be before end_date`)
            return
          }

          // Validate max_students
          const maxStudents = parseInt(row.max_students)
          if (isNaN(maxStudents) || maxStudents < 1) {
            errors.push(`Row ${rowIndex}: max_students must be a positive number`)
            return
          }

          // Process row data
          const courseData = {
            title: row.title.trim(),
            code: row.code.trim(),
            description: row.description.trim(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            maxStudents: maxStudents,
            objectives: row.objectives?.trim() || '',
            prerequisites: row.prerequisites?.trim() || '',
            allowSelfEnrollment: row.allow_self_enrollment === 'true',
            sendNotifications: row.send_notifications !== 'false' // default true
          }

          results.push(courseData)
        })
        .on('end', () => {
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
    })

    await parsePromise

    // Clean up uploaded file
    fs.unlinkSync(file.filepath)

    if (results.length === 0 && errors.length === 0) {
      return res.status(400).json({ message: 'CSV file appears to be empty' })
    }

    // Simulate backend API calls for each course
    let created = 0
    let updated = 0
    const processingErrors = []

    for (let i = 0; i < results.length; i++) {
      const courseData = results[i]
      
      try {
        // In a real implementation, this would call the backend API
        // For now, we'll simulate the API call
        const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/courses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
          },
          body: JSON.stringify(courseData),
        })

        if (backendResponse.ok) {
          const result = await backendResponse.json()
          if (result.created) {
            created++
          } else {
            updated++
          }
        } else {
          const errorData = await backendResponse.json()
          processingErrors.push(`Course "${courseData.title}": ${errorData.message || 'Failed to create'}`)
        }
      } catch (error) {
        console.error('Error processing course:', error)
        processingErrors.push(`Course "${courseData.title}": Network error`)
      }
    }

    // Combine validation and processing errors
    const allErrors = [...errors, ...processingErrors]

    res.status(200).json({
      message: 'Upload completed',
      total: results.length,
      created,
      updated,
      errors: allErrors,
      success: true
    })

  } catch (error) {
    console.error('CSV upload error:', error)
    res.status(500).json({ 
      message: 'Failed to process CSV file',
      error: error.message 
    })
  }
}
