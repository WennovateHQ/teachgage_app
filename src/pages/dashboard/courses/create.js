import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import CourseCreationWizard from '../../../components/courses/CourseCreationWizard'

export default function CreateCoursePage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <Head>
        <title>Create Course - TeachGage</title>
        <meta name="description" content="Create a new course" />
      </Head>

      <DashboardLayout title="Create Course">
        <CourseCreationWizard onClose={handleClose} />
      </DashboardLayout>
    </>
  )
}
