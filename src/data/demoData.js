// Demo data for TeachGage application
// This provides realistic sample data for all features during development

export const demoUsers = {
  // Basic Account Users
  basicInstructors: [
    {
      id: 'basic-001',
      email: 'john.basic@example.com',
      firstName: 'John',
      lastName: 'Smith',
      role: 'instructor',
      accountTier: 'basic',
      status: 'active',
      emailVerified: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastLogin: '2024-01-20T09:30:00Z',
      profilePhoto: null,
      department: 'Mathematics',
      organization: null
    }
  ],

  // Professional Account Users
  professionalInstructors: [
    {
      id: 'prof-001',
      email: 'sarah.wilson@university.edu',
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'instructor',
      accountTier: 'professional',
      status: 'active',
      emailVerified: true,
      trialStartDate: '2024-01-01T00:00:00Z',
      trialEndDate: '2024-01-31T23:59:59Z',
      isTrialActive: true,
      daysRemaining: 15,
      hasSubscription: false,
      createdAt: '2024-01-01T10:00:00Z',
      lastLogin: '2024-01-20T14:15:00Z',
      profilePhoto: '/images/avatars/sarah-wilson.jpg',
      department: 'Computer Science',
      organization: null
    },
    {
      id: 'prof-002',
      email: 'mike.johnson@college.edu',
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'instructor',
      accountTier: 'professional',
      status: 'active',
      emailVerified: true,
      trialStartDate: '2023-12-01T00:00:00Z',
      trialEndDate: '2023-12-31T23:59:59Z',
      isTrialActive: false,
      hasSubscription: true,
      subscriptionStatus: 'active',
      createdAt: '2023-12-01T10:00:00Z',
      lastLogin: '2024-01-20T11:45:00Z',
      profilePhoto: '/images/avatars/mike-johnson.jpg',
      department: 'Business Administration',
      organization: null
    }
  ],

  // Organization Admins
  organizationAdmins: [
    {
      id: 'org-admin-001',
      email: 'admin@techuniversity.edu',
      firstName: 'Dr. Emily',
      lastName: 'Rodriguez',
      role: 'organization_admin',
      accountTier: 'organizational',
      status: 'active',
      emailVerified: true,
      organizationId: 'org-001',
      trialStartDate: '2024-01-10T00:00:00Z',
      trialEndDate: '2024-02-09T23:59:59Z',
      isTrialActive: true,
      daysRemaining: 20,
      hasSubscription: false,
      createdAt: '2024-01-10T10:00:00Z',
      lastLogin: '2024-01-20T16:30:00Z',
      profilePhoto: '/images/avatars/emily-rodriguez.jpg'
    }
  ],

  // Organization-created Instructors
  organizationInstructors: [
    {
      id: 'org-inst-001',
      email: 'david.chen@techuniversity.edu',
      firstName: 'David',
      lastName: 'Chen',
      role: 'instructor',
      accountTier: 'professional', // Inherited from organization
      status: 'active',
      emailVerified: true,
      organizationId: 'org-001',
      departmentId: 'dept-001',
      createdBy: 'org-admin-001',
      mustChangePassword: false, // Already changed
      createdAt: '2024-01-12T10:00:00Z',
      lastLogin: '2024-01-20T13:20:00Z',
      profilePhoto: '/images/avatars/david-chen.jpg'
    },
    {
      id: 'org-inst-002',
      email: 'lisa.martinez@techuniversity.edu',
      firstName: 'Lisa',
      lastName: 'Martinez',
      role: 'instructor',
      accountTier: 'professional',
      status: 'pending_password_change',
      emailVerified: true,
      organizationId: 'org-001',
      departmentId: 'dept-002',
      createdBy: 'org-admin-001',
      mustChangePassword: true, // Needs to change password
      temporaryPassword: 'TempPass123!',
      createdAt: '2024-01-19T15:30:00Z',
      lastLogin: null,
      profilePhoto: null
    }
  ]
};

