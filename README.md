# TeachGage Frontend Application

A modern Next.js application for TeachGage - an educational feedback platform that enables instructors to collect anonymous feedback from students.

## Features

- **Modern Landing Page**: Beautiful, responsive landing page with animations
- **Authentication System**: Complete sign-up/sign-in flow with NextAuth.js
- **Dashboard Interface**: Comprehensive dashboard for instructors
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Component-Based Architecture**: Reusable React components
- **Type Safety**: Built with TypeScript support

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: React Query
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TeachGage Backend API running

### Installation

1. Clone the repository and navigate to the frontend app:
   ```bash
   cd Apps/teachgage-frontend-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   BACKEND_URL=http://localhost:5000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Footer, DashboardLayout)
│   └── sections/       # Page sections (Hero, WhyChooseUs, etc.)
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   └── index.js       # Landing page
├── styles/            # Global styles
└── utils/             # Utility functions
```

## Key Components

### Landing Page
- **Hero Section**: Main call-to-action with animated elements
- **Why Choose Us**: Feature highlights with icons
- **About Us**: Information about the platform
- **How It Works**: Step-by-step process explanation
- **Footer**: Contact information and links

### Authentication
- **Sign Up**: User registration with form validation
- **Sign In**: User login with NextAuth.js integration
- **Social Auth**: Google and GitHub OAuth support

### Dashboard
- **Dashboard Layout**: Sidebar navigation and header
- **Main Dashboard**: Overview with stats and recent activity
- **Course Management**: (To be implemented)
- **Feedback Forms**: (To be implemented)
- **Analytics**: (To be implemented)

## Design System

### Colors
- **Primary Blue**: `#06325C` (teachgage-blue)
- **Dark Blue**: `#021F3A` (teachgage-dark-blue)
- **Medium Blue**: `#073867` (teachgage-medium-blue)
- **Green**: `#41543C` (teachgage-green)
- **Orange**: `#F48C06` (teachgage-orange)
- **Cream**: `#FFF2E1` (teachgage-cream)

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Animations
- **Floating**: Subtle floating animations for UI elements
- **Transitions**: Smooth hover and focus transitions
- **Scroll Animations**: Intersection Observer-based animations

## API Integration

The frontend integrates with the TeachGage backend API for:
- User authentication and registration
- Course management
- Feedback form creation and management
- Analytics and reporting
- User profile management

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety
- Implement proper error handling
- Write reusable components

### State Management
- Use React Query for server state
- Use local state for UI state
- Implement proper loading and error states

### Responsive Design
- Mobile-first approach
- Use Tailwind CSS responsive utilities
- Test on multiple screen sizes

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment.

## Contributing

1. Follow the existing code style and structure
2. Create reusable components when possible
3. Add proper TypeScript types
4. Test responsive design
5. Update documentation as needed

## License

This project is part of the TeachGage platform and is proprietary software.
