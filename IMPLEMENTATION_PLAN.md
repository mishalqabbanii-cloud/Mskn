# MSKN Cloud - Implementation Plan

## Overview
This document outlines the implementation plan for MSKN Cloud, a property management system built with React, Vite, TypeScript, and Tailwind CSS.

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx       # Main layout with sidebar navigation
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── pages/               # Page components
│   ├── Login.tsx        # Login page
│   ├── Register.tsx     # Registration page
│   ├── Dashboard.tsx    # Dashboard with stats and recent activity
│   ├── Properties.tsx   # Properties list page
│   ├── PropertyDetails.tsx # Property detail page
│   ├── Tenants.tsx      # Tenants management page
│   ├── Leases.tsx       # Leases management page
│   ├── Payments.tsx     # Payments tracking page
│   ├── Maintenance.tsx  # Maintenance requests page
│   ├── Documents.tsx    # Documents management page
│   └── Reports.tsx      # Financial reports page
├── services/            # API services
│   └── api.ts           # API client and endpoints
├── types/               # TypeScript type definitions
│   └── index.ts         # All type definitions
├── utils/               # Utility functions
│   ├── validation.ts    # Zod validation schemas
│   └── testData.ts      # Test data for development
├── App.tsx              # Main app component with routing
├── main.tsx             # App entry point
└── index.css            # Global styles with Tailwind
```

## Functional Requirements by Role

### Property Manager

#### Properties Management
- **View Properties** (`/properties`)
  - List all properties with status, type, rent amount
  - Filter by status (available, occupied, maintenance)
  - View property details
- **Create/Edit Properties**
  - Add new properties with full details
  - Edit existing property information
  - Upload property images

#### Tenant Management
- **View Tenants** (`/tenants`)
  - List all tenants with contact information
  - View tenant details and lease history
  - Track tenant status (active, inactive, pending)

#### Lease Management
- **Manage Leases** (`/leases`)
  - Create new lease agreements
  - View active and expired leases
  - Track lease terms and dates
  - Manage lease documents

#### Payment Tracking
- **Payment Management** (`/payments`)
  - View all payments across properties
  - Record payment receipts
  - Track payment status (pending, paid, overdue)
  - Filter by property, tenant, or status

#### Maintenance Requests
- **Maintenance Management** (`/maintenance`)
  - View all maintenance requests
  - Assign requests to contractors
  - Update request status
  - Track estimated and actual costs
  - Filter by status, priority, or property

#### Financial Reports
- **Reports** (`/reports`)
  - Generate property-specific financial reports
  - View income, expenses, and net income
  - Breakdown by expense categories
  - Filter by time period (month, quarter, year)

### Tenant

#### Property Information
- **View Assigned Property** (`/properties/:id`)
  - View property details
  - Access lease information
  - View maintenance history

#### Lease Management
- **View Lease** (`/leases`)
  - View current lease agreement
  - Access lease documents
  - Track lease dates and terms

#### Payments
- **Make Payments** (`/payments`)
  - View payment history
  - See upcoming payments
  - Make online payments
  - Download payment receipts
  - Filter by status

#### Maintenance Requests
- **Submit Requests** (`/maintenance`)
  - Create new maintenance requests
  - Upload photos with requests
  - Track request status
  - View request history
  - Filter by status

#### Documents
- **Access Documents** (`/documents`)
  - View lease documents
  - Download invoices and receipts
  - Access notices and communications
  - Filter by document type

### Property Owner

#### Properties Overview
- **View Properties** (`/properties`)
  - View all owned properties
  - See property status and occupancy
  - Access property performance metrics

#### Financial Reports
- **Financial Reports** (`/reports`)
  - Generate owner-level financial reports
  - View aggregated income across all properties
  - Track expenses by property
  - Net income analysis
  - Filter by time period

#### Payment Tracking
- **Payment Overview** (`/payments`)
  - View all payments across properties
  - Track rent collection
  - Monitor payment status

## Routes and Navigation

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Role-based)
- `/dashboard` - Dashboard (all roles)
- `/properties` - Properties list (Manager, Owner)
- `/properties/:id` - Property details (all roles)
- `/tenants` - Tenants management (Manager only)
- `/leases` - Leases management (Manager, Tenant)
- `/payments` - Payments (all roles)
- `/maintenance` - Maintenance requests (Manager, Tenant)
- `/documents` - Documents (all roles)
- `/reports` - Financial reports (Manager, Owner)

## API Integration

### Base URL
All API calls are configured to connect to `http://127.0.0.1:5000`

