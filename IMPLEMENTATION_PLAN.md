# TeachGage Frontend Implementation Plan

## 🎯 Overview

This document outlines the comprehensive implementation plan for the TeachGage frontend application based on the Statement of Work requirements and backend API analysis.

## 🔐 Authentication & Interface Separation

### Regular User Interfaces
- **Landing Page**: `/` - Public marketing site
- **User Auth**: `/auth/signin`, `/auth/signup` - Standard user authentication  
- **User Dashboard**: `/dashboard/*` - Regular user features
- **Organization Admin Signup**: `/auth/signup/organization` - Organization account creation

### Admin Interfaces (Separate)
- **Admin Landing**: `/admin` - Admin-specific landing page
- **Admin Auth**: `/admin/login` - Separate admin authentication
- **Platform Admin**: `/admin/platform/*` - Platform-level administration
- **Organization Admin**: `/admin/organization/*` - Organization management

## 👥 **USER JOURNEY & ACCOUNT FLOW SPECIFICATIONS**

### **Account Types & Access Control**

#### **1. Basic Account (Free)**
- **Registration**: Regular signup path (`/auth/signup`)
- **Features**: Limited to single instructor use
- **Restrictions**: One instructor only, basic features
- **Billing**: No subscription required, permanently free
- **Access**: Immediate access after email verification

#### **2. Professional Account (Paid with 30-day Trial)**
- **Registration**: Regular signup path (`/auth/signup`)
- **Trial Period**: 30 days free access to all professional features
- **Post-Trial**: Subscription required for continued access
- **Payment Flow**: Payment during signup or before trial expires
- **Access Restriction**: Account locked with subscription overlay if no payment after trial

#### **3. Organizational Account (Paid with 30-day Trial)**
- **Registration**: Dedicated organization signup (`/auth/signup/organization`)
- **Account Creator**: Organization admin with full organization management
- **Trial Period**: 30 days free access for entire organization
- **Post-Trial**: Subscription required for continued organization access
- **Instructor Management**: Organization admin creates instructor profiles

### **User Registration Flows**

#### **Flow 1: Basic Account Registration**
1. User visits `/auth/signup`
2. Selects "Basic Account" (free)
3. Completes registration form
4. Email verification required
5. Direct access to basic instructor dashboard
6. No payment or subscription setup

#### **Flow 2: Professional Account Registration**
1. User visits `/auth/signup`
2. Selects "Professional Account" 
3. Completes registration form
4. Email verification required
5. **Option A**: Pay immediately → Full access
6. **Option B**: Start 30-day trial → Trial access with countdown
7. Trial expiration → Subscription overlay blocks access until payment

#### **Flow 3: Organization Account Registration**
1. Organization admin visits `/auth/signup/organization`
2. Completes organization registration form
3. Email verification required
4. **Option A**: Pay immediately → Full organization access
5. **Option B**: Start 30-day trial → Trial access with countdown
6. Redirected to organization admin dashboard
7. Can create instructor profiles (individual or bulk upload)

### **Instructor Profile Creation (Organization Accounts)**

#### **Individual Instructor Creation**
1. Organization admin navigates to instructor management
2. Fills out instructor profile form
3. System creates regular user account for instructor
4. Instructor receives email with temporary password
5. Instructor must change password on first login
6. Instructor accesses through regular signin (`/auth/signin`)
7. Instructor gets professional account features

#### **Bulk Instructor Upload**
1. Organization admin uploads CSV file with instructor data
2. System validates and processes instructor list
3. Creates regular user accounts for each instructor
4. Sends welcome emails with temporary passwords
5. All instructors must change passwords on first login
6. All instructors get professional account features

### **Access Control & Restrictions**

#### **Trial Expiration Handling**
- **30-day countdown**: Visible in dashboard for Professional/Organizational accounts
- **Trial expired**: Subscription overlay blocks all access
- **Overlay content**: Payment options, plan selection, contact sales
- **Bypass conditions**: Active subscription or Basic account type

