import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, Shield, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [adminType, setAdminType] = useState('platform')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Call admin login API
      const response = await fetch('/api/platform/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          adminType: adminType
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        // Store admin session
        localStorage.setItem('adminToken', result.data.token)
        localStorage.setItem('adminUser', JSON.stringify(result.data.user))
        
        toast.success('Welcome to TeachGage Admin!')
        
        // Redirect based on admin type
        if (adminType === 'platform') {
          router.push('/admin/platform/dashboard')
        } else {
          router.push('/admin/organization/dashboard')
        }
      } else {
        toast.error(result.error?.message || 'Invalid admin credentials')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      if (error.message.includes('Unexpected token')) {
        toast.error('Server error. Please try again.')
      } else {
        toast.error('Network error. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login - TeachGage</title>
        <meta name="description" content="Admin access to TeachGage platform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Shield className="h-12 w-12 text-teachgage-blue" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            TeachGage Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Secure administrative access
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
            {/* Admin Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Admin Access Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdminType('platform')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                    adminType === 'platform'
                      ? 'border-teachgage-blue bg-teachgage-blue text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Platform
                </button>
                <button
                  type="button"
                  onClick={() => setAdminType('organization')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                    adminType === 'organization'
                      ? 'border-teachgage-blue bg-teachgage-blue text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Organization
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teachgage-blue focus:border-teachgage-blue sm:text-sm"
                    placeholder="admin@teachgage.com"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Admin Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teachgage-blue focus:border-teachgage-blue sm:text-sm"
                    placeholder="••••••••"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember this device
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/admin/forgot-password" className="font-medium text-teachgage-blue hover:text-teachgage-medium-blue">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teachgage-blue hover:bg-teachgage-medium-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teachgage-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  {isLoading ? 'Authenticating...' : 'Access Admin Portal'}
                </button>
              </div>
            </form>

            {/* Demo Admin Credentials */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h4 className="text-sm font-medium text-red-800 mb-2">🔐 Demo Admin Access</h4>
              <p className="text-xs text-red-600 mb-2">Demo credentials for testing:</p>
              <div className="text-xs text-red-700 font-mono space-y-1">
                <div>Platform Admin: <span className="font-semibold">admin@teachgage.com</span></div>
                <div>Password: <span className="font-semibold">admin123</span></div>
                <div>Org Admin: <span className="font-semibold">orgadmin@teachgage.com</span></div>
                <div>Password: <span className="font-semibold">orgadmin123</span></div>
              </div>
              <button
                type="button"
                onClick={() => {
                  document.querySelector('input[type="email"]').value = 'admin@teachgage.com'
                  document.querySelector('input[type="password"]').value = 'admin123'
                }}
                className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded transition-colors"
              >
                Fill Platform Admin Credentials
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to main site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
