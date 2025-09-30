export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { surveyId, emails, subject, message } = req.body

  if (!surveyId || !emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ message: 'Survey ID and email list are required' })
  }

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' })
  }

  try {
    // Call backend API to send invitations
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/surveys/${surveyId}/invitations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization,
      },
      body: JSON.stringify({
        recipient_emails: emails,
        email_subject: subject,
        email_message: message,
        send_immediately: true
      }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      res.status(200).json({
        message: 'Invitations sent successfully',
        sent: data.sent || emails.length,
        failed: data.failed || 0,
        total: emails.length,
        errors: data.errors || [],
        invitations: data.invitations,
        success: true
      })
    } else {
      res.status(backendResponse.status).json({ 
        message: data.message || 'Failed to send invitations' 
      })
    }
  } catch (error) {
    console.error('Send invitations API error:', error)
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    })
  }
}
