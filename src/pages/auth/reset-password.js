import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token } = router.query
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [tokenValid, setTokenValid] = useState(false)

  // Validate token on component mount
  useEffect(() => {
    if (token) {
      validateToken()
    }
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        setTokenValid(true)
      } else {
        setError('Invalid or expired reset link')
      }
    } catch (error) {
      console.error('Token validation error:', error)
      setError('Failed to validate reset link')
    } finally {
      setIsValidating(false)
    }
  }

  const validatePassword = (password) => {
    const errors = {}
    
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
    
    if (formData.confirmPassword && password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Validate password in real-time
    if (name === 'password') {
      const errors = validatePassword(value)
      setValidationErrors(prev => ({ ...prev, ...errors }))
    }
    
    if (name === 'confirmPassword' && formData.password) {
      if (value !== formData.password) {
        setValidationErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      } else {
        setValidationErrors(prev => ({ ...prev, confirmPassword: '' }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate form
    const errors = validatePassword(formData.password)
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(data.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <>
        <Head>
          <title>Reset Password - TeachGage</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-teachgage-blue" />
            <p className="mt-2 text-teachgage-navy">Validating reset link...</p>
          </div>
        </div>
      </>
    )
  }

  if (!tokenValid) {
    return (
      <>
        <Head>
          <title>Invalid Reset Link - TeachGage</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
                Invalid Reset Link
              </h2>
              <p className="mt-2 text-sm text-teachgage-navy">
                {error || 'This password reset link is invalid or has expired.'}
              </p>
            </div>
            <div className="text-center space-y-3">
              <Link href="/auth/forgot-password">
                <button className="w-full flex justify-center py-2 px-4 bg-teachgage-blue text-white rounded-md hover:bg-teachgage-medium-blue transition-colors">
                  Request New Reset Link
                </button>
              </Link>
              <Link href="/auth/signin">
                <button className="w-full flex justify-center items-center py-2 px-4 border border-teachgage-blue text-teachgage-blue rounded-md hover:bg-teachgage-blue hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Password Reset Successful - TeachGage</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-teachgage-green rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
                Password Reset Successful
              </h2>
              <p className="mt-2 text-sm text-teachgage-navy">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>
            <div className="text-center">
              <Link href="/auth/signin">
                <button className="w-full flex justify-center py-2 px-4 bg-teachgage-blue text-white rounded-md hover:bg-teachgage-medium-blue transition-colors">
                  Sign In Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Reset Password - TeachGage</title>
        <meta name="description" content="Set your new TeachGage password" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-teachgage-navy">
              Enter your new password below
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
                <label htmlFor="password" className="block text-sm font-medium text-teachgage-navy">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${
                      validationErrors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-teachgage-navy rounded-md focus:outline-none focus:ring-teachgage-blue focus:border-teachgage-blue focus:z-10 sm:text-sm`}
                    placeholder="Enter new password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-teachgage-navy">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border ${
                      validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-teachgage-navy rounded-md focus:outline-none focus:ring-teachgage-blue focus:border-teachgage-blue focus:z-10 sm:text-sm`}
                    placeholder="Confirm new password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || Object.keys(validationErrors).some(key => validationErrors[key])}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teachgage-blue hover:bg-teachgage-medium-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teachgage-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
