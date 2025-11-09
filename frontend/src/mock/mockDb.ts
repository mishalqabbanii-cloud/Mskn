import { createId } from '../utils/id'
import type {
  Contract,
  MaintenanceRequest,
  Owner,
  Property,
  Tenant,
} from '../context/MockDataContext'

export type UserRole = 'manager' | 'owner' | 'tenant'

export type UserRecord = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  password: string
  profileId?: string
}

export type RegisterUserInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  password: string
}

export type LoginInput = {
  email: string
  password: string
}

export type DashboardSources = {
  properties: Property[]
  tenants: Tenant[]
  owners: Owner[]
  contracts: Contract[]
  maintenanceRequests: MaintenanceRequest[]
}

export type ManagerDashboardData = {
  metrics: {
    totalProperties: number
    occupiedProperties: number
    vacantProperties: number
    tenantCount: number
    openMaintenanceCount: number
  }
  quickLinks: Array<{ labelKey: string; to: string }>
}

export type OwnerDashboardData = {
  properties: Property[]
  contracts: Contract[]
  revenueSummary: {
    totalAnnualRent: number
    activeContracts: number
  }
}

export type TenantDashboardData = {
  contracts: Contract[]
  nextPayment?: {
    propertyName: string
    amount: number
    dueDate: string
  }
  maintenanceRequests: MaintenanceRequest[]
}

const users: UserRecord[] = [
  {
    id: 'user-manager-1',
    firstName: 'ليان',
    lastName: 'السبيعي',
    email: 'manager@mskn.cloud',
    phone: '0551111111',
    role: 'manager',
    password: '123456',
  },
  {
    id: 'user-owner-1',
    firstName: 'سالم',
    lastName: 'القحطاني',
    email: 'owner@mskn.cloud',
    phone: '+966500000000',
    role: 'owner',
    password: '123456',
    profileId: 'owner-1',
  },
  {
    id: 'user-tenant-1',
    firstName: 'نورة',
    lastName: 'الشمري',
    email: 'tenant@mskn.cloud',
    phone: '+966511111111',
    role: 'tenant',
    password: '123456',
    profileId: 'tenant-1',
  },
]

export const registerUser = async (input: RegisterUserInput) => {
  const user: UserRecord = {
    id: createId(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    role: input.role,
    password: input.password,
  }

  users.push(user)
  return { user }
}

export const linkUserProfile = (userId: string, profileId: string) => {
  const index = users.findIndex((user) => user.id === userId)
  if (index !== -1) {
    users[index] = { ...users[index], profileId }
  }
}

export const loginUser = async (input: LoginInput) => {
  const email = input.email.trim().toLowerCase()
  const user = users.find((candidate) => candidate.email === email)

  if (!user || user.password !== input.password) {
    throw new Error('invalid-credentials')
  }

  const token = `mock-token-${user.id}`

  return {
    token,
    user,
  }
}

const formatCurrency = (value: number) => {
  return Number.isFinite(value) ? Math.max(value, 0) : 0
}

export const getDashboardDataByRole = async (
  role: UserRole,
  profileId: string | undefined,
  sources: DashboardSources,
) => {
  if (role === 'manager') {
    const totalProperties = sources.properties.length
    const occupiedProperties = sources.properties.filter(
      (property) => property.status === 'occupied',
    ).length
    const vacantProperties = sources.properties.filter(
      (property) => property.status === 'available',
    ).length
    const tenantCount = sources.tenants.length
    const openMaintenanceCount = sources.maintenanceRequests.filter(
      (request) => request.status !== 'closed',
    ).length

    const data: ManagerDashboardData = {
      metrics: {
        totalProperties,
        occupiedProperties,
        vacantProperties,
        tenantCount,
        openMaintenanceCount,
      },
      quickLinks: [
        { labelKey: 'dashboard.manager.quickLinks.addProperty', to: '/properties' },
        { labelKey: 'dashboard.manager.quickLinks.addTenant', to: '/tenants' },
        { labelKey: 'dashboard.manager.quickLinks.addContract', to: '/contracts' },
      ],
    }

    return data
  }

  if (role === 'owner') {
    const ownedProperties = profileId
      ? sources.properties.filter((property) => property.ownerId === profileId)
      : []

    const relatedContracts = profileId
      ? sources.contracts.filter((contract) =>
          ownedProperties.some((property) => property.id === contract.propertyId),
        )
      : []

    const totalAnnualRent = relatedContracts.reduce((acc, contract) => acc + contract.rentAmount, 0)

    const data: OwnerDashboardData = {
      properties: ownedProperties,
      contracts: relatedContracts,
      revenueSummary: {
        totalAnnualRent: formatCurrency(totalAnnualRent),
        activeContracts: relatedContracts.filter((contract) => contract.status === 'active').length,
      },
    }
    return data
  }

  const tenantContracts = profileId
    ? sources.contracts.filter((contract) => contract.tenantId === profileId)
    : []

  const tenantProperties = tenantContracts
    .map((contract) => sources.properties.find((property) => property.id === contract.propertyId))
    .filter((property): property is Property => Boolean(property))

  const relevantMaintenance = profileId
    ? sources.maintenanceRequests.filter((request) =>
        tenantProperties.some((property) => property.id === request.propertyId),
      )
    : []

  const nextContract = tenantContracts.at(0)
  const propertyName = nextContract
    ? tenantProperties.find((property) => property.id === nextContract.propertyId)?.name ?? ''
    : ''

  const nextPayment = nextContract
    ? {
        propertyName,
        amount: formatCurrency(nextContract.rentAmount / (nextContract.paymentCycle === 'monthly' ? 12 : 1)),
        dueDate: nextContract.startDate,
      }
    : undefined

  const data: TenantDashboardData = {
    contracts: tenantContracts,
    maintenanceRequests: relevantMaintenance,
    nextPayment,
  }

  return data
}

export const getUserByToken = (token: string) => {
  const match = token.replace('mock-token-', '')
  return users.find((user) => user.id === match)
}

