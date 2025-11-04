# Backend Setup Guide

## Overview

The MSKN Cloud frontend is configured to work with a real backend API and database. Mock data mode has been disabled.

## Backend Requirements

The application expects a backend API server running at:
- **Default URL**: `http://127.0.0.1:5000`
- **Configurable**: Set `VITE_API_URL` environment variable to change the API URL

## Required API Endpoints

Your backend must implement the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Properties
- `GET /properties` - Get all properties
- `GET /properties/:id` - Get property by ID
- `POST /properties` - Create property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

### Tenants
- `GET /tenants` - Get all tenants
- `GET /tenants/:id` - Get tenant by ID
- `GET /tenants?propertyId=:id` - Get tenants by property
- `POST /tenants` - Create tenant
- `PUT /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Delete tenant

### Leases
- `GET /leases` - Get all leases
- `GET /leases/:id` - Get lease by ID
- `GET /leases?propertyId=:id` - Get leases by property
- `GET /leases?tenantId=:id` - Get leases by tenant
- `POST /leases` - Create lease
- `PUT /leases/:id` - Update lease
- `DELETE /leases/:id` - Delete lease

### Payments
- `GET /payments` - Get all payments
- `GET /payments/:id` - Get payment by ID
- `GET /payments?tenantId=:id` - Get payments by tenant
- `GET /payments?propertyId=:id` - Get payments by property
- `POST /payments` - Create payment
- `PUT /payments/:id` - Update payment
- `POST /payments/:id/record` - Record payment

### Maintenance
- `GET /maintenance` - Get all maintenance requests
- `GET /maintenance/:id` - Get request by ID
- `GET /maintenance?propertyId=:id` - Get requests by property
- `GET /maintenance?tenantId=:id` - Get requests by tenant
- `POST /maintenance` - Create request
- `PUT /maintenance/:id` - Update request
- `POST /maintenance/:id/assign` - Assign request
- `POST /maintenance/:id/complete` - Complete request

### Documents
- `GET /documents` - Get all documents
- `GET /documents/:id` - Get document by ID
- `POST /documents/upload` - Upload document (multipart/form-data)
- `DELETE /documents/:id` - Delete document

### Reports
- `GET /reports/property/:id?period=:period` - Get property financial report
- `GET /reports/owner/:id?period=:period` - Get owner financial report

## Authentication

All API requests (except login/register) require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

The token should be returned from the `/auth/login` or `/auth/register` endpoints.

## Error Handling

The frontend expects standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (will redirect to login)
- `404` - Not Found
- `500` - Server Error

## Environment Variables

Create a `.env` file in the project root to configure the API URL:

```env
VITE_API_URL=http://127.0.0.1:5000
```

## Testing

Before running the frontend, ensure:
1. Your backend API server is running
2. The backend is accessible at the configured URL
3. The backend implements all required endpoints
4. CORS is properly configured if frontend and backend are on different origins

## Timeout Configuration

The API client has a 30-second timeout for requests. Adjust in `src/services/api.ts` if needed.

