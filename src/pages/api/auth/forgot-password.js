export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  try {
    // Call backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      res.status(200).json({ 
        message: 'Password reset email sent successfully',
        success: true 
      })
    } else {
      res.status(backendResponse.status).json({ 
        message: data.message || 'Failed to send reset email' 
      })
    }
  } catch (error) {
    console.error('Forgot password API error:', error)
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    })
  }
}
