export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { token } = req.body

  if (!token) {
    return res.status(400).json({ message: 'Token is required' })
  }

  try {
    // Call backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/validate-reset-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      res.status(200).json({ 
        message: 'Token is valid',
        valid: true 
      })
    } else {
      res.status(backendResponse.status).json({ 
        message: data.message || 'Invalid or expired token',
        valid: false 
      })
    }
  } catch (error) {
    console.error('Validate reset token API error:', error)
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.',
      valid: false 
    })
  }
}
