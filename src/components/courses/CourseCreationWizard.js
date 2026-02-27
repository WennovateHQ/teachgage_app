'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { courseAPI } from '@/utils/api';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Calendar, 
  Users, 
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';

export default function CourseCreationWizard({ onClose }) {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    code: '',
    description: '',
    
    // Schedule & Capacity
    startDate: '',
    endDate: '',
    maxStudents: 30,
    
    // Learning Objectives
    objectives: [''],
    prerequisites: [''],
    
    // Categorization
    category: '',
    tags: [],
    tagInput: '',
    
    // Additional Settings
    status: 'draft',
    allowSelfEnrollment: false,
    sendWelcomeEmail: true
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Course title, code, and description',
      icon: BookOpen
    },
    {
      id: 2,
      title: 'Schedule & Capacity',
      description: 'Dates and student limits',
      icon: Calendar
    },
    {
      id: 3,
      title: 'Learning Objectives',
      description: 'Objectives and prerequisites',
      icon: Target
    },
    {
      id: 4,
      title: 'Review & Create',
      description: 'Review and finalize course',
      icon: CheckCircle
    }
  ];

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

  // Handle array field changes (objectives, prerequisites)
  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Add array item
  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove array item
  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          errors.title = 'Course title is required';
        }
        if (!formData.code.trim()) {
          errors.code = 'Course code is required';
        }
        if (!formData.description.trim()) {
          errors.description = 'Course description is required';
        }
        break;

      case 2:
        if (!formData.startDate) {
          errors.startDate = 'Start date is required';
        }
        if (!formData.endDate) {
          errors.endDate = 'End date is required';
        }
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          errors.endDate = 'End date must be after start date';
        }
        if (formData.maxStudents < 1) {
          errors.maxStudents = 'Maximum students must be at least 1';
        }
        break;

      case 3:
        const validObjectives = formData.objectives.filter(obj => obj.trim());
        if (validObjectives.length === 0) {
          errors.objectives = 'At least one learning objective is required';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up form data
      const courseData = {
        name: formData.title,
        code: formData.code,
        description: formData.description,
        objectives: formData.objectives.filter(obj => obj.trim()),
        prerequisites: formData.prerequisites.filter(req => req.trim()),
        category: formData.category || null,
        tags: formData.tags || [],
        instructorId: user.id || user.userId,
        organizationId: user.organizationId || null,
        departmentId: user.departmentId || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        capacity: formData.maxStudents,
        status: formData.status || 'draft',
        allowSelfAllocation: formData.allowSelfEnrollment
      };

      console.log('Creating course with data:', courseData);

      // Call the actual API
      const response = await courseAPI.createCourse(courseData);
      console.log('Course created successfully:', response.data);

      // Show success and redirect
      alert('Course created successfully!');
      if (onClose) {
        onClose();
      } else {
        router.push('/dashboard/courses');
      }
    } catch (error) {
      console.error('Failed to create course:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to create course. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user can create courses
  if (!hasPermission('create_courses')) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600 mb-4">
              Your {user?.accountTier} account doesn't have permission to create courses.
              Please upgrade to Professional or contact your organization administrator.
            </p>
            <button
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  router.push('/dashboard');
                }
              }}
              className="bg-teachgage-blue text-white px-4 py-2 rounded-md hover:bg-teachgage-medium-blue"
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teachgage-blue to-teachgage-medium-blue text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create New Course</h2>
              <p className="text-teachgage-cream opacity-90">Step {currentStep} of {steps.length}</p>
            </div>
            <button
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  router.push('/dashboard');
                }
              }}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-teachgage-green border-teachgage-green text-white' 
                      : isActive 
                        ? 'bg-teachgage-blue border-teachgage-blue text-white' 
                        : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-teachgage-blue' : isCompleted ? 'text-teachgage-green' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-12 h-0.5 ml-6 ${
                      isCompleted ? 'bg-teachgage-green' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Introduction to Data Science"
                    />
                    {validationErrors.title && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.code ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., CS-101"
                    />
                    {validationErrors.code && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.code}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                      validationErrors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Provide a detailed description of the course content and what students will learn..."
                  />
                  {validationErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue"
                    >
                      <option value="">Select a category...</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="technology">Technology</option>
                      <option value="engineering">Engineering</option>
                      <option value="arts">Arts & Humanities</option>
                      <option value="business">Business & Management</option>
                      <option value="health">Health & Medicine</option>
                      <option value="education">Education</option>
                      <option value="social_sciences">Social Sciences</option>
                      <option value="vocational">Vocational & Technical</option>
                      <option value="coaching">Coaching & Development</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.tagInput}
                        onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && formData.tagInput.trim()) {
                            e.preventDefault();
                            if (!formData.tags.includes(formData.tagInput.trim())) {
                              setFormData(prev => ({
                                ...prev,
                                tags: [...prev.tags, prev.tagInput.trim()],
                                tagInput: ''
                              }));
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue"
                        placeholder="Type & press Enter..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, prev.tagInput.trim()],
                              tagInput: ''
                            }));
                          }
                        }}
                        className="px-3 py-2 bg-teachgage-blue text-white rounded-md hover:bg-teachgage-medium-blue text-sm"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }))}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule & Capacity */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Capacity</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.endDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.endDate}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Students
                    </label>
                    <input
                      type="number"
                      id="maxStudents"
                      name="maxStudents"
                      min="1"
                      max="500"
                      value={formData.maxStudents}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue ${
                        validationErrors.maxStudents ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.maxStudents && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.maxStudents}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Course Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Draft courses are not visible to students</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowSelfEnrollment"
                      name="allowSelfEnrollment"
                      checked={formData.allowSelfEnrollment}
                      onChange={handleChange}
                      className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                    />
                    <label htmlFor="allowSelfEnrollment" className="ml-2 text-sm text-gray-700">
                      Allow student self-enrollment
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendWelcomeEmail"
                      name="sendWelcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onChange={handleChange}
                      className="h-4 w-4 text-teachgage-blue focus:ring-teachgage-blue border-gray-300 rounded"
                    />
                    <label htmlFor="sendWelcomeEmail" className="ml-2 text-sm text-gray-700">
                      Send welcome email to enrolled students
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Learning Objectives */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Objectives *
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    What will students learn and be able to do after completing this course?
                  </p>
                  
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue"
                        placeholder={`Learning objective ${index + 1}`}
                      />
                      {formData.objectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('objectives', index)}
                          className="ml-2 p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('objectives')}
                    className="mt-2 flex items-center text-sm text-teachgage-blue hover:text-teachgage-orange"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Objective
                  </button>
                  
                  {validationErrors.objectives && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.objectives}</p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prerequisites (Optional)
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    What should students know or have completed before taking this course?
                  </p>
                  
                  {formData.prerequisites.map((prerequisite, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={prerequisite}
                        onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teachgage-blue"
                        placeholder={`Prerequisite ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('prerequisites', index)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('prerequisites')}
                    className="mt-2 flex items-center text-sm text-teachgage-blue hover:text-teachgage-orange"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Prerequisite
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Create</h3>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Basic Information</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Title:</strong> {formData.title}</p>
                      <p><strong>Code:</strong> {formData.code}</p>
                      <p><strong>Description:</strong> {formData.description}</p>
                      {formData.category && (
                        <p><strong>Category:</strong> {formData.category.charAt(0).toUpperCase() + formData.category.slice(1).replace('_', ' ')}</p>
                      )}
                      {formData.tags.length > 0 && (
                        <div className="mt-1">
                          <strong>Tags:</strong>{' '}
                          <span className="inline-flex flex-wrap gap-1 ml-1">
                            {formData.tags.map((tag, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tag}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Schedule & Capacity</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Start Date:</strong> {new Date(formData.startDate).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {new Date(formData.endDate).toLocaleDateString()}</p>
                      <p><strong>Maximum Students:</strong> {formData.maxStudents}</p>
                      <p><strong>Status:</strong> {formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1)}</p>
                      <p><strong>Self-enrollment:</strong> {formData.allowSelfEnrollment ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Learning Objectives</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      <ul className="list-disc list-inside space-y-1">
                        {formData.objectives.filter(obj => obj.trim()).map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {formData.prerequisites.filter(req => req.trim()).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900">Prerequisites</h4>
                      <div className="mt-2 text-sm text-gray-600">
                        <ul className="list-disc list-inside space-y-1">
                          {formData.prerequisites.filter(req => req.trim()).map((prerequisite, index) => (
                            <li key={index}>{prerequisite}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teachgage-blue border border-transparent rounded-md hover:bg-teachgage-medium-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-teachgage-green border border-transparent rounded-md hover:bg-teachgage-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Course...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Course
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
