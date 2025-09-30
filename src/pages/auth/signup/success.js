import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  CheckCircle,
  Mail,
  Calendar,
  Users,
  ArrowRight,
  Building2,
  User
} from 'lucide-react'

export default function SignupSuccessPage() {
  const router = useRouter()
  const { type, email } = router.query

  const isOrganization = type === 'organization'

  return (
    <>
      <Head>
        <title>Account Created Successfully - TeachGage</title>
        <meta name="description" content="Your TeachGage account has been created successfully" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-teachgage-green rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-teachgage-blue">
              {isOrganization ? 'Organization Account Created!' : 'Account Created Successfully!'}
            </h1>
            <p className="mt-2 text-sm text-teachgage-navy">
              Welcome to TeachGage! Your account has been set up and is ready to use.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
            {/* Email Verification Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-teachgage-blue mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-teachgage-blue mb-2">
                    Verify Your Email Address
                  </h3>
                  <p className="text-sm text-teachgage-navy mb-3">
                    We've sent a verification email to <strong>{email}</strong>. 
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                  <p className="text-xs text-gray-600">
                    Don't see the email? Check your spam folder or contact support if you need help.
                  </p>
                </div>
              </div>
            </div>

            {/* Trial Information (for organization accounts) */}
            {isOrganization && (
              <div className="bg-teachgage-cream border border-teachgage-orange rounded-lg p-6">
                <div className="flex items-start">
                  <Calendar className="w-6 h-6 text-teachgage-orange mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-teachgage-blue mb-2">
                      30-Day Free Trial Started
                    </h3>
                    <p className="text-sm text-teachgage-navy mb-3">
                      Your organization trial has begun! You have full access to all TeachGage features 
                      for the next 30 days.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-teachgage-green mr-2" />
                        <span className="text-sm text-teachgage-navy">Unlimited surveys</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-teachgage-green mr-2" />
                        <span className="text-sm text-teachgage-navy">Advanced analytics</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-teachgage-green mr-2" />
                        <span className="text-sm text-teachgage-navy">User management</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-teachgage-green mr-2" />
                        <span className="text-sm text-teachgage-navy">Priority support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div>
              <h3 className="text-lg font-medium text-teachgage-blue mb-4">
                What's Next?
              </h3>
              <div className="space-y-4">
                {isOrganization ? (
                  <>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                        1
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-teachgage-navy">Verify Your Email</h4>
                        <p className="text-sm text-gray-600">Click the verification link in your email to activate your account</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                        2
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-teachgage-navy">Set Up Your Organization</h4>
                        <p className="text-sm text-gray-600">Complete your organization profile and add departments</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                        3
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-teachgage-navy">Invite Team Members</h4>
                        <p className="text-sm text-gray-600">Add instructors and staff to your organization</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                        4
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-teachgage-navy">Create Your First Survey</h4>
                        <p className="text-sm text-gray-600">Start collecting feedback with our survey builder</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                        1
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-teachgage-navy">Verify Your Email</h4>
                        <p className="text-sm text-gray-600">Click the verification link in your email to activate your account</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                        2
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-teachgage-navy">Complete Your Profile</h4>
                        <p className="text-sm text-gray-600">Add your personal information and preferences</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-teachgage-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                        3
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-teachgage-navy">Create Your First Course</h4>
                        <p className="text-sm text-gray-600">Set up your course and start collecting feedback</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/auth/signin" className="flex-1">
                <button className="w-full flex justify-center items-center py-3 px-4 bg-teachgage-blue text-white rounded-md hover:bg-teachgage-medium-blue transition-colors">
                  {isOrganization ? <Building2 className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  Sign In to Your Account
                </button>
              </Link>
              
              <Link href="/support" className="flex-1">
                <button className="w-full flex justify-center items-center py-3 px-4 border border-teachgage-blue text-teachgage-blue rounded-md hover:bg-teachgage-blue hover:text-white transition-colors">
                  <Users className="w-4 h-4 mr-2" />
                  Get Help & Support
                </button>
              </Link>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                Need help getting started? Contact our support team at{' '}
                <a href="mailto:support@teachgage.com" className="text-teachgage-blue hover:text-teachgage-orange">
                  support@teachgage.com
                </a>
                {isOrganization && (
                  <span>
                    {' '}or schedule a free onboarding session to maximize your trial experience.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
