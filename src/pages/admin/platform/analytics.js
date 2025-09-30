import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
import AnalyticsDashboard from '../../../components/analytics/AnalyticsDashboard'

export default function PlatformAnalyticsPage() {
  return (
    <>
      <Head>
        <title>Platform Analytics - TeachGage Admin</title>
        <meta name="description" content="Comprehensive analytics for the TeachGage platform" />
      </Head>

      <AdminLayout title="Platform Analytics">
        <AnalyticsDashboard />
      </AdminLayout>
    </>
  )
}
