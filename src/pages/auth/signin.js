import Head from 'next/head'
import LoginForm from '../../components/auth/LoginForm'

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign In - TeachGage</title>
        <meta name="description" content="Sign in to your TeachGage account" />
      </Head>
      <LoginForm />
    </>
  )
}
