export type UserRole = 'property_manager' | 'tenant' | 'property_owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'apartment' | 'house' | 'commercial' | 'condo';
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  rentAmount: number;
  status: 'available' | 'occupied' | 'maintenance';
  ownerId: string;
  managerId?: string;
  images?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  userId: string;
  propertyId: string;
  leaseId?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  moveInDate: string;
  moveOutDate?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'expired' | 'terminated';
  terms?: string;
  signedDate: string;
  documents?: string[];
}

export interface Payment {
  id: string;
  leaseId: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  type: 'rent' | 'deposit' | 'fee' | 'maintenance';
  method?: 'bank_transfer' | 'credit_card' | 'check' | 'cash';
  transactionId?: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requestedDate: string;
  completedDate?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  images?: string[];
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'lease' | 'invoice' | 'receipt' | 'maintenance' | 'notice' | 'other';
  url: string;
  propertyId?: string;
  tenantId?: string;
  leaseId?: string;
  uploadedDate: string;
  uploadedBy: string;
}

export interface FinancialReport {
  id: string;
  propertyId?: string;
  ownerId?: string;
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  rentCollected: number;
  expenses: {
    maintenance: number;
    utilities: number;
    taxes: number;
    insurance: number;
    other: number;
  };
  generatedDate: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
}

