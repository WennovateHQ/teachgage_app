'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if password change is required
      if (result.mustChangePassword) {
        router.push('/auth/change-password');
        return;
      }

      // Redirect based on user role and account type
      const { user } = result;
      
      if (user.role === 'organization_admin') {
        router.push('/admin/organization/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  };

  // Demo account suggestions
  const demoAccounts = [
    {
      type: 'Basic Instructor',
      email: 'john.basic@example.com',
      description: 'Free account with basic features'
    },
    {
      type: 'Professional Instructor (Trial)',
      email: 'sarah.wilson@university.edu',
      description: 'Professional account with 15 days remaining'
    },
    {
      type: 'Professional Instructor (Paid)',
      email: 'mike.johnson@college.edu',
      description: 'Professional account with active subscription'
    },
    {
      type: 'Organization Admin',
      email: 'admin@techuniversity.edu',
      description: 'Organization admin with trial active'
    },
    {
      type: 'Organization Instructor',
      email: 'david.chen@techuniversity.edu',
      description: 'Instructor created by organization admin'
    },
    {
      type: 'New Organization Instructor',
      email: 'lisa.martinez@techuniversity.edu',
      description: 'Must change password on first login'
    }
  ];

  // Fill demo account
  const fillDemoAccount = (email) => {
    setFormData({
      email,
      password: email === 'lisa.martinez@techuniversity.edu' ? 'TempPass123!' : 'password123'
    });
    clearError();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-teachgage-blue">Welcome Back</h2>
          <p className="mt-2 text-teachgage-navy">Sign in to your TeachGage account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="/auth/forgot-password" className="text-sm text-teachgage-blue hover:text-teachgage-medium-blue">
                Forgot your password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
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
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-teachgage-navy">
                Don't have an account?{' '}
                <a href="/auth/signup" className="text-teachgage-blue hover:text-teachgage-medium-blue font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-teachgage-blue mb-4">Demo Accounts</h3>
          <p className="text-sm text-teachgage-navy mb-4">
            Try different account types with these demo credentials:
          </p>
          
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => fillDemoAccount(account.email)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-teachgage-blue">{account.type}</h4>
                    <p className="text-xs text-teachgage-navy mt-1">{account.description}</p>
                    <p className="text-xs text-teachgage-blue mt-1">{account.email}</p>
                  </div>
                  <button className="text-xs text-teachgage-orange hover:text-teachgage-blue font-medium">
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-orange-50 border border-teachgage-orange rounded-md">
            <p className="text-xs text-teachgage-navy">
              <strong>Password for all demo accounts:</strong> password123
              <br />
              <strong>Exception:</strong> lisa.martinez@techuniversity.edu uses TempPass123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
