# Mock Data Mode (DISABLED)

**⚠️ Mock data mode has been disabled. This application now requires a real backend API.**

This document is kept for reference only. The application will no longer automatically fall back to mock data.

## How It Works

When the backend is not running, the application will:
1. Detect connection errors (ERR_CONNECTION_REFUSED, ERR_NETWORK, etc.)
2. Automatically fall back to using test data
3. Simulate API delays for a realistic experience
4. Allow you to test all features without a backend

## Test Credentials

You can log in with any of these test accounts:

### Property Manager
- **Email**: `manager@mskn.com`
- **Password**: Any password with 6+ characters (e.g., `password123`)

### Tenant
- **Email**: `tenant@mskn.com`
- **Password**: Any password with 6+ characters (e.g., `password123`)

### Property Owner
- **Email**: `owner@mskn.com`
- **Password**: Any password with 6+ characters (e.g., `password123`)

## Features Available in Mock Mode

All features work with mock data:
- ✅ Authentication (login/register)
- ✅ Properties management
- ✅ Tenants management
- ✅ Leases management
- ✅ Payments tracking
- ✅ Maintenance requests
- ✅ Documents
- ✅ Financial reports

## Switching to Real Backend

When your backend API is running at `http://127.0.0.1:5000`, the application will automatically use the real API instead of mock data. No configuration needed!

## Environment Variables

You can also force mock data mode by setting:
```
VITE_USE_MOCK_DATA=true
```

Or change the API URL:
```
VITE_API_URL=http://your-backend-url:port
```

