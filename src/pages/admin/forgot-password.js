import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Mail, Shield, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setEmailSent(true)
      toast.success('Password reset instructions sent to your email!')
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Password Reset - TeachGage</title>
        <meta name="description" content="Reset your TeachGage admin password" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Shield className="h-12 w-12 text-teachgage-blue" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Reset Admin Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Enter your admin email to receive reset instructions
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
            {!emailSent ? (
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Admin Email Address
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
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teachgage-blue hover:bg-teachgage-medium-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teachgage-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    {isLoading ? 'Sending Instructions...' : 'Send Reset Instructions'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Check Your Email
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  We've sent password reset instructions to your admin email address.
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue font-medium"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link 
                href="/admin/login" 
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Demo Mode</h4>
                <p className="text-xs text-blue-600 mt-1">
                  This is a demo implementation. In production, this would send actual 
                  password reset emails to admin users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
