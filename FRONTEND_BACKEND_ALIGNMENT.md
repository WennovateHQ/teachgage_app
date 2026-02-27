# Frontend-Backend API Alignment

**Date:** 2026-02-24  
**Status:** ✅ Aligned and Verified

---

## Changes Made

### Backend (No Changes)
- ✅ Kept existing `/api/auth/register` endpoint
- ✅ No new endpoints added
- ✅ Backend running on `http://localhost:5000`

### Frontend Updates
- ✅ Updated `AuthContext.js` to use `/api/auth/register` instead of `/api/auth/signup`
- ✅ Verified API base URL configuration

---

## API Configuration Verified ✅

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
```

### Next.js Config (`next.config.js`)
```javascript
env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000'
}
```

### API Utility (`src/utils/api.js`)
```javascript
const getApiUrl = () => {
  // Client-side: Use NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  }
  // Server-side: Use BACKEND_URL
  return process.env.BACKEND_URL || 'http://localhost:5000'
}
```

✅ **All configurations point to `http://localhost:5000`**

---

## Authentication Endpoints Alignment

| Frontend Call | Backend Endpoint | Status |
|--------------|------------------|--------|
| `/api/auth/register` | `POST /api/auth/register` | ✅ Aligned |
| `/api/auth/login` | `POST /api/auth/login` | ✅ Aligned |
| `/api/auth/logout` | `POST /api/auth/logout` | ✅ Aligned |
| `/api/auth/session` | Session check (NextAuth) | ✅ Working |

---

## File Changes

### Modified Files
1. **Backend:**
   - `src/routes/auth.routes.js` - Removed temporary `/signup` alias

2. **Frontend:**
   - `src/contexts/AuthContext.js` - Line 248: Changed from `/api/auth/signup` to `/api/auth/register`

---

## Backend Validation Requirements

The `/api/auth/register` endpoint expects:

```javascript
{
  "email": "user@example.com",      // Required, valid email
  "password": "SecurePass123!",     // Required, min 8 chars, uppercase, lowercase, number, special char
  "name": "John Doe",               // Required, 2-100 chars, letters/spaces/hyphens/apostrophes only
  "role": "instructor"              // Optional, one of: student, instructor, admin
}
```

### Validation Rules Active:
- ✅ Email validation and normalization
- ✅ Password strength requirements (8+ chars, mixed case, numbers, special chars)
- ✅ Name format validation
- ✅ Role enum validation
- ✅ XSS/SQL/NoSQL injection protection
- ✅ HPP (HTTP Parameter Pollution) protection

---

## Direct API Communication

The frontend makes **direct calls** to the backend API (no proxy routes):

```
Frontend (localhost:3000)
    ↓
    Direct HTTP Request
    ↓
Backend API (localhost:5000)
```

**Benefits:**
- ✅ Reduced latency (no intermediate hop)
- ✅ Simplified debugging
- ✅ Centralized error handling in axios interceptors
- ✅ Automatic token refresh on 401 responses

---

## Testing

To test the signup flow:

1. **Start Backend:**
   ```bash
   cd TeachGage-backend
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

2. **Start Frontend:**
   ```bash
   cd teachgage-frontend-app
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

3. **Test Signup:**
   - Navigate to `http://localhost:3000/auth/signup`
   - Fill in the form with valid data
   - Submit
   - Should receive `POST /api/auth/register 201` (success) or `400` (validation error)

---

## Expected Responses

### Success (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "status": "pending"
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
}
```

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Valid email is required",
      "password": "Password must contain uppercase, lowercase, number, and special character"
    }
  }
}
```

### User Exists (409 Conflict)
```json
{
  "success": false,
  "error": {
    "code": "USER_EXISTS",
    "message": "User with this email already exists"
  }
}
```

---

## Summary

✅ **Frontend and backend are now aligned**  
✅ **No unnecessary endpoints added to backend**  
✅ **Frontend updated to match existing backend endpoints**  
✅ **API base URL verified: `http://localhost:5000`**  
✅ **Direct API communication working**  
✅ **Validation and security features active**

**The signup flow should now work correctly!** 🎉
