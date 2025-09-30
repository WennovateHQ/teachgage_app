export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' })
  }

  // Basic password validation
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' })
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return res.status(400).json({ 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    })
  }

  try {
    // Call backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, new_password: password }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      res.status(200).json({ 
        message: 'Password reset successfully',
        success: true 
      })
    } else {
      res.status(backendResponse.status).json({ 
        message: data.message || 'Failed to reset password' 
      })
    }
  } catch (error) {
    console.error('Reset password API error:', error)
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    })
  }
}