#### **Account Provisioning**
- **Organization-created instructors**: Automatically provisioned as Professional accounts
- **Account inheritance**: Instructors inherit organization's subscription status
- **Password policy**: Force password change on first login for admin-created accounts

## 🚨 **CRITICAL GAPS ANALYSIS**

Based on thorough review of the SoW requirements and backend API capabilities, the following critical gaps have been identified:

### **Implementation Completeness: 46%**

| Feature Category | SoW Requirement | Current Status | Completeness |
|------------------|-----------------|----------------|--------------|
| User Management | Full 3-tier system | Admin-only | 30% |
| Course Management | Complete CRUD system | Not implemented | 0% |
| Survey Engine | Complete response system | Builder only | 40% |
| Assessment Templates | Template system | Not implemented | 0% |
| Pipeline Management | 3-stage system | 5-stage system | 120% |
| Analytics Dashboard | Complete dashboard | Full implementation | 100% |
| Notification System | Email system | Not implemented | 0% |
| Instructor Interface | Complete interface | Not implemented | 0% |
| Organization Management | Admin tools | Partial implementation | 70% |
| Department Management | Admin tools | Full implementation | 100% |

### **Critical Missing Features:**
1. **No actual survey response collection** - Only builder interface exists
2. **No email integration** - Critical for survey distribution  
3. **No course management** - Core feature completely missing
4. **No instructor interface** - Primary user group has no dedicated interface
5. **No 3-tier account system** - Business model foundation missing
6. **No user registration** - No way for regular users to join platform

## 🔄 **UPDATED IMPLEMENTATION PHASES**

### Phase 1: Admin Foundation ✅ **COMPLETED**
- [x] Admin authentication system with `/admin/login`
- [x] AdminLayout component with separate navigation
- [x] Survey Builder with 10 question types and drag-and-drop
- [x] Pipeline Management with Kanban interface
- [x] Organization Management dashboard
- [x] Department Management system
- [x] Advanced Analytics dashboard with PDF/CSV export

### Phase 2: Core Missing Features 🚨 **CRITICAL PRIORITY**
**Target: Complete within 2 weeks**

#### **2.1 User Authentication & Registration System**
- [ ] Regular user registration interface (`/auth/signup`) with account type selection
- [ ] Organization admin registration interface (`/auth/signup/organization`)
- [ ] User login interface (`/auth/signin`) 
- [ ] Email verification flow for all account types
- [ ] Password reset functionality
- [ ] First-time login password change flow for admin-created accounts
- [ ] 30-day trial tracking and countdown display
- [ ] Subscription overlay for expired trial accounts
- [ ] Account type restrictions and feature gating

#### **2.2 Course Management System** 
- [ ] Course creation interface with wizard
- [ ] Course listing and search functionality
- [ ] Course editing and duplication
- [ ] CSV batch upload interface for courses
- [ ] Course scheduling and timeline management
- [ ] Instructor assignment interface
- [ ] Account tier restrictions implementation

#### **2.3 Survey Response Collection System**
- [ ] Anonymous survey response interface
- [ ] Survey invitation system
- [ ] Email distribution interface with CSV upload
- [ ] Response validation and storage
- [ ] Survey analytics dashboard
- [ ] Response tracking and completion rates

#### **2.4 Instructor Dashboard Interface**
- [ ] Unified instructor dashboard (same for regular users and org-created instructors)
- [ ] Account type-specific feature access (Basic vs Professional)
- [ ] Trial countdown display for Professional/Organizational accounts
- [ ] Instructor performance overview and analytics
- [ ] Course management access based on account tier
- [ ] Survey creation and management interface
- [ ] Student feedback viewing interface
- [ ] Profile management and settings

