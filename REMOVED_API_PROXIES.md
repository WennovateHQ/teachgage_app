# Removed Next.js API Proxy Routes

## Overview

The following Next.js API routes have been removed as part of the frontend-backend integration. These routes were previously acting as proxies between the frontend and backend, which is inefficient and unnecessary.

## Removed Routes

The frontend now makes direct API calls to the backend using the axios instance configured in `src/utils/api.js`.

### Authentication Proxies (REMOVED)
- `/pages/api/auth/login.js` → Direct call to backend `/api/auth/login`
- `/pages/api/auth/signup.js` → Direct call to backend `/api/auth/register`
- `/pages/api/auth/signup/organization.js` → Direct call to backend `/api/auth/register`
- `/pages/api/auth/forgot-password.js` → Direct call to backend `/api/auth/password-reset-request`
- `/pages/api/auth/reset-password.js` → Direct call to backend `/api/auth/password-reset`
- `/pages/api/auth/verify-email.js` → Direct call to backend `/api/auth/verify/:token`
- `/pages/api/auth/resend-verification.js` → Direct call to backend `/api/auth/resend-verification`
- `/pages/api/auth/validate-reset-token.js` → Direct call to backend `/api/auth/validate-reset-token`

### Course Management Proxies (REMOVED)
- `/pages/api/courses/index.js` → Direct call to backend `/api/courses`
- `/pages/api/courses/[id].js` → Direct call to backend `/api/courses/:id`
- `/pages/api/courses/[id]/duplicate.js` → Direct call to backend `/api/courses/:id/duplicate`
- `/pages/api/courses/bulk-upload.js` → Direct call to backend `/api/courses/batch`

### Survey Proxies (REMOVED)
- `/pages/api/surveys/send-invitations.js` → Direct call to backend `/api/surveys/:id/invitations`

### Platform Admin Proxies (REMOVED)
- `/pages/api/platform/login.js` → Direct call to backend `/api/platform/login`

### Next-Auth Handler (KEPT)
- `/pages/api/auth/[...nextauth].js` → **KEPT** - This is the Next-Auth handler for OAuth/social login

## Why These Were Removed

1. **Performance**: Eliminates unnecessary hop through Next.js server
2. **Complexity**: Reduces code duplication and maintenance burden
3. **Direct Communication**: Frontend communicates directly with backend API
4. **Token Management**: Axios interceptors handle authentication tokens
5. **Error Handling**: Centralized error handling in axios interceptors

## New API Call Pattern

**Before (with proxy)**:
```javascript
// Frontend calls Next.js API route
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})

// Next.js API route proxies to backend
export default async function handler(req, res) {
  const backendResponse = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(req.body)
  })
  // ... proxy response back
}
```

**After (direct call)**:
```javascript
// Frontend calls backend directly
import { authAPI } from '@/utils/api'

const response = await authAPI.login({ email, password })
// Axios instance handles auth tokens, errors, retries
```

## Migration Guide

If you need to restore any of these proxy routes:

1. Check `src/utils/api.js` for the direct backend endpoint
2. All API functions are exported as named exports:
   - `authAPI` - Authentication endpoints
   - `courseAPI` - Course management
   - `surveyAPI` - Survey management
   - `organizationAPI` - Organization management
   - `departmentAPI` - Department management
   - `analyticsAPI` - Analytics endpoints
   - `billingAPI` - Billing and subscription
   - etc.

3. Each API function handles:
   - Authentication tokens (automatic via interceptor)
   - Error handling and retry logic
   - Token refresh on 401 responses
   - Request/response formatting

## Benefits of Direct Integration

✅ **Reduced Latency**: No intermediate server hop
✅ **Simplified Debugging**: Direct backend errors in browser console
✅ **Better Error Handling**: Centralized in axios interceptors
✅ **Token Refresh**: Automatic token refresh on expiry
✅ **Type Safety**: Direct API responses without proxy transformation
✅ **Maintainability**: Single source of truth for API endpoints

---

**Date**: December 4, 2024  
**Status**: API proxies removed, direct backend integration active  
**Backend URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable
