# MSKN Cloud - Property Management System

A comprehensive property management platform built with React, Vite, TypeScript, and Tailwind CSS.

## Features

### Property Manager
- Property management (CRUD operations)
- Tenant management
- Lease management
- Maintenance request handling
- Payment tracking
- Financial reports

### Tenant
- View lease information
- Make payments
- Submit maintenance requests
- Access documents
- View payment history

### Property Owner
- View owned properties
- Financial reports and analytics
- Tenant information
- Property performance metrics

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Zod** - Validation
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - REST API server
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries
- **JWT** - Authentication
- **Docker** - PostgreSQL containerization

## Getting Started

### Backend Setup (Required First)

1. Navigate to backend directory:
```bash
cd backend
```

2. Run one-command setup:
```bash
npm run setup
```

This will:
- Install dependencies
- Start PostgreSQL with Docker
- Set up database
- Seed test data
- Start the API server

Or see `backend/README.md` for manual setup instructions.

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Test Credentials

After backend setup, you can login with:
- **Manager**: `manager@mskn.com` / `password123`
- **Tenant**: `tenant@mskn.com` / `password123`
- **Owner**: `owner@mskn.com` / `password123`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── services/       # API services
├── types/          # TypeScript types
├── utils/          # Utility functions
├── contexts/       # React contexts (Auth, etc.)
└── routes/         # Route definitions
```