### API Endpoints Structure

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

#### Properties
- `GET /properties` - Get all properties
- `GET /properties/:id` - Get property by ID
- `POST /properties` - Create property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

#### Tenants
- `GET /tenants` - Get all tenants
- `GET /tenants/:id` - Get tenant by ID
- `GET /tenants?propertyId=:id` - Get tenants by property
- `POST /tenants` - Create tenant
- `PUT /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Delete tenant

#### Leases
- `GET /leases` - Get all leases
- `GET /leases/:id` - Get lease by ID
- `GET /leases?propertyId=:id` - Get leases by property
- `GET /leases?tenantId=:id` - Get leases by tenant
- `POST /leases` - Create lease
- `PUT /leases/:id` - Update lease
- `DELETE /leases/:id` - Delete lease

#### Payments
- `GET /payments` - Get all payments
- `GET /payments/:id` - Get payment by ID
- `GET /payments?tenantId=:id` - Get payments by tenant
- `GET /payments?propertyId=:id` - Get payments by property
- `POST /payments` - Create payment
- `PUT /payments/:id` - Update payment
- `POST /payments/:id/record` - Record payment

#### Maintenance
- `GET /maintenance` - Get all requests
- `GET /maintenance/:id` - Get request by ID
- `GET /maintenance?propertyId=:id` - Get requests by property
- `GET /maintenance?tenantId=:id` - Get requests by tenant
- `POST /maintenance` - Create request
- `PUT /maintenance/:id` - Update request
- `POST /maintenance/:id/assign` - Assign request
- `POST /maintenance/:id/complete` - Complete request

#### Documents
- `GET /documents` - Get all documents
- `GET /documents/:id` - Get document by ID
- `POST /documents/upload` - Upload document
- `DELETE /documents/:id` - Delete document

#### Reports
- `GET /reports/property/:id` - Get property report
- `GET /reports/owner/:id` - Get owner report

## Form Validation

All forms use Zod schemas for validation:

- **Login Schema**: Email and password validation
- **Register Schema**: Email, password, name, role, with password confirmation
- **Property Schema**: Property details validation
- **Maintenance Request Schema**: Request details validation
- **Lease Schema**: Lease terms validation with date checks
- **Payment Schema**: Payment amount and date validation

## State Management

- **AuthContext**: Manages user authentication state
- **Local State**: Component-level state using React hooks
- **API State**: Data fetched from backend and cached in component state

## UI/UX Features

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly interactions

### User Experience
- Loading states for async operations
- Error handling and display
- Empty states with helpful messages
- Status badges with color coding
- Filter and search capabilities
- Quick action buttons

### Visual Design
- Modern, clean interface
- Consistent color scheme (primary blue)
- Card-based layouts
- Icon integration (Lucide React)
- Status indicators with badges

## Test Data

Test data is provided in `src/utils/testData.ts` for development:
- Test users (Manager, Tenant, Owner)
- Sample properties
- Sample leases and tenants
- Sample payments
- Sample maintenance requests

## Development Workflow

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Build for production**: `npm run build`
4. **Run linter**: `npm run lint`

## Security Considerations

- JWT token stored in localStorage
- Automatic token injection in API requests
- Protected routes with role-based access
- Form validation on client and server
- XSS protection through React's built-in escaping

## Future Enhancements

- Real-time notifications
- File upload functionality
- Advanced filtering and search
- Export reports to PDF/Excel
- Calendar view for leases and payments
- Mobile app (React Native)
- Email notifications
- Multi-language support
- Advanced analytics dashboard

