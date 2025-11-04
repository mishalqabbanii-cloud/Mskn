# MSKN Cloud Backend API

A complete Node.js/Express backend for the MSKN Cloud property management system.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Docker** - PostgreSQL containerization

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL)

## Quick Start

### Option 1: One Command Setup (Recommended)

```bash
npm run setup
```

This will:
1. Install dependencies
2. Start PostgreSQL with Docker
3. Generate database migrations
4. Run migrations
5. Seed the database
6. Start the server

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Generate migrations:**
   ```bash
   npm run db:generate
   ```

5. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Seed database:**
   ```bash
   npm run db:seed
   ```

7. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://mskn_user:mskn_password@localhost:5432/mskn_cloud
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with test data
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Properties
- `GET /properties` - Get all properties
- `GET /properties/:id` - Get property by ID
- `POST /properties` - Create property (Manager/Owner)
- `PUT /properties/:id` - Update property (Manager/Owner)
- `DELETE /properties/:id` - Delete property (Owner only)

### Tenants
- `GET /tenants` - Get all tenants (Manager)
- `GET /tenants/:id` - Get tenant by ID (Manager)
- `GET /tenants/property/:propertyId` - Get tenants by property (Manager)
- `POST /tenants` - Create tenant (Manager)
- `PUT /tenants/:id` - Update tenant (Manager)
- `DELETE /tenants/:id` - Delete tenant (Manager)

### Leases
- `GET /leases` - Get all leases
- `GET /leases/:id` - Get lease by ID
- `GET /leases/property/:propertyId` - Get leases by property
- `GET /leases/tenant/:tenantId` - Get leases by tenant
- `POST /leases` - Create lease (Manager)
- `PUT /leases/:id` - Update lease (Manager)
- `DELETE /leases/:id` - Delete lease (Manager)

### Payments
- `GET /payments` - Get all payments
- `GET /payments/:id` - Get payment by ID
- `GET /payments/tenant/:tenantId` - Get payments by tenant
- `GET /payments/property/:propertyId` - Get payments by property
- `POST /payments` - Create payment (Manager/Tenant)
- `PUT /payments/:id` - Update payment (Manager)
- `POST /payments/:id/record` - Record payment (Manager/Tenant)

### Maintenance
- `GET /maintenance` - Get all maintenance requests
- `GET /maintenance/:id` - Get request by ID
- `GET /maintenance/property/:propertyId` - Get requests by property
- `GET /maintenance/tenant/:tenantId` - Get requests by tenant
- `POST /maintenance` - Create request (Tenant/Manager)
- `PUT /maintenance/:id` - Update request (Manager)
- `POST /maintenance/:id/assign` - Assign request (Manager)
- `POST /maintenance/:id/complete` - Complete request (Manager)

### Documents
- `GET /documents` - Get all documents
- `GET /documents/:id` - Get document by ID
- `POST /documents/upload` - Upload document (Manager)
- `DELETE /documents/:id` - Delete document (Manager)

### Reports
- `GET /reports/property/:id?period=month` - Get property report (Manager/Owner)
- `GET /reports/owner/:id?period=month` - Get owner report (Owner)

## Test Credentials

After seeding, you can use these credentials:

- **Property Manager**: `manager@mskn.com` / `password123`
- **Tenant**: `tenant@mskn.com` / `password123`
- **Property Owner**: `owner@mskn.com` / `password123`

## Database Schema

The database includes:
- Users (with roles: property_manager, tenant, property_owner)
- Properties
- Tenants
- Leases
- Payments
- Maintenance Requests
- Documents

See `src/db/schema.ts` for the complete schema.

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## CORS

The backend is configured to accept requests from `http://localhost:3000` by default. Update `FRONTEND_URL` in `.env` if your frontend runs on a different URL.

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use a production PostgreSQL database
4. Build the project: `npm run build`
5. Start: `npm start`

