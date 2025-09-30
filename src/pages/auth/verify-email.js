import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Mail,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { token, email } = router.query
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  useEffect(() => {
    if (token) {
      verifyEmail()
    } else if (email) {
      // Just showing verification needed page
      setIsVerifying(false)
    }
  }, [token, email])

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
      } else {
        setError(data.message || 'Email verification failed')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const resendVerification = async () => {
    if (!email) {
      setResendMessage('Email address not available. Please request verification from your account settings.')
      return
    }

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendMessage('Verification email sent successfully! Please check your inbox.')
      } else {
        setResendMessage(data.message || 'Failed to resend verification email')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setResendMessage('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (isVerifying) {
    return (
      <>
        <Head>
          <title>Verifying Email - TeachGage</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-teachgage-blue" />
            <p className="mt-2 text-teachgage-navy">Verifying your email...</p>
          </div>
        </div>
      </>
    )
  }

  if (isVerified) {
    return (
      <>
        <Head>
          <title>Email Verified - TeachGage</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-teachgage-green rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
                Email Verified!
              </h2>
              <p className="mt-2 text-sm text-teachgage-navy">
                Your email address has been successfully verified. You can now access all features of your TeachGage account.
              </p>
            </div>

            <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
              <div className="text-center space-y-4">
                <div className="bg-teachgage-cream p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-teachgage-blue mb-2">
                    What's Next?
                  </h3>
                  <ul className="text-sm text-teachgage-navy space-y-2">
                    <li>• Access your dashboard and explore features</li>
                    <li>• Create your first course or survey</li>
                    <li>• Complete your profile setup</li>
                    <li>• Invite students or colleagues</li>
                  </ul>
                </div>

                <Link href="/dashboard">
                  <button className="w-full flex justify-center py-3 px-4 bg-teachgage-blue text-white rounded-md hover:bg-teachgage-medium-blue transition-colors">
                    Go to Dashboard
                  </button>
                </Link>

                <Link href="/auth/signin">
                  <button className="w-full flex justify-center items-center py-2 px-4 border border-teachgage-blue text-teachgage-blue rounded-md hover:bg-teachgage-blue hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Email Verification Failed - TeachGage</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-teachgage-navy">
                {error}
              </p>
            </div>

            <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Common Issues:
                  </h3>
                  <ul className="text-xs text-red-700 space-y-1">
                    <li>• Verification link has expired (links expire after 24 hours)</li>
                    <li>• Link has already been used</li>
                    <li>• Invalid or corrupted verification token</li>
                  </ul>
                </div>

                {resendMessage && (
                  <div className={`p-4 rounded-lg ${
                    resendMessage.includes('successfully') 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-red-50 text-red-800'
                  }`}>
                    <p className="text-sm">{resendMessage}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={resendVerification}
                    disabled={isResending}
                    className="w-full flex justify-center items-center py-2 px-4 bg-teachgage-blue text-white rounded-md hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </button>

                  <Link href="/auth/signin">
                    <button className="w-full flex justify-center items-center py-2 px-4 border border-teachgage-blue text-teachgage-blue rounded-md hover:bg-teachgage-blue hover:text-white transition-colors">
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

  // Show verification needed page (when only email is provided)
  return (
    <>
      <Head>
        <title>Verify Your Email - TeachGage</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-teachgage-blue rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
              Verify Your Email
            </h2>
            <p className="mt-2 text-sm text-teachgage-navy">
              We've sent a verification link to <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="space-y-4">
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 text-teachgage-blue" />
                <h3 className="mt-2 text-lg font-medium text-teachgage-blue">
                  Check Your Email
                </h3>
                <p className="mt-1 text-sm text-teachgage-navy">
                  Click the verification link in your email to activate your account.
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

              {resendMessage && (
                <div className={`p-4 rounded-lg ${
                  resendMessage.includes('successfully') 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  <p className="text-sm">{resendMessage}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="w-full flex justify-center items-center py-2 px-4 bg-teachgage-blue text-white rounded-md hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </button>

                <Link href="/auth/signin">
                  <button className="w-full flex justify-center items-center py-2 px-4 border border-teachgage-blue text-teachgage-blue rounded-md hover:bg-teachgage-blue hover:text-white transition-colors">
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
