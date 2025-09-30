'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getDemoCoursesByInstructor, 
  getDemoSurveysByCourse, 
  getDemoNotificationsByUser,
  demoAnalytics,
  getTrialDaysRemaining
} from '@/data/demoData';
import { 
  BookOpen, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award, 
  Bell,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  ArrowRight
} from 'lucide-react';

export default function InstructorDashboard({ onCreateCourse, onCreateSurvey }) {
  const { user, trialStatus, requiresSubscription } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    surveys: [],
    notifications: [],
    analytics: null,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = () => {
      if (!user) return;

      setIsLoading(true);

      try {
        // Get user's courses
        const courses = getDemoCoursesByInstructor(user.id);
        
        // Get all surveys for user's courses
        const allSurveys = [];
        courses.forEach(course => {
          const courseSurveys = getDemoSurveysByCourse(course.id);
          allSurveys.push(...courseSurveys);
        });

        // Get user notifications
        const notifications = getDemoNotificationsByUser(user.id);

        // Get analytics data
        const analytics = demoAnalytics.instructorDashboard[user.id] || {
          totalCourses: courses.length,
          activeSurveys: allSurveys.filter(s => s.status === 'active').length,
          totalResponses: 0,
          averageRating: null,
          responseRate: null,
          recentActivity: []
        };

        setDashboardData({
          courses,
          surveys: allSurveys,
          notifications: notifications.slice(0, 5), // Show only recent notifications
          analytics,
          recentActivity: analytics.recentActivity || []
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Get quick stats
  const getQuickStats = () => {
    const { courses, surveys, analytics } = dashboardData;
    
    return [
      {
        title: 'Total Courses',
        value: courses.length,
        icon: BookOpen,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        change: null
      },
      {
        title: 'Active Surveys',
        value: surveys.filter(s => s.status === 'active').length,
        icon: MessageSquare,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        change: null
      },
      {
        title: 'Total Responses',
        value: analytics?.totalResponses || 0,
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        change: null
      },
      {
        title: 'Average Rating',
        value: analytics?.averageRating ? `${analytics.averageRating}/5` : 'N/A',
        icon: Award,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        change: null
      }
    ];
  };

  // Get upcoming deadlines
  const getUpcomingDeadlines = () => {
    const { courses, surveys } = dashboardData;
    const deadlines = [];

    // Course end dates
    courses.forEach(course => {
      const endDate = new Date(course.endDate);
      const now = new Date();
      const daysUntil = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntil > 0 && daysUntil <= 30) {
        deadlines.push({
          type: 'course',
          title: `${course.title} ends`,
          date: endDate,
          daysUntil,
          urgent: daysUntil <= 7
        });
      }
    });

    // Survey end dates
    surveys.forEach(survey => {
      if (survey.status === 'active') {
        const endDate = new Date(survey.endDate);
        const now = new Date();
        const daysUntil = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntil > 0 && daysUntil <= 14) {
          deadlines.push({
            type: 'survey',
            title: `${survey.title} closes`,
            date: endDate,
            daysUntil,
            urgent: daysUntil <= 3
          });
        }
      }
    });

    return deadlines.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 5);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teachgage-blue"></div>
      </div>
    );
  }

  const quickStats = getQuickStats();
  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teachgage-blue to-teachgage-medium-blue rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-teachgage-cream mt-1">
              {user?.role === 'instructor' && user?.organizationId 
                ? `${user.organizationName || 'Organization'} Instructor`
                : user?.accountTier === 'basic' 
                  ? 'Basic Account'
                  : user?.accountTier === 'professional'
                    ? 'Professional Account'
                    : 'Instructor Account'
              }
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
            <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-gray-100`}>
                  <Icon className={`w-6 h-6 text-teachgage-blue`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-teachgage-navy">{stat.title}</p>
                  <p className="text-2xl font-bold text-teachgage-blue">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-teachgage-blue">Recent Courses</h2>
                <button
                  onClick={onCreateCourse}
                  className="inline-flex items-center text-sm text-teachgage-orange hover:text-teachgage-blue"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Course
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {dashboardData.courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-teachgage-blue mb-2">No courses yet</h3>
                  <p className="text-teachgage-navy mb-4">Create your first course to get started.</p>
                  <button
                    onClick={onCreateCourse}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teachgage-blue hover:bg-teachgage-medium-blue"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.courses.slice(0, 3).map((course) => (
                    <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex-1">
                          <h3 className="font-medium text-teachgage-blue">{course.title}</h3>
                          <p className="text-sm text-teachgage-navy">{course.code}</p>
                          <div className="flex items-center mt-2 text-sm text-teachgage-navy">
                            <Users className="w-4 h-4 mr-1" />
                            {course.currentStudents}/{course.maxStudents} students
                            <Calendar className="w-4 h-4 ml-4 mr-1" />
                            {new Date(course.startDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.status === 'active' 
                              ? 'bg-teachgage-green text-white'
                              : course.status === 'draft'
                                ? 'bg-gray-100 text-teachgage-navy'
                                : 'bg-teachgage-orange text-white'
                          }`}>
                            {course.status}
                          </span>
                          <div className="p-1 text-teachgage-navy hover:text-teachgage-blue">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {dashboardData.courses.length > 3 && (
                    <div className="text-center pt-4">
                      <Link href="/dashboard/courses" className="text-sm text-teachgage-blue hover:text-teachgage-orange">
                        View all {dashboardData.courses.length} courses
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Surveys */}
        <div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-teachgage-blue">Recent Surveys</h2>
                <button
                  onClick={onCreateSurvey}
                  className="inline-flex items-center text-sm text-teachgage-orange hover:text-teachgage-blue"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Survey
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {dashboardData.surveys.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-teachgage-blue mb-2">No surveys yet</h3>
                  <p className="text-teachgage-navy mb-4">Create your first survey to collect feedback.</p>
                  <button
                    onClick={onCreateSurvey}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teachgage-blue hover:bg-teachgage-medium-blue"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Survey
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.surveys.slice(0, 3).map((survey) => (
                    <Link key={survey.id} href={`/dashboard/feedback-forms/${survey.id}`}>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex-1">
                          <h3 className="font-medium text-teachgage-blue">{survey.title}</h3>
                          <p className="text-sm text-teachgage-navy">{survey.courseName}</p>
                          <div className="flex items-center mt-2 text-sm text-teachgage-navy">
                            <Users className="w-4 h-4 mr-1" />
                            {survey.totalResponses}/{survey.totalInvitations} responses
                            <Calendar className="w-4 h-4 ml-4 mr-1" />
                            {new Date(survey.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            survey.status === 'active' 
                              ? 'bg-teachgage-green text-white'
                              : survey.status === 'draft'
                                ? 'bg-gray-100 text-teachgage-navy'
                                : 'bg-teachgage-orange text-white'
                          }`}>
                            {survey.status}
                          </span>
                          <div className="p-1 text-teachgage-navy hover:text-teachgage-blue">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {dashboardData.surveys.length > 3 && (
                    <div className="text-center pt-4">
                      <Link href="/dashboard/feedback-forms" className="text-sm text-teachgage-blue hover:text-teachgage-orange">
                        View all {dashboardData.surveys.length} surveys
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
      {/* Recent Activity - Full Width */}
      {dashboardData.recentActivity.length > 0 && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-teachgage-blue">Recent Activity</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                    <div className="p-1 bg-teachgage-green rounded-full">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-teachgage-blue">{activity.message}</p>
                      <p className="text-xs text-teachgage-navy">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
