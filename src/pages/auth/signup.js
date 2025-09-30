import Head from 'next/head'
import SignupForm from '../../components/auth/SignupForm'

export default function SignUp() {

  return (
    <>
      <Head>
        <title>Sign Up - TeachGage</title>
        <meta name="description" content="Create your TeachGage account" />
      </Head>
      <SignupForm />
    </>
  )
}
