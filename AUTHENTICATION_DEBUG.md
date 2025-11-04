# Authentication Debugging Guide

## Issues Fixed

### 1. Error Handling Improvements

**Frontend (`src/services/api.ts`):**
- Added comprehensive error handling for network errors
- Distinguishes between server errors and network errors
- Provides clear error messages for different failure scenarios

**Frontend (`src/contexts/AuthContext.tsx`):**
- Added try-catch blocks to properly propagate errors
- Errors now bubble up to UI components correctly

**Frontend (`src/pages/Login.tsx` & `src/pages/Register.tsx`):**
- Enhanced error message extraction
- Handles different error types (network, server, validation)
- Shows specific error messages instead of generic failures

### 2. Backend Logging

**Backend (`backend/src/controllers/authController.ts`):**
- Added detailed logging for login attempts
- Logs user lookup, password validation, and token generation
- Helps debug authentication flow

**Backend (`backend/src/index.ts`):**
- Added request logging in development mode
- Improved CORS configuration with multiple allowed origins

### 3. CORS Configuration

**Backend (`backend/src/index.ts`):**
- Added multiple allowed origins: `http://localhost:3000`, `http://127.0.0.1:3000`
- Explicitly allows all necessary HTTP methods
- Allows Authorization header for JWT tokens

## Testing Authentication

### Test Backend Directly

```powershell
# Test login
$body = @{email='manager@mskn.com';password='password123'} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/auth/login -Method POST -Body $body -ContentType 'application/json'

# Test register
$body = @{email='test@example.com';password='password123';name='Test User';role='tenant'} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/auth/register -Method POST -Body $body -ContentType 'application/json'
```

### Test Credentials

- **Manager**: `manager@mskn.com` / `password123`
- **Tenant**: `tenant@mskn.com` / `password123`
- **Owner**: `owner@mskn.com` / `password123`

## Debugging Steps

### 1. Check Backend Status

```powershell
# Check if backend is running
Invoke-RestMethod -Uri http://localhost:5000/health

# Check backend logs
# Look for login attempts in the console
```

### 2. Check Database

```powershell
# Verify users exist
docker exec mskn-postgres psql -U mskn_user -d mskn_cloud -c "SELECT email, role FROM users;"
```

### 3. Check Frontend Console

Open browser DevTools (F12) and check:
- Console for error messages
- Network tab for failed requests
- Check if requests are reaching the backend

### 4. Check CORS Issues

If you see CORS errors in console:
- Verify backend is allowing `http://localhost:3000`
- Check if backend is running on correct port (5000)
- Ensure frontend is using correct API URL

### 5. Network Errors

If you see "Network error" message:
- Ensure backend is running: `cd backend && npm run dev`
- Check backend port: http://localhost:5000/health
- Verify API URL in frontend: `src/services/api.ts` (line 16)

## Common Issues and Solutions

### Issue: "Network error: Unable to connect to server"

**Solution:**
1. Start the backend: `cd backend && npm run dev`
2. Verify backend is running: `http://localhost:5000/health`
3. Check API URL in frontend matches backend URL

### Issue: "Invalid credentials"

**Solution:**
1. Use correct test credentials (see above)
2. Check database has users: `npm run db:seed` in backend
3. Verify password is correct (case-sensitive)

### Issue: "CORS error" in browser console

**Solution:**
1. Backend CORS is configured for `http://localhost:3000`
2. Ensure frontend runs on port 3000
3. Check backend logs for CORS errors

### Issue: "Internal server error"

**Solution:**
1. Check backend console logs for detailed error
2. Verify database connection is working
3. Check if JWT_SECRET is set in backend `.env`

## Error Messages

### Frontend Error Messages

- **Network Error**: Backend is not running or unreachable
- **Invalid credentials**: Email/password combination is incorrect
- **User already exists**: Email is already registered (registration only)
- **Validation error**: Form data doesn't meet requirements

### Backend Error Messages

- **401 Unauthorized**: Invalid email or password
- **400 Bad Request**: Validation error (missing fields, invalid format)
- **500 Internal Server Error**: Server-side error (check logs)

## Verification Checklist

- [ ] Backend is running on `http://localhost:5000`
- [ ] Database has seeded users (`npm run db:seed`)
- [ ] Frontend is running on `http://localhost:3000`
- [ ] Backend `.env` file exists with correct DATABASE_URL
- [ ] Backend health check returns OK
- [ ] No CORS errors in browser console
- [ ] Network requests show in browser DevTools

## Next Steps

If login still fails:
1. Check browser console for specific error
2. Check backend console for request logs
3. Verify database connection
4. Test backend directly with curl/PowerShell
5. Check if JWT token is being generated correctly