#### **2.5 Organization Admin Features**
- [ ] Organization admin dashboard after signup
- [ ] Individual instructor profile creation interface
- [ ] Bulk instructor upload (CSV) with validation
- [ ] Instructor management and oversight
- [ ] Organization-wide analytics and reporting
- [ ] Subscription management for organization
- [ ] Trial status monitoring for organization account

### Phase 3: Assessment & Templates **PRIORITY 2**
**Target: Complete within 1 week**

#### **3.1 Survey Template System**
- [ ] Template creation interface
- [ ] Role-specific templates (Academic, Vocational, Coach)
- [ ] Template customization drag-and-drop editor
- [ ] Template preview functionality
- [ ] Template categorization and search

#### **3.2 Question Bank System**
- [ ] Question bank management interface
- [ ] Question categorization system
- [ ] Bulk question upload (CSV)
- [ ] Question search and filtering
- [ ] Question usage tracking
- [ ] Integration with survey builder

### Phase 4: Communication & Notifications **PRIORITY 2**
**Target: Complete within 1 week**

#### **4.1 Notification System**
- [ ] Email notification templates (10+ templates)
- [ ] User notification preferences interface
- [ ] Automated scheduling interface
- [ ] Delivery tracking dashboard
- [ ] Notification history and logs

#### **4.2 Email Integration**
- [ ] SendGrid integration setup
- [ ] Email template management
- [ ] Bulk email sending interface
- [ ] Email delivery analytics
- [ ] Bounce and failure handling

### Phase 5: Billing & Subscriptions **PRIORITY 3**
**Target: Complete within 1 week**

#### **5.1 Subscription Management**
- [ ] Subscription plan selection interface
- [ ] Billing dashboard
- [ ] Payment method management
- [ ] Invoice viewing and download
- [ ] Usage tracking and limits
- [ ] Stripe integration interface

#### **5.2 Account Tier Implementation**
- [ ] Basic account feature restrictions (single instructor, limited features)
- [ ] Professional account trial management (30-day countdown)
- [ ] Organizational account trial management (30-day countdown)
- [ ] Subscription overlay for expired trials
- [ ] Payment integration during signup process
- [ ] Upgrade/downgrade interfaces
- [ ] Usage limit enforcement
- [ ] Billing alerts and notifications
- [ ] Account inheritance for organization-created instructors

## 📡 API Endpoint Mappings & Payloads

### 1. Authentication System

#### Regular User Authentication
**Endpoint**: `POST /api/auth/login`
**Request Payload**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "instructor",
      "accountTier": "professional",
      "organizationId": "uuid"
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### Admin Authentication
**Endpoint**: `POST /api/platform/login`
**Request Payload**:
```json
{
  "email": "admin@teachgage.com",
  "password": "admin-password",
  "adminType": "platform"
}
```

#### User Registration (Regular)
**Endpoint**: `POST /api/auth/register`
**Request Payload**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "instructor",
  "accountTier": "basic|professional",
  "paymentMethod": "pm_123", // Optional for immediate payment
  "startTrial": true // For professional accounts
}
```

#### Organization Registration
**Endpoint**: `POST /api/auth/register/organization`
**Request Payload**:
```json
{
  "organizationName": "University of Example",
  "adminFirstName": "Jane",
  "adminLastName": "Smith",
  "adminEmail": "admin@university.edu",
  "password": "password123",
  "organizationType": "academic|corporate",
  "paymentMethod": "pm_123", // Optional for immediate payment
  "startTrial": true
}
```

#### Create Instructor Profile (Organization Admin)
**Endpoint**: `POST /api/users/instructors`
**Request Payload**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "instructor@university.edu",
  "role": "instructor",
  "departmentId": "uuid",
  "organizationId": "uuid",
  "sendWelcomeEmail": true,
  "temporaryPassword": true
}
```

