'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, CreditCard, Clock, Star, Check } from 'lucide-react';

export default function SubscriptionOverlay({ onClose }) {
  const { user, trialStatus } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  // Don't show overlay if trial is not expired
  if (!trialStatus?.expired) {
    return null;
  }

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: user?.accountTier === 'organizational' ? 99 : 29,
      period: 'month',
      popular: false,
      savings: null
    },
    {
      id: 'annual',
      name: 'Annual',
      price: user?.accountTier === 'organizational' ? 990 : 290,
      originalPrice: user?.accountTier === 'organizational' ? 1188 : 348,
      period: 'year',
      popular: true,
      savings: user?.accountTier === 'organizational' ? 198 : 58
    }
  ];

  const features = user?.accountTier === 'organizational' 
    ? [
        'Unlimited instructors',
        'Department management',
        'Organization-wide analytics',
        'Bulk operations',
        'Advanced reporting',
        'Priority support',
        'Custom branding',
        'API access'
      ]
    : [
        'Unlimited courses',
        'Advanced survey builder',
        'Detailed analytics',
        'Custom templates',
        'Email notifications',
        'Priority support',
        'Export capabilities',
        'Advanced question types'
      ];

  const handleSubscribe = async (planId) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would integrate with Stripe
      alert(`Subscription to ${planId} plan would be processed here. This is a demo.`);
      
      // Close overlay after successful payment
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContactSales = () => {
    // In a real app, this would open a contact form or redirect to sales
    alert('Contact sales functionality would be implemented here. This is a demo.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teachgage-blue to-teachgage-medium-blue text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Trial Expired</h2>
                <p className="text-teachgage-cream">Continue using TeachGage with a subscription</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isProcessing}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Trial Status */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-semibold text-red-800">
                  Your {user?.accountTier} account trial has expired
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Subscribe now to continue accessing all features and maintain your data.
                </p>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-teachgage-blue mb-4">Choose Your Plan</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-teachgage-blue bg-gray-50'
                      : 'border-gray-200 hover:border-teachgage-medium-blue'
                  } ${plan.popular ? 'ring-2 ring-teachgage-orange ring-opacity-50' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-teachgage-orange text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-teachgage-blue">{plan.name}</h4>
                    
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-teachgage-orange">${plan.price}</span>
                      <span className="text-teachgage-navy">/{plan.period}</span>
                    </div>

                    {plan.originalPrice && (
                      <div className="mt-1">
                        <span className="text-sm text-gray-500 line-through">${plan.originalPrice}/{plan.period}</span>
                        <span className="ml-2 text-sm text-green-600 font-medium">
                          Save ${plan.savings}
                        </span>
                      </div>
                    )}

                    {plan.savings && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        {Math.round((plan.savings / plan.originalPrice) * 100)}% off
                      </div>
                    )}
                  </div>

                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selectedPlan === plan.id}
                    onChange={() => setSelectedPlan(plan.id)}
                    className="absolute top-4 right-4"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-teachgage-blue mb-4">
              {user?.accountTier === 'organizational' ? 'Organization' : 'Professional'} Features
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-4 h-4 text-teachgage-green mr-2 flex-shrink-0" />
                  <span className="text-sm text-teachgage-navy">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleSubscribe(selectedPlan)}
              disabled={isProcessing}
              className="flex-1 bg-teachgage-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-teachgage-medium-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscribe Now
                </>
              )}
            </button>

            <button
              onClick={handleContactSales}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 text-teachgage-navy py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 border border-teachgage-navy"
            >
              Contact Sales
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <div className="w-4 h-4 bg-teachgage-green rounded-full mt-0.5 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold text-teachgage-blue">Secure Payment</h4>
                <p className="text-sm text-teachgage-navy mt-1">
                  Your payment information is encrypted and secure. We use Stripe for payment processing.
                  Cancel anytime with no hidden fees.
                </p>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-4 text-center">
            <p className="text-sm text-teachgage-navy">
              30-day money-back guarantee • Cancel anytime • No setup fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
