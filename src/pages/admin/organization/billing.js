import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '../../../components/layout/AdminLayout'
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
  Users,
  Zap,
  Edit
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminOrganizationBillingPage() {
  const [billingInfo, setBillingInfo] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBillingData()
  }, [])

  const loadBillingData = () => {
    try {
      // Mock billing data
      const mockBillingInfo = {
        subscription: {
          plan: 'Enterprise',
          status: 'active',
          price: 299,
          billingCycle: 'monthly',
          nextBillingDate: '2024-02-15',
          trialEndsAt: null,
          features: [
            'Unlimited users',
            'Advanced analytics',
            'Priority support',
            'Custom branding',
            'API access',
            'SSO integration'
          ]
        },
        usage: {
          users: 245,
          maxUsers: 1000,
          courses: 89,
          surveys: 156,
          storage: 2.4,
          maxStorage: 100
        },
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025
        },
        billingAddress: {
          name: 'Stanford University',
          line1: '450 Serra Mall',
          city: 'Stanford',
          state: 'CA',
          postalCode: '94305',
          country: 'US'
        }
      }

      const mockInvoices = [
        {
          id: 'inv_001',
          number: 'INV-2024-001',
          date: '2024-01-15',
          amount: 299,
          status: 'paid',
          description: 'Enterprise Plan - January 2024',
          downloadUrl: '#'
        },
        {
          id: 'inv_002',
          number: 'INV-2023-012',
          date: '2023-12-15',
          amount: 299,
          status: 'paid',
          description: 'Enterprise Plan - December 2023',
          downloadUrl: '#'
        },
        {
          id: 'inv_003',
          number: 'INV-2023-011',
          date: '2023-11-15',
          amount: 299,
          status: 'paid',
          description: 'Enterprise Plan - November 2023',
          downloadUrl: '#'
        }
      ]

      setBillingInfo(mockBillingInfo)
      setInvoices(mockInvoices)
    } catch (error) {
      console.error('Failed to load billing data:', error)
      toast.error('Failed to load billing information')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      trial: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      expired: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock }
    }
    return badges[status] || badges.active
  }

  const getInvoiceStatusBadge = (status) => {
    const badges = {
      paid: { bg: 'bg-green-100', text: 'text-green-800' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      failed: { bg: 'bg-red-100', text: 'text-red-800' }
    }
    return badges[status] || badges.pending
  }

  const handleUpdatePaymentMethod = () => {
    toast('Update payment method functionality coming soon')
  }

  const handleUpdateBillingAddress = () => {
    toast('Update billing address functionality coming soon')
  }

  const handleDownloadInvoice = (invoiceId) => {
    toast('Invoice download functionality coming soon')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Organization Billing">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teachgage-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Organization Billing - TeachGage Admin</title>
        <meta name="description" content="Manage organization billing and subscription" />
      </Head>

      <AdminLayout title="Organization Billing">
        <div className="space-y-6">
          {/* Subscription Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Current Subscription</h2>
              <div className="flex items-center space-x-2">
                {(() => {
                  const statusBadge = getStatusBadge(billingInfo?.subscription.status)
                  const StatusIcon = statusBadge.icon
                  return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {billingInfo?.subscription.status}
                    </span>
                  )
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-teachgage-blue to-teachgage-medium-blue rounded-lg text-white">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">{billingInfo?.subscription.plan}</h3>
                <p className="text-2xl font-bold">${billingInfo?.subscription.price}</p>
                <p className="text-sm opacity-90">per {billingInfo?.subscription.billingCycle}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Next billing date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(billingInfo?.subscription.nextBillingDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Users</p>
                  <p className="font-medium text-gray-900">
                    {billingInfo?.usage.users} / {billingInfo?.usage.maxUsers}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-teachgage-blue h-2 rounded-full" 
                      style={{ width: `${(billingInfo?.usage.users / billingInfo?.usage.maxUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Storage used</p>
                  <p className="font-medium text-gray-900">
                    {billingInfo?.usage.storage} GB / {billingInfo?.usage.maxStorage} GB
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(billingInfo?.usage.storage / billingInfo?.usage.maxStorage) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active resources</p>
                  <p className="font-medium text-gray-900">
                    {billingInfo?.usage.courses} courses, {billingInfo?.usage.surveys} surveys
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {billingInfo?.subscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method & Billing Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                <button
                  onClick={handleUpdatePaymentMethod}
                  className="text-teachgage-blue hover:text-teachgage-medium-blue text-sm font-medium"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Update
                </button>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {billingInfo?.paymentMethod.brand} •••• {billingInfo?.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {billingInfo?.paymentMethod.expiryMonth}/{billingInfo?.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
                <button
                  onClick={handleUpdateBillingAddress}
                  className="text-teachgage-blue hover:text-teachgage-medium-blue text-sm font-medium"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Update
                </button>
              </div>
              
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{billingInfo?.billingAddress.name}</p>
                <p>{billingInfo?.billingAddress.line1}</p>
                <p>
                  {billingInfo?.billingAddress.city}, {billingInfo?.billingAddress.state} {billingInfo?.billingAddress.postalCode}
                </p>
                <p>{billingInfo?.billingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invoice History</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => {
                    const statusBadge = getInvoiceStatusBadge(invoice.status)
                    
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                            <div className="text-sm text-gray-500">{invoice.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            className="text-teachgage-blue hover:text-teachgage-medium-blue"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