export const demoOrganizations = [
  {
    id: 'org-001',
    name: 'Tech University',
    type: 'academic',
    status: 'active',
    adminId: 'org-admin-001',
    trialStartDate: '2024-01-10T00:00:00Z',
    trialEndDate: '2024-02-09T23:59:59Z',
    isTrialActive: true,
    daysRemaining: 20,
    hasSubscription: false,
    maxUsers: 100,
    currentUsers: 25,
    address: {
      street: '123 University Ave',
      city: 'Tech City',
      state: 'CA',
      zipCode: '90210',
      country: 'US'
    },
    contactInfo: {
      phone: '+1-555-0123',
      email: 'admin@techuniversity.edu'
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z'
  }
];

export const demoDepartments = [
  {
    id: 'dept-001',
    name: 'Computer Science',
    code: 'CS',
    description: 'Computer Science and Software Engineering',
    organizationId: 'org-001',
    adminId: 'org-inst-001',
    instructorCount: 8,
    courseCount: 12,
    createdAt: '2024-01-12T10:00:00Z'
  },
  {
    id: 'dept-002',
    name: 'Mathematics',
    code: 'MATH',
    description: 'Mathematics and Statistics',
    organizationId: 'org-001',
    adminId: 'org-admin-001',
    instructorCount: 6,
    courseCount: 10,
    createdAt: '2024-01-12T10:00:00Z'
  }
];

export const demoCourses = [
  // Basic Account Course
  {
    id: 'course-basic-001',
    title: 'Introduction to Algebra',
    description: 'Basic algebraic concepts and problem solving',
    code: 'MATH-101',
    instructorId: 'basic-001',
    instructorName: 'John Smith',
    departmentId: null,
    organizationId: null,
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-05-15T23:59:59Z',
    maxStudents: 30,
    currentStudents: 25,
    objectives: [
      'Understand basic algebraic operations',
      'Solve linear equations',
      'Work with polynomials'
    ],
    prerequisites: ['Basic arithmetic'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T09:30:00Z'
  },

  // Professional Account Courses
  {
    id: 'course-prof-001',
    title: 'Advanced Data Structures',
    description: 'In-depth study of complex data structures and algorithms',
    code: 'CS-301',
    instructorId: 'prof-001',
    instructorName: 'Sarah Wilson',
    departmentId: null,
    organizationId: null,
    status: 'active',
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-05-20T23:59:59Z',
    maxStudents: 40,
    currentStudents: 35,
    objectives: [
      'Master advanced data structures',
      'Analyze algorithm complexity',
      'Implement efficient solutions'
    ],
    prerequisites: ['Data Structures I', 'Programming Fundamentals'],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 'course-prof-002',
    title: 'Database Design',
    description: 'Comprehensive database design and management',
    code: 'CS-350',
    instructorId: 'prof-001',
    instructorName: 'Sarah Wilson',
    departmentId: null,
    organizationId: null,
    status: 'draft',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-06-01T23:59:59Z',
    maxStudents: 35,
    currentStudents: 0,
    objectives: [
      'Design normalized databases',
      'Write complex SQL queries',
      'Understand database optimization'
    ],
    prerequisites: ['Introduction to Databases'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },

  // Organization Courses
  {
    id: 'course-org-001',
    title: 'Software Engineering Principles',
    description: 'Comprehensive software development methodologies',
    code: 'CS-401',
    instructorId: 'org-inst-001',
    instructorName: 'David Chen',
    departmentId: 'dept-001',
    organizationId: 'org-001',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-05-15T23:59:59Z',
    maxStudents: 50,
    currentStudents: 42,
    objectives: [
      'Understand SDLC methodologies',
      'Apply Agile principles',
      'Design scalable systems'
    ],
    prerequisites: ['Programming II', 'Data Structures'],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-20T13:20:00Z'
  },
  {
    id: 'course-org-002',
    title: 'Calculus I',
    description: 'Introduction to differential calculus',
    code: 'MATH-201',
    instructorId: 'org-inst-002',
    instructorName: 'Lisa Martinez',
    departmentId: 'dept-002',
    organizationId: 'org-001',
    status: 'pending',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-06-01T23:59:59Z',
    maxStudents: 45,
    currentStudents: 0,
    objectives: [
      'Master derivative concepts',
      'Apply calculus to real problems',
      'Understand limits and continuity'
    ],
    prerequisites: ['Pre-Calculus'],
    createdAt: '2024-01-19T15:30:00Z',
    updatedAt: '2024-01-19T15:30:00Z'
  }
];

export const demoSurveys = [
  {
    id: 'survey-001',
    title: 'Mid-Semester Course Evaluation',
    description: 'Please provide feedback on the course progress',
    courseId: 'course-prof-001',
    courseName: 'Advanced Data Structures',
    instructorId: 'prof-001',
    instructorName: 'Sarah Wilson',
    status: 'active',
    anonymousResponses: true,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-30T23:59:59Z',
    totalInvitations: 35,
    totalResponses: 28,
    completionRate: 80,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'How would you rate the course content?',
        options: ['Excellent', 'Good', 'Fair', 'Poor'],
        required: true
      },
      {
        id: 'q2',
        type: 'likert_scale',
        question: 'Rate the following aspects:',
        statements: ['Content clarity', 'Instructor engagement', 'Assignment difficulty'],
        scale: {
          min: 1,
          max: 5,
          labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
        }
      },
      {
        id: 'q3',
        type: 'open_ended',
        question: 'What improvements would you suggest?',
        required: false
      }
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 'survey-002',
    title: 'Software Engineering Course Feedback',
    description: 'End-of-semester evaluation',
    courseId: 'course-org-001',
    courseName: 'Software Engineering Principles',
    instructorId: 'org-inst-001',
    instructorName: 'David Chen',
    status: 'draft',
    anonymousResponses: true,
    startDate: '2024-05-01T00:00:00Z',
    endDate: '2024-05-15T23:59:59Z',
    totalInvitations: 0,
    totalResponses: 0,
    completionRate: 0,
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'Overall course rating',
        scale: {
          min: 1,
          max: 5,
          type: 'stars'
        }
      },
      {
        id: 'q2',
        type: 'dichotomous',
        question: 'Would you recommend this course to other students?',
        options: ['Yes', 'No']
      }
    ],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-20T13:20:00Z'
  }
];

