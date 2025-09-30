import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.message || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Check Your Email - TeachGage</title>
          <meta name="description" content="Password reset email sent" />
        </Head>

        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-teachgage-green rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
                Check Your Email
              </h2>
              <p className="mt-2 text-sm text-teachgage-navy">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>

            <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
              <div className="space-y-4">
                <div className="text-center">
                  <Mail className="mx-auto h-12 w-12 text-teachgage-blue" />
                  <h3 className="mt-2 text-lg font-medium text-teachgage-blue">
                    Reset Link Sent
                  </h3>
                  <p className="mt-1 text-sm text-teachgage-navy">
                    Click the link in your email to reset your password. The link will expire in 1 hour.
                  </p>
                </div>

                <div className="bg-teachgage-cream p-4 rounded-lg">
                  <p className="text-sm text-teachgage-navy">
                    <strong>Didn't receive the email?</strong>
                  </p>
                  <ul className="mt-2 text-xs text-teachgage-navy space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Make sure you entered the correct email address</li>
                    <li>• Wait a few minutes for the email to arrive</li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail('')
                    }}
                    className="w-full flex justify-center py-2 px-4 border border-teachgage-blue text-teachgage-blue rounded-md hover:bg-teachgage-blue hover:text-white transition-colors"
                  >
                    Try Different Email
                  </button>
                  
                  <Link href="/auth/signin">
                    <button className="w-full flex justify-center items-center py-2 px-4 bg-teachgage-blue text-white rounded-md hover:bg-teachgage-medium-blue transition-colors">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Forgot Password - TeachGage</title>
        <meta name="description" content="Reset your TeachGage password" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-teachgage-navy">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-teachgage-navy">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-teachgage-navy rounded-md focus:outline-none focus:ring-teachgage-blue focus:border-teachgage-blue focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teachgage-blue hover:bg-teachgage-medium-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teachgage-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link href="/auth/signin">
                  <button
                    type="button"
                    className="inline-flex items-center text-sm text-teachgage-blue hover:text-teachgage-orange"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Sign In
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
