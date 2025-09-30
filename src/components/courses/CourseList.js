'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getDemoCoursesByInstructor, 
  demoCourses, 
  getDemoSurveysByCourse 
} from '@/data/demoData';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Copy, 
  Trash2,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CourseList({ onCreateCourse, onEditCourse }) {
  const { user, hasPermission } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Load courses based on user role
  useEffect(() => {
    const loadCourses = () => {
      setIsLoading(true);
      
      let userCourses = [];
      
      if (user?.role === 'organization_admin') {
        // Organization admin sees all courses in their organization
        userCourses = demoCourses.filter(course => 
          course.organizationId === user.organizationId
        );
      } else {
        // Regular instructors see only their courses
        userCourses = getDemoCoursesByInstructor(user?.id || '');
      }

      // Add survey count to each course
      const coursesWithSurveys = userCourses.map(course => ({
        ...course,
        surveyCount: getDemoSurveysByCourse(course.id).length
      }));

      setCourses(coursesWithSurveys);
      setIsLoading(false);
    };

    if (user) {
      loadCourses();
    }
  }, [user]);

  // Filter and sort courses
  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'startDate' || sortBy === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortBy === 'title' || sortBy === 'code') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCourses(filtered);
  }, [courses, searchTerm, statusFilter, sortBy, sortOrder]);

  // Handle course actions
  const handleDuplicateCourse = (course) => {
    // In a real app, this would call the API
    alert(`Duplicate course functionality would be implemented here for: ${course.title}`);
  };

  const handleDeleteCourse = (course) => {
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      // In a real app, this would call the API
      alert(`Delete course functionality would be implemented here for: ${course.title}`);
    }
  };

  const handleViewAnalytics = (course) => {
    // In a real app, this would navigate to course analytics
    alert(`Course analytics would be shown here for: ${course.title}`);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Active' },
      draft: { color: 'bg-gray-100 text-gray-800', icon: Edit, text: 'Draft' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      archived: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Archived' }
    };

    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  // Get course progress
  const getCourseProgress = (course) => {
    const now = new Date();
    const start = new Date(course.startDate);
    const end = new Date(course.endDate);

    if (now < start) {
      return { status: 'upcoming', percentage: 0 };
    } else if (now > end) {
      return { status: 'completed', percentage: 100 };
    } else {
      const total = end - start;
      const elapsed = now - start;
      const percentage = Math.round((elapsed / total) * 100);
      return { status: 'in-progress', percentage };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <p className="mt-1 text-sm text-gray-500">
            {courses.length} course{courses.length !== 1 ? 's' : ''} total
          </p>
        </div>
        
        {hasPermission('create_courses') && (
          <button
            onClick={onCreateCourse}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Sort */}
          <div className="sm:w-48">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="startDate-desc">Newest First</option>
              <option value="startDate-asc">Oldest First</option>
              <option value="currentStudents-desc">Most Students</option>
              <option value="currentStudents-asc">Least Students</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No courses found' : 'No courses yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first course.'
            }
          </p>
          {hasPermission('create_courses') && !searchTerm && statusFilter === 'all' && (
            <button
              onClick={onCreateCourse}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Course
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const progress = getCourseProgress(course);
            
            return (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Course Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500">{course.code}</p>
                    </div>
                    {getStatusBadge(course.status)}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {course.currentStudents}/{course.maxStudents}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {course.surveyCount} surveys
                    </div>
                  </div>

                  {/* Course Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          progress.status === 'completed' 
                            ? 'bg-green-500' 
                            : progress.status === 'in-progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Course Dates */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Course Actions */}
                <div className="border-t border-gray-200 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewAnalytics(course)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="View Analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onEditCourse(course)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDuplicateCourse(course)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Duplicate Course"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteCourse(course)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Account Tier Limitation Notice */}
      {user?.accountTier === 'basic' && courses.length >= 1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Basic Account Limit Reached</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Basic accounts are limited to one course. Upgrade to Professional to create unlimited courses.
              </p>
              <button className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900">
                Upgrade Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
