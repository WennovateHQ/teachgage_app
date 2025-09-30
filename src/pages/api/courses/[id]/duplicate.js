export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query
  const { title, code, startDate, endDate } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Course ID is required' })
  }

  if (!title || !code) {
    return res.status(400).json({ message: 'Title and course code are required for duplication' })
  }

  try {
    // Get the original course from backend
    const getCourseResponse = await fetch(`${process.env.BACKEND_URL}/api/courses/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json',
      },
    })

    if (!getCourseResponse.ok) {
      const errorData = await getCourseResponse.json()
      return res.status(getCourseResponse.status).json({ 
        message: errorData.message || 'Failed to fetch original course' 
      })
    }

    const originalCourse = await getCourseResponse.json()

    // Create duplicated course data
    const duplicatedCourse = {
      ...originalCourse.course,
      title,
      code,
      startDate: startDate || originalCourse.course.startDate,
      endDate: endDate || originalCourse.course.endDate,
      // Reset enrollment data
      currentStudents: 0,
      enrolledStudents: [],
      // Update metadata
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Remove original ID to create new course
      id: undefined,
      _id: undefined
    }

    // Create the new course via backend API
    const createResponse = await fetch(`${process.env.BACKEND_URL}/api/courses`, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(duplicatedCourse),
    })

    const createData = await createResponse.json()

    if (createResponse.ok) {
      res.status(201).json({
        message: 'Course duplicated successfully',
        originalCourse: originalCourse.course,
        duplicatedCourse: createData.course,
        success: true
      })
    } else {
      res.status(createResponse.status).json({ 
        message: createData.message || 'Failed to create duplicated course' 
      })
    }
  } catch (error) {
    console.error('Course duplication error:', error)
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    })
  }
}
