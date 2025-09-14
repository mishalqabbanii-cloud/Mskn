# Admin System - Project Overview

## Overview

This is a comprehensive admin management system built for supervisors to manage users, subscriptions, and maintenance operations. The application provides a dashboard-driven interface with real-time analytics, user management capabilities, subscription plan administration, and maintenance ticket tracking. The system follows Material Design principles adapted for enterprise administration, prioritizing functionality and data clarity over visual appeal.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI primitives with shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Theme System**: next-themes for light/dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Pattern**: RESTful API structure with `/api` prefix routing
- **Middleware**: Custom logging, JSON parsing, and error handling middleware

### Component Design System
- **Design Language**: Custom Material Design adaptation with professional color palette
- **Typography**: Inter font for UI text, JetBrains Mono for data/code display
- **Layout System**: CSS Grid and Flexbox with consistent spacing units (2, 4, 6, 8)
- **Component Library**: Reusable components including DataTable, KPICard, SimpleChart, ActivityFeed, and modal forms

### Data Management
- **Schema Design**: PostgreSQL with enum types for status fields and relational structure
- **Entity Structure**: Users, SubscriptionPlans, UserSubscriptions, MaintenanceTickets, and ActivityLogs
- **Storage Interface**: Abstract storage layer for CRUD operations with type safety

### Core Features
- **Dashboard**: KPI metrics, activity feeds, and data visualizations
- **User Management**: CRUD operations with role-based access (Manager, Supervisor, Viewer)
- **Subscription Management**: Plan administration and user subscription tracking
- **Maintenance System**: Ticket management with priority levels and assignment
- **Settings**: Theme controls and data management utilities

## External Dependencies

### Database & ORM
- **Neon Database**: PostgreSQL cloud database service
- **Drizzle ORM**: TypeScript ORM with schema validation via Zod
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **next-themes**: Theme management for light/dark mode switching

### Development & Build
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **PostCSS**: CSS processing with Tailwind integration
- **ESBuild**: Fast JavaScript bundling for production builds

### Fonts & Assets
- **Google Fonts**: Inter and JetBrains Mono via CDN
- **Font Display**: Optimized loading with preconnect hints

### State & Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Integration with Zod for form validation

The architecture emphasizes type safety, component reusability, and maintainable code structure while providing a responsive and accessible user interface for administrative tasks.
