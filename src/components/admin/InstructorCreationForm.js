'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { demoDepartments } from '@/data/demoData';
import { 
  X, 
  User, 
  Mail, 
  Building, 
  UserPlus, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function InstructorCreationForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    professionalTitle: '',
    sendWelcomeEmail: true,
    temporaryPassword: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInstructor, setCreatedInstructor] = useState(null);

  // Get organization departments
  const organizationDepartments = demoDepartments.filter(
    dept => dept.organizationId === user?.organizationId
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Generate temporary password
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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

    if (!formData.departmentId) {
      errors.departmentId = 'Department is required';
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

    setIsSubmitting(true);

    try {
      // Generate temporary password
      const tempPassword = generateTempPassword();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create instructor data
      const instructorData = {
        id: `org-inst-${Date.now()}`,
        ...formData,
        role: 'instructor',
        accountTier: 'professional', // Inherited from organization
        status: 'pending_password_change',
        emailVerified: true,
        organizationId: user.organizationId,
        createdBy: user.id,
        mustChangePassword: true,
        temporaryPassword: tempPassword,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        profilePhoto: null
      };

      console.log('Creating instructor:', instructorData);

      setCreatedInstructor({
        ...instructorData,
        departmentName: organizationDepartments.find(d => d.id === formData.departmentId)?.name
      });
      
      setIsSuccess(true);

      // Call success callback after a delay
      setTimeout(() => {
        onSuccess?.(instructorData);
      }, 3000);

    } catch (error) {
      console.error('Failed to create instructor:', error);
      alert('Failed to create instructor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instructor Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              {createdInstructor?.firstName} {createdInstructor?.lastName} has been added to your organization.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">Account Details:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Email:</strong> {createdInstructor?.email}</p>
                <p><strong>Department:</strong> {createdInstructor?.departmentName}</p>
                <p><strong>Temporary Password:</strong> 
                  <code className="ml-1 bg-gray-200 px-1 rounded text-xs">
                    {createdInstructor?.temporaryPassword}
                  </code>
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 mr-2" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <p>The instructor must change their password on first login. 
                     {formData.sendWelcomeEmail && ' A welcome email has been sent with login instructions.'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserPlus className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Add New Instructor</h2>
                <p className="text-blue-100">Create a new instructor account</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                </div>
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="john.doe@university.edu"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
          </div>

          {/* Organization Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Organization Details</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.departmentId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a department</option>
                    {organizationDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
                {validationErrors.departmentId && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.departmentId}</p>
                )}
              </div>

              <div>
                <label htmlFor="professionalTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Title (Optional)
                </label>
                <input
                  type="text"
                  id="professionalTitle"
                  name="professionalTitle"
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Assistant Professor, Senior Lecturer"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendWelcomeEmail"
                  name="sendWelcomeEmail"
                  checked={formData.sendWelcomeEmail}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendWelcomeEmail" className="ml-2 text-sm text-gray-700">
                  Send welcome email with login instructions
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 mr-2" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Account Details:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Account tier: Professional (inherited from organization)</li>
                      <li>• Temporary password will be generated automatically</li>
                      <li>• Instructor must change password on first login</li>
                      <li>• Account will be active immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Instructor...
                </div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Instructor Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