export const demoSurveyResponses = [
  {
    id: 'response-001',
    surveyId: 'survey-001',
    respondentType: 'student',
    anonymous: true,
    responses: [
      {
        questionId: 'q1',
        answer: 'Good',
        type: 'multiple_choice'
      },
      {
        questionId: 'q2',
        answers: {
          'Content clarity': 4,
          'Instructor engagement': 5,
          'Assignment difficulty': 3
        },
        type: 'likert_scale'
      },
      {
        questionId: 'q3',
        answer: 'More practical examples would be helpful',
        type: 'open_ended'
      }
    ],
    completedAt: '2024-01-18T14:30:00Z',
    timeSpent: 420 // seconds
  },
  {
    id: 'response-002',
    surveyId: 'survey-001',
    respondentType: 'student',
    anonymous: true,
    responses: [
      {
        questionId: 'q1',
        answer: 'Excellent',
        type: 'multiple_choice'
      },
      {
        questionId: 'q2',
        answers: {
          'Content clarity': 5,
          'Instructor engagement': 5,
          'Assignment difficulty': 4
        },
        type: 'likert_scale'
      },
      {
        questionId: 'q3',
        answer: 'The course is well-structured and engaging',
        type: 'open_ended'
      }
    ],
    completedAt: '2024-01-19T16:45:00Z',
    timeSpent: 380
  }
];

