export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { token } = req.body

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' })
  }

  try {
    // Call backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      res.status(200).json({ 
        message: 'Email verified successfully',
        success: true 
      })
    } else {
      res.status(backendResponse.status).json({ 
        message: data.message || 'Email verification failed' 
      })
    }
  } catch (error) {
    console.error('Email verification API error:', error)
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    })
  }
}