#### Bulk Create Instructors
**Endpoint**: `POST /api/users/instructors/batch`
**Request**: Multipart form with CSV file
**Response**:
```json
{
  "success": true,
  "data": {
    "created": 25,
    "failed": 2,
    "errors": [
      {
        "row": 3,
        "error": "Invalid email format"
      }
    ],
    "instructors": [
      {
        "id": "uuid",
        "email": "instructor@university.edu",
        "temporaryPassword": "temp123",
        "welcomeEmailSent": true
      }
    ]
  }
}
```

#### Check Trial Status
**Endpoint**: `GET /api/billing/trial-status`
**Response**:
```json
{
  "success": true,
  "data": {
    "isTrialActive": true,
    "trialStartDate": "2024-01-01T00:00:00Z",
    "trialEndDate": "2024-01-31T23:59:59Z",
    "daysRemaining": 15,
    "accountTier": "professional",
    "requiresSubscription": true
  }
}
```

#### Force Password Change
**Endpoint**: `POST /api/auth/force-password-change`
**Request Payload**:
```json
{
  "currentPassword": "temp123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

### 2. Course Management

#### Get Courses
**Endpoint**: `GET /api/courses`
**Query Parameters**: `?page=1&limit=10&search=photography&status=active`
**Response**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Photography Basics",
        "description": "Learn photography fundamentals",
        "status": "active",
        "instructorId": "uuid",
        "studentCount": 25,
        "startDate": "2024-01-15",
        "endDate": "2024-03-15",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### Create Course
**Endpoint**: `POST /api/courses`
**Request Payload**:
```json
{
  "title": "Advanced Photography",
  "description": "Advanced photography techniques",
  "objectives": ["Master lighting", "Understand composition"],
  "prerequisites": ["Basic Photography"],
  "instructorId": "uuid",
  "departmentId": "uuid",
  "startDate": "2024-02-01",
  "endDate": "2024-04-01",
  "maxStudents": 30
}
```

### 3. Survey Engine

#### Create Survey Draft
**Endpoint**: `POST /api/survey/drafts`
**Request Payload**:
```json
{
  "title": "Course Evaluation",
  "description": "Mid-semester feedback",
  "courseId": "uuid",
  "questions": [
    {
      "type": "multiple_choice",
      "question": "How would you rate the course?",
      "options": ["Excellent", "Good", "Fair", "Poor"],
      "required": true,
      "allowMultiple": false
    },
    {
      "type": "likert_scale",
      "question": "Rate the following aspects:",
      "statements": ["Content quality", "Instructor clarity"],
      "scale": {
        "min": 1,
        "max": 5,
        "labels": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      }
    }
  ]
}
```

### 4. Survey Response Collection

#### Submit Survey Response
**Endpoint**: `POST /api/surveys/responses`
**Request Payload**:
```json
{
  "surveyId": "uuid",
  "responses": [
    {
      "questionId": "uuid",
      "answer": "Excellent",
      "type": "multiple_choice"
    }
  ],
  "anonymous": true,
  "completedAt": "2024-01-15T10:30:00Z"
}
```

#### Get Survey for Response
**Endpoint**: `GET /api/surveys/:surveyId/respond`
**Query Parameters**: `?token=invitation_token`
**Response**:
```json
{
  "success": true,
  "data": {
    "survey": {
      "id": "uuid",
      "title": "Course Evaluation",
      "description": "Please provide feedback",
      "questions": [...],
      "anonymous": true
    }
  }
}
```

### 5. Survey Invitations & Distribution

#### Create Survey Invitations
**Endpoint**: `POST /api/surveys/invitations`
**Request Payload**:
```json
{
  "surveyId": "uuid",
  "recipients": [
    {
      "email": "student@example.com",
      "type": "student"
    }
  ],
  "sendAt": "2024-01-16T09:00:00Z",
  "reminderSchedule": ["3d", "1d"]
}
```

#### Batch Upload Recipients
**Endpoint**: `POST /api/surveys/invitations/batch`
**Request**: Multipart form with CSV file
**Response**:
```json
{
  "success": true,
  "data": {
    "invited": 150,
    "failed": 2,
    "errors": [
      {
        "row": 3,
        "error": "Invalid email format"
      }
    ]
  }
}
```

### 6. Assessment Templates

#### Get Templates
**Endpoint**: `GET /api/assessments/templates`
**Query Parameters**: `?role=academic&category=mid-course`
**Response**:
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "uuid",
        "title": "Academic Mid-Course Evaluation",
        "role": "academic",
        "category": "mid-course",
        "questions": [...],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Create Template
**Endpoint**: `POST /api/assessments/templates`
**Request Payload**:
```json
{
  "title": "Custom Academic Template",
  "description": "Customized template for academic courses",
  "role": "academic",
  "category": "mid-course",
  "questions": [...],
  "organizationId": "uuid"
}
```

### 7. Question Bank

#### Get Question Banks
**Endpoint**: `GET /api/question-banks`
**Query Parameters**: `?category=academic&search=engagement`
**Response**:
```json
{
  "success": true,
  "data": {
    "banks": [
      {
        "id": "uuid",
        "name": "Academic Question Bank",
        "categories": ["engagement", "content", "delivery"],
        "questionCount": 150,
        "organizationId": "uuid"
      }
    ]
  }
}
```

#### Search Questions
**Endpoint**: `GET /api/question-banks/questions/search`
**Query Parameters**: `?type=multiple_choice&category=engagement&role=academic`
**Response**:
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "uuid",
        "text": "How engaging was the course content?",
        "type": "multiple_choice",
        "options": ["Very engaging", "Somewhat engaging", "Not engaging"],
        "category": "engagement",
        "roles": ["academic"],
        "usageCount": 45
      }
    ]
  }
}
```

