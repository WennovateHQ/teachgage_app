export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {
    organizationName,
    organizationType,
    organizationSize,
    address,
    city,
    state,
    zipCode,
    firstName,
    lastName,
    email,
    jobTitle,
    password,
    agreeToTerms
  } = req.body

  // Basic validation
  if (!organizationName || !firstName || !lastName || !email || !password || !agreeToTerms) {
    return res.status(400).json({ message: 'All required fields must be filled' })
  }

  if (!agreeToTerms) {
    return res.status(400).json({ message: 'You must agree to the terms and conditions' })
  }

  try {
    // Call backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        account_tier: 'Organization',
        role: 'organization_admin',
        organization: {
          name: organizationName,
          type: organizationType,
          size: organizationSize,
          address,
          city,
          state,
          zip_code: zipCode
        },
        profile: {
          job_title: jobTitle
        },
        trial_start_date: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      res.status(201).json({ 
        message: 'Organization account created successfully',
        success: true,
        user: data.user,
        organization: data.organization
      })
    } else {
      res.status(backendResponse.status).json({ 
        message: data.message || 'Failed to create organization account' 
      })
    }
  } catch (error) {
    console.error('Organization signup API error:', error)
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    })
  }
}
