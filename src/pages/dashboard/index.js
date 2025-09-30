import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import InstructorDashboard from '../../components/dashboard/InstructorDashboard'
import OrganizationDashboard from '../../components/admin/OrganizationDashboard'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router])

  // Navigation handlers for dashboard actions
  const handleCreateCourse = () => {
    router.push('/dashboard/courses/create')
  }

  const handleCreateSurvey = () => {
    router.push('/dashboard/feedback-forms/create')
  }

  // Organization admin navigation handlers
  const handleCreateInstructor = () => {
    router.push('/dashboard/organization/users/create')
  }

  const handleBulkUpload = () => {
    router.push('/dashboard/organization/users?action=bulk-upload')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Determine which dashboard to show based on user role
  const isOrganizationAdmin = user.role === 'organization_admin' || user.accountTier === 'organizational'

  return (
    <>
      <Head>
        <title>Dashboard - TeachGage</title>
        <meta name="description" content="TeachGage Dashboard" />
      </Head>

      <DashboardLayout title="Dashboard">
        {isOrganizationAdmin ? (
          <OrganizationDashboard 
            onCreateInstructor={handleCreateInstructor}
            onBulkUpload={handleBulkUpload}
          />
        ) : (
          <InstructorDashboard 
            onCreateCourse={handleCreateCourse}
            onCreateSurvey={handleCreateSurvey}
          />
        )}
      </DashboardLayout>
    </>
  )
}
