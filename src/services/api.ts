import axios from 'axios';
import type {
  User,
  Property,
  Tenant,
  Lease,
  Payment,
  MaintenanceRequest,
  Document,
  FinancialReport,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for real API calls
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error: any) {
      // Log error for debugging
      console.error('Login API error:', error);
      // Re-throw with better error message
      if (error.response) {
        // Server responded with error
        throw error;
      } else if (error.request) {
        // Request made but no response (network error)
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  },

  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    try {
      const { data } = await api.post('/auth/register', registerData);
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error: any) {
      // Log error for debugging
      console.error('Register API error:', error);
      // Re-throw with better error message
      if (error.response) {
        // Server responded with error
        throw error;
      } else if (error.request) {
        // Request made but no response (network error)
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async (): Promise<Property[]> => {
    const { data } = await api.get('/properties');
    return data;
  },

  getById: async (id: string): Promise<Property> => {
    const { data } = await api.get(`/properties/${id}`);
    return data;
  },

  create: async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
    const { data } = await api.post('/properties', property);
    return data;
  },

  update: async (id: string, property: Partial<Property>): Promise<Property> => {
    const { data } = await api.put(`/properties/${id}`, property);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};

// Tenants API
export const tenantsAPI = {
  getAll: async (): Promise<Tenant[]> => {
    const { data } = await api.get('/tenants');
    return data;
  },

  getById: async (id: string): Promise<Tenant> => {
    const { data } = await api.get(`/tenants/${id}`);
    return data;
  },

  getByProperty: async (propertyId: string): Promise<Tenant[]> => {
    const { data } = await api.get(`/tenants?propertyId=${propertyId}`);
    return data;
  },

  create: async (tenant: Omit<Tenant, 'id'>): Promise<Tenant> => {
    const { data } = await api.post('/tenants', tenant);
    return data;
  },

  update: async (id: string, tenant: Partial<Tenant>): Promise<Tenant> => {
    const { data } = await api.put(`/tenants/${id}`, tenant);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },
};

// Leases API
export const leasesAPI = {
  getAll: async (): Promise<Lease[]> => {
    const { data } = await api.get('/leases');
    return data;
  },

  getById: async (id: string): Promise<Lease> => {
    const { data } = await api.get(`/leases/${id}`);
    return data;
  },

  getByProperty: async (propertyId: string): Promise<Lease[]> => {
    const { data } = await api.get(`/leases?propertyId=${propertyId}`);
    return data;
  },

  getByTenant: async (tenantId: string): Promise<Lease[]> => {
    const { data } = await api.get(`/leases?tenantId=${tenantId}`);
    return data;
  },

  create: async (lease: Omit<Lease, 'id'>): Promise<Lease> => {
    const { data } = await api.post('/leases', lease);
    return data;
  },

  update: async (id: string, lease: Partial<Lease>): Promise<Lease> => {
    const { data } = await api.put(`/leases/${id}`, lease);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leases/${id}`);
  },
};

// Payments API
export const paymentsAPI = {
  getAll: async (): Promise<Payment[]> => {
    const { data } = await api.get('/payments');
    return data;
  },

  getById: async (id: string): Promise<Payment> => {
    const { data } = await api.get(`/payments/${id}`);
    return data;
  },

  getByTenant: async (tenantId: string): Promise<Payment[]> => {
    const { data } = await api.get(`/payments?tenantId=${tenantId}`);
    return data;
  },

  getByProperty: async (propertyId: string): Promise<Payment[]> => {
    const { data } = await api.get(`/payments?propertyId=${propertyId}`);
    return data;
  },

  create: async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
    const { data } = await api.post('/payments', payment);
    return data;
  },

  update: async (id: string, payment: Partial<Payment>): Promise<Payment> => {
    const { data } = await api.put(`/payments/${id}`, payment);
    return data;
  },

  recordPayment: async (id: string, paymentData: { paidDate: string; method: string; transactionId?: string }): Promise<Payment> => {
    const { data } = await api.post(`/payments/${id}/record`, paymentData);
    return data;
  },
};

// Maintenance Requests API
export const maintenanceAPI = {
  getAll: async (): Promise<MaintenanceRequest[]> => {
    const { data } = await api.get('/maintenance');
    return data;
  },

  getById: async (id: string): Promise<MaintenanceRequest> => {
    const { data } = await api.get(`/maintenance/${id}`);
    return data;
  },

  getByProperty: async (propertyId: string): Promise<MaintenanceRequest[]> => {
    const { data } = await api.get(`/maintenance?propertyId=${propertyId}`);
    return data;
  },

  getByTenant: async (tenantId: string): Promise<MaintenanceRequest[]> => {
    const { data } = await api.get(`/maintenance?tenantId=${tenantId}`);
    return data;
  },

  create: async (request: Omit<MaintenanceRequest, 'id' | 'requestedDate' | 'status'>): Promise<MaintenanceRequest> => {
    const { data } = await api.post('/maintenance', request);
    return data;
  },

  update: async (id: string, request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> => {
    const { data } = await api.put(`/maintenance/${id}`, request);
    return data;
  },

  assign: async (id: string, assignedTo: string): Promise<MaintenanceRequest> => {
    const { data } = await api.post(`/maintenance/${id}/assign`, { assignedTo });
    return data;
  },

  complete: async (id: string, data: { completedDate: string; actualCost?: number; notes?: string }): Promise<MaintenanceRequest> => {
    const response = await api.post(`/maintenance/${id}/complete`, data);
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  getAll: async (): Promise<Document[]> => {
    const { data } = await api.get('/documents');
    return data;
  },

  getById: async (id: string): Promise<Document> => {
    const { data } = await api.get(`/documents/${id}`);
    return data;
  },

  upload: async (file: File, metadata: Omit<Document, 'id' | 'url' | 'uploadedDate' | 'uploadedBy'>): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    const { data } = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
};

// Financial Reports API
export const reportsAPI = {
  getPropertyReport: async (propertyId: string, period: string): Promise<FinancialReport> => {
    const { data } = await api.get(`/reports/property/${propertyId}`, { params: { period } });
    return data;
  },

  getOwnerReport: async (ownerId: string, period: string): Promise<FinancialReport> => {
    const { data } = await api.get(`/reports/owner/${ownerId}`, { params: { period } });
    return data;
  },
};

export default api;
