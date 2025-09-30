'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { 
  demoUsers, 
  demoOrganizations, 
  demoDepartments, 
  demoCourses,
  demoAnalytics,
  getTrialDaysRemaining
} from '../../data/demoData';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Building, 
  Plus, 
  Upload, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  FileText
} from 'lucide-react';

export default function OrganizationDashboard({ onCreateInstructor, onBulkUpload }) {
  const { user, trialStatus } = useAuth();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load organization data
  useEffect(() => {
    const loadOrganizationData = () => {
      if (!user?.organizationId) return;

      setIsLoading(true);

      try {
        // Get organization details
        const orgData = demoOrganizations.find(org => org.id === user.organizationId);
        setOrganization(orgData);

        // Get organization instructors
        const orgInstructors = demoUsers.organizationInstructors.filter(
          instructor => instructor.organizationId === user.organizationId
        );
        setInstructors(orgInstructors);

        // Get organization departments
        const orgDepartments = demoDepartments.filter(
          dept => dept.organizationId === user.organizationId
        );
        setDepartments(orgDepartments);

        // Get organization courses
        const orgCourses = demoCourses.filter(
          course => course.organizationId === user.organizationId
        );
        setCourses(orgCourses);

        // Get analytics
        const orgAnalytics = demoAnalytics.organizationDashboard[user.organizationId] || {
          totalInstructors: orgInstructors.length,
          totalCourses: orgCourses.length,
          activeSurveys: 0,
          totalResponses: 0,
          departmentBreakdown: orgDepartments.map(dept => ({
            departmentId: dept.id,
            name: dept.name,
            instructors: orgInstructors.filter(i => i.departmentId === dept.id).length,
            courses: orgCourses.filter(c => c.departmentId === dept.id).length,
            surveys: 0
          }))
        };
        setAnalytics(orgAnalytics);
      } catch (error) {
        console.error('Failed to load organization data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadOrganizationData();
    }
  }, [user]);

  // Filter instructors
  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = searchTerm === '' || 
      instructor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || instructor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle instructor actions
  const handleEditInstructor = (instructor) => {
    router.push(`/dashboard/organization/users/${instructor.id}/edit`);
  };

  const handleDeleteInstructor = (instructor) => {
    if (window.confirm(`Are you sure you want to remove ${instructor.firstName} ${instructor.lastName} from the organization?`)) {
      // Remove instructor from state
      setInstructors(prev => prev.filter(i => i.id !== instructor.id));
      alert(`${instructor.firstName} ${instructor.lastName} has been removed from the organization`);
    }
  };

  const handleResendWelcome = (instructor) => {
    alert(`Welcome email sent to ${instructor.email}`);
  };

  // Handle navigation
  const handleViewAnalytics = () => {
    router.push('/dashboard/analytics');
  };

  const handleViewAllUsers = () => {
    router.push('/dashboard/organization/users');
  };

  const handleViewDepartments = () => {
    router.push('/dashboard/organization/departments');
  };

  const handleExportReports = () => {
    // Generate CSV export
    const csvContent = [
      ['Name', 'Email', 'Department', 'Status', 'Last Login'].join(','),
      ...instructors.map(instructor => [
        `"${instructor.firstName} ${instructor.lastName}"`,
        instructor.email,
        departments.find(d => d.id === instructor.departmentId)?.name || 'Unassigned',
        instructor.status,
        instructor.lastLogin ? new Date(instructor.lastLogin).toLocaleDateString() : 'Never'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organization-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('Organization report exported successfully');
  };

  // Get quick stats
  const getQuickStats = () => {
    return [
      {
        title: 'Total Instructors',
        value: instructors.length,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        change: '+2 this month'
      },
      {
        title: 'Active Courses',
        value: courses.filter(c => c.status === 'active').length,
        icon: BookOpen,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        change: '+5 this month'
      },
      {
        title: 'Departments',
        value: departments.length,
        icon: Building,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        change: null
      },
      {
        title: 'Total Responses',
        value: analytics?.totalResponses || 0,
        icon: BarChart3,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        change: null
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const quickStats = getQuickStats();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {organization?.name} Dashboard
            </h1>
            <p className="text-indigo-100 mt-1">
              Organization Administrator • {instructors.length} instructors
            </p>
          </div>
          
          {/* Trial Status */}
          {trialStatus && (trialStatus.isTrialActive || trialStatus.expired) && (
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <div className="text-sm">
                  {trialStatus.expired ? (
                    <span className="text-red-200">Trial Expired</span>
                  ) : (
                    <>
                      <span>Trial: {trialStatus.daysRemaining} days left</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className="text-xs text-green-600">{stat.change}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructor Management */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Instructor Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={onBulkUpload}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </button>
                  <button
                    onClick={onCreateInstructor}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Instructor
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search instructors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending_password_change">Pending Setup</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {filteredInstructors.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all' ? 'No instructors found' : 'No instructors yet'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Add your first instructor to get started.'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={onCreateInstructor}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Instructor
                      </button>
                      <button
                        onClick={onBulkUpload}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Upload
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInstructors.map((instructor) => (
                    <div key={instructor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {instructor.firstName} {instructor.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{instructor.email}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>Department: {departments.find(d => d.id === instructor.departmentId)?.name || 'Unassigned'}</span>
                            {instructor.lastLogin && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Last login: {new Date(instructor.lastLogin).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          instructor.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : instructor.status === 'pending_password_change'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {instructor.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {instructor.status === 'pending_password_change' && <Clock className="w-3 h-3 mr-1" />}
                          {instructor.status === 'active' ? 'Active' : 
                           instructor.status === 'pending_password_change' ? 'Pending Setup' : 'Inactive'}
                        </span>
                        
                        <div className="flex space-x-1">
                          {instructor.status === 'pending_password_change' && (
                            <button
                              onClick={() => handleResendWelcome(instructor)}
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                              title="Resend Welcome Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleEditInstructor(instructor)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Edit Instructor"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteInstructor(instructor)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove Instructor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* View All Users Link */}
              {filteredInstructors.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleViewAllUsers}
                    className="w-full text-center py-2 text-sm text-teachgage-blue hover:text-teachgage-orange transition-colors"
                  >
                    View All Users ({instructors.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Department Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Department Breakdown</h3>
                <button
                  onClick={handleViewDepartments}
                  className="text-xs text-teachgage-blue hover:text-teachgage-orange transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {departments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No departments configured
                </p>
              ) : (
                <div className="space-y-3">
                  {analytics?.departmentBreakdown.map((dept) => (
                    <div key={dept.departmentId} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500">
                          {dept.instructors} instructors • {dept.courses} courses
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{dept.surveys}</p>
                        <p className="text-xs text-gray-500">surveys</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Recent Activity</h3>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <UserPlus className="w-3 h-3 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      Lisa Martinez was added to Mathematics department
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <BookOpen className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      David Chen created "Software Engineering Principles"
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Quick Actions</h3>
            </div>
            
            <div className="p-4 space-y-2">
              <button
                onClick={onCreateInstructor}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <UserPlus className="w-4 h-4 mr-3" />
                Add New Instructor
              </button>
              
              <button
                onClick={onBulkUpload}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <Upload className="w-4 h-4 mr-3" />
                Bulk Upload Instructors
              </button>
              
              <button 
                onClick={handleViewAnalytics}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                View Organization Analytics
              </button>
              
              <button 
                onClick={handleExportReports}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <FileText className="w-4 h-4 mr-3" />
                Export Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
