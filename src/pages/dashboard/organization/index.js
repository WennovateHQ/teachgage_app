import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../../contexts/AuthContext'

export default function OrganizationIndexPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/signin')
      return
    }

    if (user && user.role !== 'organization_admin') {
      router.push('/dashboard')
      return
    }

    // Redirect to main dashboard for organization admins
    router.push('/dashboard')
  }, [user, isAuthenticated, isLoading, router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
    </div>
  )
}
