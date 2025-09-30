'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, CreditCard, Building, GraduationCap } from 'lucide-react';

export default function SignupForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountTier: 'basic', // basic, professional, organizational
    organizationName: '',
    organizationType: 'academic', // academic, corporate
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear auth error
    if (error) {
      clearError();
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.accountTier === 'organizational' && !formData.organizationName.trim()) {
      errors.organizationName = 'Organization name is required';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the auth context
      console.error('Registration failed:', err);
    }
  };

  // Account tier options
  const accountTiers = [
    {
      value: 'basic',
      title: 'Basic',
      subtitle: 'Perfect for individual instructors',
      price: 'Free',
      description: 'Get started with essential feedback tools',
      features: [
        '1 course maximum',
        'Basic survey templates',
        'Standard analytics',
        'Email support'
      ],
      icon: User,
      popular: false
    },
    {
      value: 'professional',
      title: 'Professional',
      subtitle: 'For serious educators',
      price: '$29/month',
      description: 'Advanced features for professional growth',
      features: [
        'Unlimited courses',
        'Advanced templates',
        'Detailed analytics',
        'Priority support',
        'Custom branding'
      ],
      icon: GraduationCap,
      popular: true
    },
    {
      value: 'organizational',
      title: 'Organization',
      subtitle: 'For schools and institutions',
      price: '$99/month',
      description: 'Complete solution for educational organizations',
      features: [
        'Multi-instructor access',
        'Department management',
        'Advanced reporting',
        'Bulk operations',
        'Dedicated support'
      ],
      icon: Building,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teachgage-blue">Create Your TeachGage Account</h2>
          <p className="mt-2 text-teachgage-navy">Choose the plan that fits your needs</p>
        </div>

        {/* Account Tier Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {accountTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.value}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                  formData.accountTier === tier.value
                    ? 'border-teachgage-blue bg-white shadow-lg'
                    : 'border-gray-200 bg-white hover:border-teachgage-medium-blue hover:shadow-md'
                } ${tier.popular ? 'ring-2 ring-teachgage-orange ring-opacity-50' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, accountTier: tier.value }))}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-teachgage-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${
                    formData.accountTier === tier.value ? 'text-teachgage-blue' : 'text-teachgage-navy'
                  }`} />
                  <h3 className="text-lg font-semibold text-teachgage-blue">{tier.title}</h3>
                  <p className="text-sm text-teachgage-navy mb-2">{tier.subtitle}</p>
                  <p className="text-2xl font-bold text-teachgage-orange mb-2">{tier.price}</p>
                  <p className="text-sm text-teachgage-navy mb-4">{tier.description}</p>
                  
                  <ul className="text-sm text-teachgage-navy space-y-1">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-teachgage-green rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <input
                  type="radio"
                  name="accountTier"
                  value={tier.value}
                  checked={formData.accountTier === tier.value}
                  onChange={handleChange}
                  className="absolute top-4 right-4"
                />
              </div>
            );
          })}
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-teachgage-navy mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teachgage-navy w-4 h-4" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                      validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-teachgage-navy mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teachgage-navy w-4 h-4" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                      validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-teachgage-navy mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teachgage-navy w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-teachgage-navy mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teachgage-navy w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                      validationErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-teachgage-navy mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teachgage-navy w-4 h-4" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                      validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Organization Details (if organizational account) */}
            {formData.accountTier === 'organizational' && (
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-teachgage-blue mb-4">Organization Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organization Name */}
                    <div>
                      <label htmlFor="organizationName" className="block text-sm font-medium text-teachgage-navy mb-1">
                        Organization Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teachgage-navy w-4 h-4" />
                        <input
                          type="text"
                          id="organizationName"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                            validationErrors.organizationName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter organization name"
                        />
                      </div>
                      {validationErrors.organizationName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.organizationName}</p>
                      )}
                    </div>

                    {/* Organization Type */}
                    <div>
                      <label htmlFor="organizationType" className="block text-sm font-medium text-teachgage-navy mb-1">
                        Organization Type
                      </label>
                      <select
                        id="organizationType"
                        name="organizationType"
                        value={formData.organizationType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue"
                      >
                        <option value="academic">Academic Institution</option>
                        <option value="corporate">Corporate Training</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-teachgage-navy">
                I agree to the{' '}
                <a href="/terms" className="text-teachgage-blue hover:text-teachgage-medium-blue">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-teachgage-blue hover:text-teachgage-medium-blue">
                  Privacy Policy
                </a>
              </label>
            </div>
            {validationErrors.agreeToTerms && (
              <p className="text-sm text-red-600">{validationErrors.agreeToTerms}</p>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teachgage-blue hover:bg-teachgage-medium-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teachgage-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-teachgage-navy">
                Already have an account?{' '}
                <a href="/auth/signin" className="text-teachgage-blue hover:text-teachgage-medium-blue font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
              