### 8. Notification System

#### Send Notification
**Endpoint**: `POST /api/notifications`
**Request Payload**:
```json
{
  "templateId": "uuid",
  "recipients": ["user1@example.com", "user2@example.com"],
  "variables": {
    "courseName": "Photography Basics",
    "surveyLink": "https://app.teachgage.com/survey/uuid"
  },
  "scheduledFor": "2024-01-16T09:00:00Z"
}
```

#### Get Notification Templates
**Endpoint**: `GET /api/notifications/templates`
**Response**:
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "uuid",
        "name": "Survey Invitation",
        "subject": "Please complete your course evaluation",
        "type": "email",
        "variables": ["courseName", "surveyLink", "instructorName"]
      }
    ]
  }
}
```

### 9. Billing & Subscriptions

#### Get Subscription Info
**Endpoint**: `GET /api/billing/subscription`
**Response**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_123",
    "plan": "professional",
    "status": "active",
    "currentPeriodStart": "2024-01-01T00:00:00Z",
    "currentPeriodEnd": "2024-02-01T00:00:00Z",
    "usage": {
      "users": 15,
      "maxUsers": 50,
      "surveys": 23,
      "responses": 1247
    }
  }
}
```

#### Upgrade Subscription
**Endpoint**: `PUT /api/billing/subscription/upgrade`
**Request Payload**:
```json
{
  "planId": "professional",
  "paymentMethodId": "pm_123"
}
```

### 10. Analytics System

