import type { Property, Tenant, Lease, Payment, MaintenanceRequest, User, Document } from '../types';

export const testUsers: User[] = [
  {
    id: '1',
    email: 'manager@mskn.com',
    name: 'John Manager',
    role: 'property_manager',
    phone: '555-0101',
  },
  {
    id: '2',
    email: 'tenant@mskn.com',
    name: 'Jane Tenant',
    role: 'tenant',
    phone: '555-0102',
  },
  {
    id: '3',
    email: 'owner@mskn.com',
    name: 'Bob Owner',
    role: 'property_owner',
    phone: '555-0103',
  },
];

export const testProperties: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1200,
    rentAmount: 1200,
    status: 'occupied',
    ownerId: '3',
    managerId: '1',
    description: 'Beautiful 2-bedroom apartment in downtown area',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Oakwood House',
    address: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62702',
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    rentAmount: 1800,
    status: 'available',
    ownerId: '3',
    managerId: '1',
    description: 'Spacious 3-bedroom house with backyard',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
];

export const testLeases: Lease[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '1',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: 1200,
    deposit: 2400,
    status: 'active',
    signedDate: '2023-12-15',
  },
];

export const testTenants: Tenant[] = [
  {
    id: '1',
    userId: '2',
    propertyId: '1',
    leaseId: '1',
    moveInDate: '2024-01-01',
    status: 'active',
    emergencyContact: {
      name: 'John Doe',
      phone: '555-9999',
      relationship: 'Parent',
    },
  },
];

export const testPayments: Payment[] = [
  {
    id: '1',
    leaseId: '1',
    tenantId: '1',
    propertyId: '1',
    amount: 1200,
    dueDate: '2024-02-01',
    paidDate: '2024-01-28',
    status: 'paid',
    type: 'rent',
    method: 'bank_transfer',
  },
  {
    id: '2',
    leaseId: '1',
    tenantId: '1',
    propertyId: '1',
    amount: 1200,
    dueDate: '2024-03-01',
    status: 'pending',
    type: 'rent',
  },
];

export const testMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '1',
    title: 'Leaky Faucet',
    description: 'The kitchen faucet has been leaking for the past week',
    category: 'plumbing',
    priority: 'medium',
    status: 'pending',
    requestedDate: '2024-02-10T10:00:00Z',
  },
  {
    id: '2',
    propertyId: '1',
    tenantId: '1',
    title: 'AC Not Working',
    description: 'Air conditioning unit stopped working in the living room',
    category: 'hvac',
    priority: 'high',
    status: 'in_progress',
    requestedDate: '2024-02-05T14:00:00Z',
    assignedTo: '1',
  },
];

export const testDocuments: Document[] = [
  {
    id: '1',
    name: 'Lease Agreement - Property 1',
    type: 'lease',
    url: '#',
    propertyId: '1',
    tenantId: '1',
    leaseId: '1',
    uploadedDate: '2023-12-15T10:00:00Z',
    uploadedBy: '1',
  },
  {
    id: '2',
    name: 'Payment Receipt - February 2024',
    type: 'receipt',
    url: '#',
    propertyId: '1',
    tenantId: '1',
    uploadedDate: '2024-01-28T10:00:00Z',
    uploadedBy: '1',
  },
];

