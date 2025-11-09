import { createContext, useContext, useState, type ReactNode } from 'react'

import { createId } from '../utils/id'

export type Owner = {
  id: string
  name: string
  phone: string
  email?: string
  notes?: string
}

export type Tenant = {
  id: string
  name: string
  phone: string
  email?: string
  workplace?: string
  notes?: string
}

export type PropertyStatus = 'available' | 'occupied' | 'maintenance'

export type Property = {
  id: string
  name: string
  address: string
  type?: string
  imageUrl?: string
  ownerId?: string
  tenantId?: string
  rentAmount?: number
  status?: PropertyStatus
  notes?: string
}

export type ContractStatus = 'active' | 'pending' | 'closed'

export type PaymentCycle = 'monthly' | 'quarterly' | 'yearly'

export type Contract = {
  id: string
  propertyId: string
  tenantId: string
  startDate: string
  endDate?: string
  rentAmount: number
  paymentCycle?: PaymentCycle
  status: ContractStatus
  notes?: string
}

export type MaintenanceStatus = 'open' | 'in_progress' | 'closed'

export type MaintenancePriority = 'low' | 'medium' | 'high'

export type MaintenanceRequest = {
  id: string
  propertyId: string
  title: string
  reportedBy: string
  status: MaintenanceStatus
  priority?: MaintenancePriority
  description?: string
  assignedTo?: string
  reportedAt: string
  notes?: string
}

export type OwnerInput = Omit<Owner, 'id'>
export type TenantInput = Omit<Tenant, 'id'>
export type PropertyInput = Omit<Property, 'id'>
export type ContractInput = Omit<Contract, 'id'>
export type MaintenanceRequestInput = Omit<MaintenanceRequest, 'id' | 'reportedAt'> & {
  reportedAt?: string
}

type MockDataContextValue = {
  owners: Owner[]
  tenants: Tenant[]
  properties: Property[]
  contracts: Contract[]
  maintenanceRequests: MaintenanceRequest[]
  addOwner: (payload: OwnerInput) => Owner
  updateOwner: (id: string, payload: OwnerInput) => void
  deleteOwner: (id: string) => void
  addTenant: (payload: TenantInput) => Tenant
  updateTenant: (id: string, payload: TenantInput) => void
  deleteTenant: (id: string) => void
  addProperty: (payload: PropertyInput) => Property
  updateProperty: (id: string, payload: PropertyInput) => void
  deleteProperty: (id: string) => void
  addContract: (payload: ContractInput) => Contract
  updateContract: (id: string, payload: ContractInput) => void
  deleteContract: (id: string) => void
  addMaintenanceRequest: (payload: MaintenanceRequestInput) => MaintenanceRequest
  updateMaintenanceRequest: (id: string, payload: MaintenanceRequestInput) => void
  deleteMaintenanceRequest: (id: string) => void
}

const MockDataContext = createContext<MockDataContextValue | undefined>(undefined)

const sanitizeString = (value?: string | null) => {
  if (value === undefined || value === null) {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const sanitizeNumber = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined
  }

  return value
}

const sanitizeUrl = (value?: string | null) => {
  if (value === undefined || value === null) {
    return undefined
  }

  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return undefined
  }

  try {
    const url = new URL(trimmed)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString()
    }
  } catch {
    return undefined
  }

  return undefined
}

const initialOwners: Owner[] = [
  {
    id: 'owner-1',
    name: 'سالم القحطاني',
    phone: '+966500000000',
    email: 'owner@mskn.cloud',
    notes: 'يفضل التواصل عبر البريد الإلكتروني.',
  },
]

const initialTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'نورة الشمري',
    phone: '+966511111111',
    email: 'tenant@mskn.cloud',
    workplace: 'شركة التقنية السعودية',
  },
]

const initialProperties: Property[] = [
  {
    id: 'property-1',
    name: 'شقة العليا',
    address: 'الرياض، حي العليا، شارع الضباب',
    type: 'شقة',
    imageUrl:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=60',
    ownerId: 'owner-1',
    tenantId: 'tenant-1',
    rentAmount: 55000,
    status: 'occupied',
    notes: 'تشمل المواقف.',
  },
]

const initialContracts: Contract[] = [
  {
    id: 'contract-1',
    propertyId: 'property-1',
    tenantId: 'tenant-1',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    rentAmount: 55000,
    paymentCycle: 'monthly',
    status: 'active',
    notes: 'الدفع كل بداية شهر.',
  },
]

const initialMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'maintenance-1',
    propertyId: 'property-1',
    title: 'صيانة المكيف',
    reportedBy: 'نورة الشمري',
    status: 'in_progress',
    priority: 'high',
    description: 'المكيف الرئيسي لا يعمل بشكل جيد.',
    assignedTo: 'شركة تبريد الرياض',
    reportedAt: '2025-10-20',
  },
]

