import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['property_manager', 'tenant', 'property_owner']),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  type: z.enum(['apartment', 'house', 'commercial', 'condo']),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFeet: z.number().min(0).optional(),
  rentAmount: z.number().min(0, 'Rent amount must be positive'),
  status: z.enum(['available', 'occupied', 'maintenance']),
  ownerId: z.string().min(1, 'Owner ID is required'),
  description: z.string().optional(),
});

export const maintenanceRequestSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'emergency']),
});

export const leaseSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  monthlyRent: z.number().min(0, 'Monthly rent must be positive'),
  deposit: z.number().min(0, 'Deposit must be positive'),
  terms: z.string().optional(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const paymentSchema = z.object({
  leaseId: z.string().min(1, 'Lease is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
  type: z.enum(['rent', 'deposit', 'fee', 'maintenance']),
});

