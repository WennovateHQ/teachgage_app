import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AnalyticsDashboard from '../../../components/analytics/AnalyticsDashboard'

export default function OrganizationAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Organization Analytics - TeachGage Admin</title>
        <meta name="description" content="Analytics dashboard for organization administrators" />
      </Head>

      <AdminLayout title="Organization Analytics">
        <AnalyticsDashboard organizationId="current-org" />
      </AdminLayout>
    </>
  )
}