#### Dashboard Metrics
**Endpoint**: `GET /api/analytics/dashboard`
**Query Parameters**: `?timeRange=30d&departmentId=uuid`
**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCourses": 45,
      "activeSurveys": 12,
      "totalResponses": 1247,
      "averageRating": 4.3,
      "responseRate": 87.5
    },
    "trends": [
      {
        "date": "2024-01-01",
        "responses": 23,
        "averageRating": 4.2
      }
    ],
    "topPerformers": [
      {
        "instructorId": "uuid",
        "name": "John Smith",
        "averageRating": 4.8,
        "responseCount": 156
      }
    ]
  }
}
```

## 🎨 Component Architecture

### Admin Interface Components
- `AdminLayout` - Separate layout for admin pages
- `AdminNavbar` - Admin-specific navigation
- `AdminSidebar` - Admin dashboard sidebar
- `PlatformAdminDashboard` - Platform-level admin dashboard
- `OrganizationAdminDashboard` - Organization admin dashboard

### Survey Builder Components
- `SurveyBuilder` - Main builder interface
- `QuestionTypeSelector` - Question type picker
- `QuestionEditor` - Individual question editor
- `SurveyPreview` - Preview functionality
- Question type components:
  * `MultipleChoiceQuestion`
  * `LikertScaleQuestion`
  * `RatingQuestion`
  * `SliderQuestion`
  * `OpenEndedQuestion`
  * `DropdownQuestion`
  * `MatrixQuestion`
  * `RankOrderQuestion`
  * `DichotomousQuestion`
  * `OpinionScaleQuestion`

### Analytics Components
- `AnalyticsDashboard` - Main analytics interface
- `MetricsCards` - KPI display cards
- `TrendCharts` - Time-series visualizations
- `ResponseRateChart` - Response rate analytics
- `PerformanceHeatmap` - Performance visualization
- `ExportControls` - Data export interface

## 🎨 Updated Component Architecture

### Core User Interface Components
- `UserLayout` - Main layout for regular users
- `UserNavbar` - User navigation with role-based menus
- `UserDashboard` - Unified instructor dashboard (regular + org-created instructors)
- `CourseCard` - Course display component
- `SurveyCard` - Survey display component
- `TrialCountdown` - 30-day trial countdown display
- `SubscriptionOverlay` - Blocks access for expired trials
- `AccountTypeIndicator` - Shows Basic/Professional/Organizational status

### Authentication & Registration Components
- `SignupForm` - Regular user registration with account type selection
- `OrganizationSignupForm` - Organization admin registration
- `LoginForm` - Unified login for all user types
- `EmailVerification` - Email verification flow
- `PasswordReset` - Password reset functionality
- `ForcePasswordChange` - First-time login password change
- `AccountTypeSelector` - Basic/Professional account selection
- `PaymentIntegration` - Stripe payment during signup
- `TrialStartConfirmation` - Trial activation confirmation

### Organization Admin Components
- `OrganizationDashboard` - Post-signup organization admin dashboard
- `InstructorCreationForm` - Individual instructor profile creation
- `BulkInstructorUpload` - CSV upload for multiple instructors
- `InstructorManagement` - Instructor oversight and management
- `OrganizationAnalytics` - Organization-wide reporting
- `OrganizationSubscription` - Organization subscription management
- `InstructorList` - List of organization instructors with status

### Course Management Components
- `CourseCreationWizard` - Step-by-step course creation
- `CourseList` - Course listing with search/filter
- `CourseEditor` - Course editing interface
- `CourseBatchUpload` - CSV upload interface
- `CourseScheduler` - Timeline and scheduling
- `InstructorAssignment` - Instructor management

### Survey Response Components
- `SurveyResponseInterface` - Anonymous response collection
- `SurveyInvitation` - Invitation management
- `EmailDistribution` - Bulk email interface
- `ResponseTracking` - Response analytics
- `SurveyCompletion` - Completion confirmation

### Assessment Template Components
- `TemplateBuilder` - Template creation interface
- `TemplateLibrary` - Template browsing and selection
- `TemplateCustomizer` - Drag-and-drop customization
- `RoleSpecificTemplates` - Academic/Vocational/Coach templates

### Question Bank Components
- `QuestionBankManager` - Question bank administration
- `QuestionSearch` - Advanced question search
- `QuestionUpload` - Bulk question import
- `QuestionCategories` - Category management
- `QuestionUsageTracker` - Usage analytics

### Notification Components
- `NotificationCenter` - User notification interface
- `NotificationTemplates` - Template management
- `EmailScheduler` - Automated scheduling
- `DeliveryTracker` - Email delivery analytics
- `NotificationPreferences` - User preference settings

### Billing Components
- `SubscriptionDashboard` - Subscription management
- `PlanSelector` - Plan selection interface
- `PaymentMethods` - Payment method management
- `InvoiceViewer` - Invoice display and download
- `UsageTracker` - Usage monitoring
- `BillingAlerts` - Usage and billing alerts

## 🔧 Updated Technical Requirements

### Additional Dependencies Needed
```json
{
  "@dnd-kit/core": "^6.0.8",
  "@dnd-kit/sortable": "^7.0.2",
  "@dnd-kit/utilities": "^3.2.1",
  "react-pdf": "^7.5.1",
  "@stripe/stripe-js": "^2.1.11",
  "react-calendar": "^4.6.0",
  "react-select": "^5.8.0",
  "react-table": "^7.8.0",
  "socket.io-client": "^4.7.2",
  "react-dropzone": "^14.2.3",
  "papaparse": "^5.4.1",
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1",
  "react-hook-form": "^7.48.2",
  "yup": "^1.3.3",
  "@hookform/resolvers": "^3.3.2"
}
```

### Environment Variables Required
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SENDGRID_API_KEY=SG...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Updated Implementation Scope

### Current Status
- **Completed Components**: ~45 components (Admin interfaces)
- **Remaining Components**: ~120+ components
- **Completed Pages**: ~15 pages (Admin pages)
- **Remaining Pages**: ~40+ pages
- **API Integrations Completed**: 5/15 endpoint categories
- **Overall Progress**: 46% complete

### Critical Path Items
1. **User Authentication System** - Blocks all user features
2. **Course Management** - Core platform functionality
3. **Survey Response Collection** - Primary business value
4. **Instructor Interface** - Primary user experience
5. **Email Integration** - Essential for operations

## 🚨 Critical Recommendations

### Immediate Actions Required (Next 2 Weeks)
1. **Implement user registration and authentication system**
2. **Build course management CRUD interface**
3. **Create survey response collection system**
4. **Develop instructor dashboard interface**
5. **Integrate email notification system**

### Success Metrics
- **User Registration Flow**: 100% functional for all 3 account types
- **Organization Signup**: Seamless organization admin registration and redirect
- **Instructor Creation**: Individual and bulk instructor profile creation working
- **Trial Management**: 30-day countdown and expiration handling functional
- **Subscription Overlay**: Proper access blocking for expired trials
- **Password Management**: Force password change on first login working
- **Account Inheritance**: Organization instructors get professional features
- **Course Creation**: Support all SoW requirements with tier restrictions
- **Survey Responses**: Anonymous collection working
- **Email Integration**: 95%+ delivery rate for welcome emails and notifications

### Risk Mitigation
- **Backend API Compatibility**: All endpoints tested and documented
- **Data Security**: Anonymous responses properly implemented
- **Performance**: <3 second page loads maintained
- **Mobile Compatibility**: Responsive design across all new features
- **Testing Coverage**: >80% test coverage for critical paths

## 🚀 Next Steps

### Week 1-2: Critical Foundation
1. **Implement 3-tier authentication system**
   - Regular signup with Basic/Professional account selection
   - Organization admin signup with separate flow
   - Trial management and countdown implementation
   - Subscription overlay for expired trials
2. **Build organization admin features**
   - Organization dashboard after signup
   - Individual and bulk instructor creation
   - Instructor management interface
3. **Develop unified instructor dashboard**
   - Same interface for regular and org-created instructors
   - Account type-specific feature access
   - Trial status display and management
4. **Implement password management**
   - Force password change on first login
   - Welcome email system for new instructors

### Week 3: Templates & Communication
1. Build assessment template system
2. Implement question bank
3. Create notification system
4. Integrate email functionality

### Week 4: Billing & Polish
1. Implement subscription management
2. Add account tier restrictions
3. Complete testing and optimization
4. Prepare for production deployment

This updated plan addresses all critical gaps identified in the SoW analysis and provides a clear roadmap to achieve 100% feature completeness within 4 weeks.