export const demoAnalytics = {
  instructorDashboard: {
    'prof-001': {
      totalCourses: 2,
      activeSurveys: 1,
      totalResponses: 28,
      averageRating: 4.2,
      responseRate: 80,
      recentActivity: [
        {
          type: 'survey_response',
          message: 'New response received for Advanced Data Structures evaluation',
          timestamp: '2024-01-20T16:30:00Z'
        },
        {
          type: 'course_update',
          message: 'Database Design course updated',
          timestamp: '2024-01-20T14:15:00Z'
        }
      ]
    },
    'org-inst-001': {
      totalCourses: 1,
      activeSurveys: 0,
      totalResponses: 0,
      averageRating: null,
      responseRate: null,
      recentActivity: [
        {
          type: 'course_created',
          message: 'Software Engineering Principles course created',
          timestamp: '2024-01-12T10:00:00Z'
        }
      ]
    }
  },
  organizationDashboard: {
    'org-001': {
      totalInstructors: 2,
      totalCourses: 2,
      activeSurveys: 0,
      totalResponses: 0,
      averageRating: null,
      responseRate: null,
      departmentBreakdown: [
        {
          departmentId: 'dept-001',
          name: 'Computer Science',
          instructors: 1,
          courses: 1,
          surveys: 0
        },
        {
          departmentId: 'dept-002',
          name: 'Mathematics',
          instructors: 1,
          courses: 1,
          surveys: 0
        }
      ]
    }
  }
};

export const demoNotifications = [
  {
    id: 'notif-001',
    userId: 'prof-001',
    type: 'survey_response',
    title: 'New Survey Response',
    message: 'You have received a new response for your Advanced Data Structures evaluation',
    read: false,
    createdAt: '2024-01-20T16:30:00Z',
    actionUrl: '/dashboard/surveys/survey-001'
  },
  {
    id: 'notif-002',
    userId: 'prof-001',
    type: 'trial_reminder',
    title: 'Trial Ending Soon',
    message: 'Your 30-day trial will expire in 15 days. Subscribe to continue using professional features.',
    read: false,
    createdAt: '2024-01-20T09:00:00Z',
    actionUrl: '/billing/subscription'
  },
  {
    id: 'notif-003',
    userId: 'org-inst-002',
    type: 'password_change',
    title: 'Password Change Required',
    message: 'Please change your temporary password to complete your account setup.',
    read: false,
    createdAt: '2024-01-19T15:30:00Z',
    actionUrl: '/auth/change-password'
  }
];

// Helper functions for demo data
export const getDemoUserById = (userId) => {
  const allUsers = [
    ...demoUsers.basicInstructors,
    ...demoUsers.professionalInstructors,
    ...demoUsers.organizationAdmins,
    ...demoUsers.organizationInstructors
  ];
  return allUsers.find(user => user.id === userId);
};

export const getDemoCoursesByInstructor = (instructorId) => {
  return demoCourses.filter(course => course.instructorId === instructorId);
};

export const getDemoSurveysByCourse = (courseId) => {
  return demoSurveys.filter(survey => survey.courseId === courseId);
};

export const getDemoResponsesBySurvey = (surveyId) => {
  return demoSurveyResponses.filter(response => response.surveyId === surveyId);
};

export const getDemoNotificationsByUser = (userId) => {
  return demoNotifications.filter(notification => notification.userId === userId);
};

// Helper function to get trial days remaining
export const getTrialDaysRemaining = (user) => {
  if (!user || user.accountTier !== 'professional' || !user.trialStartDate) {
    return null;
  }
  
  const trialStart = new Date(user.trialStartDate);
  const now = new Date();
  const daysPassed = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 30 - daysPassed);
  
  return daysRemaining;
};

// Helper function to get course by ID
export const getDemoCourseById = (courseId) => {
  return demoCourses.find(course => course.id === courseId);
};

export const isTrialExpired = (user) => {
  return getTrialDaysRemaining(user) === 0;
};