export const MockDataProvider = ({ children }: { children: ReactNode }) => {
  const [owners, setOwners] = useState<Owner[]>(initialOwners)
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants)
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(
    initialMaintenanceRequests,
  )

  const addOwner = (payload: OwnerInput) => {
    const owner: Owner = {
      id: createId(),
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: sanitizeString(payload.email),
      notes: sanitizeString(payload.notes),
    }
    setOwners((prev) => [...prev, owner])
    return owner
  }

  const updateOwner = (id: string, payload: OwnerInput) => {
    setOwners((prev) =>
      prev.map((owner) =>
        owner.id === id
          ? {
              ...owner,
              name: payload.name.trim(),
              phone: payload.phone.trim(),
              email: sanitizeString(payload.email),
              notes: sanitizeString(payload.notes),
            }
          : owner,
      ),
    )
  }

  const deleteOwner = (id: string) => {
    setOwners((prev) => prev.filter((owner) => owner.id !== id))
    setProperties((prev) =>
      prev.map((property) =>
        property.ownerId === id ? { ...property, ownerId: undefined } : property,
      ),
    )
  }

  const addTenant = (payload: TenantInput) => {
    const tenant: Tenant = {
      id: createId(),
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: sanitizeString(payload.email),
      workplace: sanitizeString(payload.workplace),
      notes: sanitizeString(payload.notes),
    }
    setTenants((prev) => [...prev, tenant])
    return tenant
  }

  const updateTenant = (id: string, payload: TenantInput) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === id
          ? {
              ...tenant,
              name: payload.name.trim(),
              phone: payload.phone.trim(),
              email: sanitizeString(payload.email),
              workplace: sanitizeString(payload.workplace),
              notes: sanitizeString(payload.notes),
            }
          : tenant,
      ),
    )
  }

  const deleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((tenant) => tenant.id !== id))
    setProperties((prev) =>
      prev.map((property) =>
        property.tenantId === id ? { ...property, tenantId: undefined, status: 'available' } : property,
      ),
    )
    setContracts((prev) => prev.filter((contract) => contract.tenantId !== id))
  }

  const addProperty = (payload: PropertyInput) => {
    const property: Property = {
      id: createId(),
      name: payload.name.trim(),
      address: payload.address.trim(),
      type: sanitizeString(payload.type),
      imageUrl: sanitizeUrl(payload.imageUrl),
      ownerId: sanitizeString(payload.ownerId),
      tenantId: sanitizeString(payload.tenantId),
      rentAmount: sanitizeNumber(payload.rentAmount ?? undefined),
      status: payload.status ?? 'available',
      notes: sanitizeString(payload.notes),
    }
    setProperties((prev) => [...prev, property])
    return property
  }

  const updateProperty = (id: string, payload: PropertyInput) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === id
          ? {
              ...property,
              name: payload.name.trim(),
              address: payload.address.trim(),
              type: sanitizeString(payload.type),
              imageUrl: sanitizeUrl(payload.imageUrl),
              ownerId: sanitizeString(payload.ownerId),
              tenantId: sanitizeString(payload.tenantId),
              rentAmount: sanitizeNumber(payload.rentAmount ?? undefined),
              status: payload.status ?? 'available',
              notes: sanitizeString(payload.notes),
            }
          : property,
      ),
    )
  }

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((property) => property.id !== id))
    setContracts((prev) => prev.filter((contract) => contract.propertyId !== id))
    setMaintenanceRequests((prev) => prev.filter((request) => request.propertyId !== id))
  }

  const addContract = (payload: ContractInput) => {
    const contract: Contract = {
      id: createId(),
      propertyId: payload.propertyId,
      tenantId: payload.tenantId,
      startDate: payload.startDate,
      endDate: sanitizeString(payload.endDate),
      rentAmount: payload.rentAmount,
      paymentCycle: payload.paymentCycle,
      status: payload.status,
      notes: sanitizeString(payload.notes),
    }
    setContracts((prev) => [...prev, contract])
    setProperties((prev) =>
      prev.map((property) =>
        property.id === payload.propertyId
          ? { ...property, tenantId: payload.tenantId, status: 'occupied' }
          : property,
      ),
    )
    return contract
  }

  const updateContract = (id: string, payload: ContractInput) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === id
          ? {
              ...contract,
              propertyId: payload.propertyId,
              tenantId: payload.tenantId,
              startDate: payload.startDate,
              endDate: sanitizeString(payload.endDate),
              rentAmount: payload.rentAmount,
              paymentCycle: payload.paymentCycle,
              status: payload.status,
              notes: sanitizeString(payload.notes),
            }
          : contract,
      ),
    )
  }

  const deleteContract = (id: string) => {
    setContracts((prev) => prev.filter((contract) => contract.id !== id))
  }

  const addMaintenanceRequest = (payload: MaintenanceRequestInput) => {
    const request: MaintenanceRequest = {
      id: createId(),
      propertyId: payload.propertyId,
      title: payload.title.trim(),
      reportedBy: payload.reportedBy.trim(),
      status: payload.status,
      priority: payload.priority,
      description: sanitizeString(payload.description),
      assignedTo: sanitizeString(payload.assignedTo),
      reportedAt: payload.reportedAt ?? new Date().toISOString().slice(0, 10),
      notes: sanitizeString(payload.notes),
    }
    setMaintenanceRequests((prev) => [...prev, request])
    return request
  }

  const updateMaintenanceRequest = (id: string, payload: MaintenanceRequestInput) => {
    setMaintenanceRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              propertyId: payload.propertyId,
              title: payload.title.trim(),
              reportedBy: payload.reportedBy.trim(),
              status: payload.status,
              priority: payload.priority,
              description: sanitizeString(payload.description),
              assignedTo: sanitizeString(payload.assignedTo),
              reportedAt: payload.reportedAt ?? request.reportedAt,
              notes: sanitizeString(payload.notes),
            }
          : request,
      ),
    )
  }

  const deleteMaintenanceRequest = (id: string) => {
    setMaintenanceRequests((prev) => prev.filter((request) => request.id !== id))
  }

  const value: MockDataContextValue = {
    owners,
    tenants,
    properties,
    contracts,
    maintenanceRequests,
    addOwner,
    updateOwner,
    deleteOwner,
    addTenant,
    updateTenant,
    deleteTenant,
    addProperty,
    updateProperty,
    deleteProperty,
    addContract,
    updateContract,
    deleteContract,
    addMaintenanceRequest,
    updateMaintenanceRequest,
    deleteMaintenanceRequest,
  }

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMockData = () => {
  const context = useContext(MockDataContext)
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider')
  }

  return context
}

