import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Breadcrumb from '../../../components/common/Breadcrumb'
import TrialCountdown from '../../../components/common/TrialCountdown'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  CreditCard, 
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Shield,
  Users,
  Zap
} from 'lucide-react'

export default function OrganizationBillingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, trialStatus } = useAuth()
  const [billingInfo, setBillingInfo] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/signin')
      return
    }

    if (user && user.role !== 'organization_admin') {
      router.push('/dashboard')
      return
    }

    if (user) {
      loadBillingData()
    }
  }, [user, isAuthenticated, isLoading, router])

  const loadBillingData = () => {
    try {
      // Mock billing data
      const mockBillingInfo = {
        subscription: {
          plan: 'Organization Pro',
          status: trialStatus?.expired ? 'expired' : trialStatus?.isTrialActive ? 'trial' : 'active',
          amount: 99,
          interval: 'month',
          nextBillingDate: '2025-10-27',
          trialEndsAt: trialStatus?.trialEndDate
        },
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2027
        },
        billingAddress: {
          name: user?.organization?.name || 'Tech University',
          address: '123 University Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'United States'
        }
      }

      const mockInvoices = [
        {
          id: 'inv_001',
          number: 'TG-2025-001',
          date: '2025-09-01',
          amount: 99,
          status: 'paid',
          description: 'Organization Pro - September 2025'
        },
        {
          id: 'inv_002',
          number: 'TG-2025-002',
          date: '2025-08-01',
          amount: 99,
          status: 'paid',
          description: 'Organization Pro - August 2025'
        },
        {
          id: 'inv_003',
          number: 'TG-2025-003',
          date: '2025-07-01',
          amount: 99,
          status: 'paid',
          description: 'Organization Pro - July 2025'
        }
      ]

      setBillingInfo(mockBillingInfo)
      setInvoices(mockInvoices)
    } catch (error) {
      console.error('Failed to load billing data:', error)
    } finally {
      setIsPageLoading(false)
    }
  }

  const handleUpgrade = () => {
    alert('Upgrade functionality would redirect to payment processing')
  }

  const handleUpdatePayment = () => {
    alert('Update payment method functionality would be implemented here')
  }

  const handleDownloadInvoice = (invoiceId) => {
    alert(`Download invoice ${invoiceId} functionality would be implemented here`)
  }

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? This will downgrade your account at the end of the current billing period.')) {
      alert('Cancel subscription functionality would be implemented here')
    }
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Organization', href: '/dashboard/organization' },
    { label: 'Billing', href: '/dashboard/organization/billing' }
  ]

  if (isLoading || isPageLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
        </div>
      </DashboardLayout>
    )
  }

  const isTrialActive = trialStatus?.isTrialActive && !trialStatus?.expired
  const isTrialExpired = trialStatus?.expired

  return (
    <>
      <Head>
        <title>Organization Billing - TeachGage</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teachgage-blue">Billing & Subscription</h1>
              <p className="text-teachgage-navy">
                Manage your organization's subscription and billing information
              </p>
            </div>
          </div>

          {/* Trial Status */}
          {(isTrialActive || isTrialExpired) && (
            <TrialCountdown 
              showUpgrade={true}
              onUpgrade={handleUpgrade}
            />
          )}

          {/* Current Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-teachgage-blue">Current Plan</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-teachgage-blue rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-teachgage-blue">
                      {billingInfo?.subscription.plan}
                    </h3>
                    <p className="text-teachgage-navy">
                      ${billingInfo?.subscription.amount}/{billingInfo?.subscription.interval}
                    </p>
                    <div className="flex items-center mt-1">
                      {billingInfo?.subscription.status === 'trial' && (
                        <>
                          <Clock className="w-4 h-4 text-teachgage-orange mr-1" />
                          <span className="text-sm text-teachgage-orange">Trial Active</span>
                        </>
                      )}
                      {billingInfo?.subscription.status === 'active' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-teachgage-green mr-1" />
                          <span className="text-sm text-teachgage-green">Active</span>
                        </>
                      )}
                      {billingInfo?.subscription.status === 'expired' && (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                          <span className="text-sm text-red-500">Expired</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {!isTrialExpired && (
                    <div className="text-sm text-gray-600 mb-2">
                      Next billing: {new Date(billingInfo?.subscription.nextBillingDate).toLocaleDateString()}
                    </div>
                  )}
                  <div className="space-x-2">
                    {isTrialActive && (
                      <button
                        onClick={handleUpgrade}
                        className="px-4 py-2 bg-teachgage-blue text-white rounded-lg hover:bg-teachgage-medium-blue transition-colors"
                      >
                        Upgrade Now
                      </button>
                    )}
                    {billingInfo?.subscription.status === 'active' && (
                      <button
                        onClick={handleCancelSubscription}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-teachgage-green mr-3" />
                  <span className="text-sm text-teachgage-navy">Unlimited instructors</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-teachgage-green mr-3" />
                  <span className="text-sm text-teachgage-navy">Advanced analytics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-teachgage-green mr-3" />
                  <span className="text-sm text-teachgage-navy">Priority support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-teachgage-green mr-3" />
                  <span className="text-sm text-teachgage-navy">Department management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-teachgage-green mr-3" />
                  <span className="text-sm text-teachgage-navy">Bulk operations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-teachgage-green mr-3" />
                  <span className="text-sm text-teachgage-navy">Custom branding</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {!isTrialActive && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-teachgage-blue">Payment Method</h2>
                  <button
                    onClick={handleUpdatePayment}
                    className="px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-teachgage-blue">
                      {billingInfo?.paymentMethod.brand} ending in {billingInfo?.paymentMethod.last4}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Expires {billingInfo?.paymentMethod.expiryMonth}/{billingInfo?.paymentMethod.expiryYear}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-teachgage-blue">Billing Address</h2>
                <button className="px-4 py-2 border border-teachgage-blue text-teachgage-blue rounded-lg hover:bg-teachgage-blue hover:text-white transition-colors">
                  Edit
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                <div className="font-medium text-teachgage-blue">
                  {billingInfo?.billingAddress.name}
                </div>
                <div className="text-teachgage-navy">
                  {billingInfo?.billingAddress.address}
                </div>
                <div className="text-teachgage-navy">
                  {billingInfo?.billingAddress.city}, {billingInfo?.billingAddress.state} {billingInfo?.billingAddress.zipCode}
                </div>
                <div className="text-teachgage-navy">
                  {billingInfo?.billingAddress.country}
                </div>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-teachgage-blue">Billing History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
                        <p className="text-gray-500">
                          Your billing history will appear here once you have active subscriptions.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-teachgage-blue">
                              {invoice.number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {invoice.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-teachgage-navy">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-teachgage-navy">
                          ${invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {invoice.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {invoice.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            className="text-teachgage-blue hover:text-teachgage-orange transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Usage Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-teachgage-blue">Current Usage</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-teachgage-blue rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-teachgage-blue">12</div>
                  <div className="text-sm text-gray-600">Active Instructors</div>
                  <div className="text-xs text-gray-500 mt-1">Unlimited plan</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-teachgage-green rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-teachgage-green">48</div>
                  <div className="text-sm text-gray-600">Active Surveys</div>
                  <div className="text-xs text-gray-500 mt-1">Unlimited plan</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-teachgage-orange rounded-lg flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-teachgage-orange">1,247</div>
                  <div className="text-sm text-gray-600">Responses This Month</div>
                  <div className="text-xs text-gray-500 mt-1">Unlimited plan</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-teachgage-navy rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-teachgage-navy">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                  <div className="text-xs text-gray-500 mt-1">SLA guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
