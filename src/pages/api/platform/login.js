// Mock API endpoint for admin platform login
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password, adminType } = req.body

  // Demo admin credentials
  const adminCredentials = {
    'admin@teachgage.com': {
      password: 'admin123',
      user: {
        id: 'admin-001',
        email: 'admin@teachgage.com',
        firstName: 'Platform',
        lastName: 'Admin',
        role: 'platform_admin',
        adminType: 'platform',
        permissions: ['all']
      }
    },
    'orgadmin@teachgage.com': {
      password: 'orgadmin123',
      user: {
        id: 'admin-002',
        email: 'orgadmin@teachgage.com',
        firstName: 'Organization',
        lastName: 'Admin',
        role: 'org_admin',
        adminType: 'organization',
        organizationId: 'org-001',
        permissions: ['manage_organization', 'manage_users', 'view_analytics']
      }
    }
  }

  // Check credentials
  const admin = adminCredentials[email]
  if (!admin || admin.password !== password) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid admin credentials'
      }
    })
  }

  // Generate mock JWT token
  const token = `mock-admin-token-${Date.now()}`
  const refreshToken = `mock-refresh-token-${Date.now()}`

  // Return successful login response
  res.status(200).json({
    success: true,
    data: {
      user: {
        ...admin.user,
        adminType: adminType || admin.user.adminType
      },
      token,
      refreshToken
    }
  })
}
