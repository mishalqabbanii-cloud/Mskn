import { pgTable, text, timestamp, varchar, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['property_manager', 'tenant', 'property_owner']);
export const propertyTypeEnum = pgEnum('property_type', ['apartment', 'house', 'commercial', 'condo']);
export const propertyStatusEnum = pgEnum('property_status', ['available', 'occupied', 'maintenance']);
export const leaseStatusEnum = pgEnum('lease_status', ['active', 'expired', 'terminated']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'overdue', 'partial']);
export const paymentTypeEnum = pgEnum('payment_type', ['rent', 'deposit', 'fee', 'maintenance']);
export const paymentMethodEnum = pgEnum('payment_method', ['bank_transfer', 'credit_card', 'check', 'cash']);
export const maintenanceCategoryEnum = pgEnum('maintenance_category', ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other']);
export const maintenancePriorityEnum = pgEnum('maintenance_priority', ['low', 'medium', 'high', 'emergency']);
export const maintenanceStatusEnum = pgEnum('maintenance_status', ['pending', 'in_progress', 'completed', 'cancelled']);
export const documentTypeEnum = pgEnum('document_type', ['lease', 'invoice', 'receipt', 'maintenance', 'notice', 'other']);

// Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  phone: varchar('phone', { length: 50 }),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Properties Table
export const properties = pgTable('properties', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  zipCode: varchar('zip_code', { length: 10 }).notNull(),
  type: propertyTypeEnum('type').notNull(),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  squareFeet: integer('square_feet'),
  rentAmount: decimal('rent_amount', { precision: 10, scale: 2 }).notNull(),
  status: propertyStatusEnum('status').notNull().default('available'),
  ownerId: text('owner_id').notNull().references(() => users.id),
  managerId: text('manager_id').references(() => users.id),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tenants Table
export const tenants = pgTable('tenants', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  userId: text('user_id').notNull().references(() => users.id),
  propertyId: text('property_id').notNull().references(() => properties.id),
  leaseId: text('lease_id').references(() => leases.id),
  emergencyContactName: varchar('emergency_contact_name', { length: 255 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 50 }),
  emergencyContactRelationship: varchar('emergency_contact_relationship', { length: 100 }),
  moveInDate: timestamp('move_in_date').notNull(),
  moveOutDate: timestamp('move_out_date'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leases Table
export const leases = pgTable('leases', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  propertyId: text('property_id').notNull().references(() => properties.id),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  monthlyRent: decimal('monthly_rent', { precision: 10, scale: 2 }).notNull(),
  deposit: decimal('deposit', { precision: 10, scale: 2 }).notNull(),
  status: leaseStatusEnum('status').notNull().default('active'),
  terms: text('terms'),
  signedDate: timestamp('signed_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payments Table
export const payments = pgTable('payments', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  leaseId: text('lease_id').notNull().references(() => leases.id),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  propertyId: text('property_id').notNull().references(() => properties.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp('due_date').notNull(),
  paidDate: timestamp('paid_date'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  type: paymentTypeEnum('type').notNull(),
  method: paymentMethodEnum('method'),
  transactionId: varchar('transaction_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Maintenance Requests Table
export const maintenanceRequests = pgTable('maintenance_requests', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  propertyId: text('property_id').notNull().references(() => properties.id),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: maintenanceCategoryEnum('category').notNull(),
  priority: maintenancePriorityEnum('priority').notNull().default('medium'),
  status: maintenanceStatusEnum('status').notNull().default('pending'),
  requestedDate: timestamp('requested_date').defaultNow().notNull(),
  completedDate: timestamp('completed_date'),
  assignedTo: text('assigned_to').references(() => users.id),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 10, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Documents Table
export const documents = pgTable('documents', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  name: varchar('name', { length: 255 }).notNull(),
  type: documentTypeEnum('type').notNull(),
  url: text('url').notNull(),
  propertyId: text('property_id').references(() => properties.id),
  tenantId: text('tenant_id').references(() => tenants.id),
  leaseId: text('lease_id').references(() => leases.id),
  uploadedDate: timestamp('uploaded_date').defaultNow().notNull(),
  uploadedBy: text('uploaded_by').notNull().references(() => users.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedProperties: many(properties),
  managedProperties: many(properties),
  tenants: many(tenants),
  leases: many(leases),
  payments: many(payments),
  maintenanceRequests: many(maintenanceRequests),
  documents: many(documents),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
  }),
  manager: one(users, {
    fields: [properties.managerId],
    references: [users.id],
  }),
  tenants: many(tenants),
  leases: many(leases),
  payments: many(payments),
  maintenanceRequests: many(maintenanceRequests),
  documents: many(documents),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  user: one(users, {
    fields: [tenants.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [tenants.propertyId],
    references: [properties.id],
  }),
  lease: one(leases, {
    fields: [tenants.leaseId],
    references: [leases.id],
  }),
  leases: many(leases),
  payments: many(payments),
  maintenanceRequests: many(maintenanceRequests),
}));

export const leasesRelations = relations(leases, ({ one, many }) => ({
  property: one(properties, {
    fields: [leases.propertyId],
    references: [properties.id],
  }),
  tenant: one(tenants, {
    fields: [leases.tenantId],
    references: [tenants.id],
  }),
  payments: many(payments),
  documents: many(documents),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  lease: one(leases, {
    fields: [payments.leaseId],
    references: [leases.id],
  }),
  tenant: one(tenants, {
    fields: [payments.tenantId],
    references: [tenants.id],
  }),
  property: one(properties, {
    fields: [payments.propertyId],
    references: [properties.id],
  }),
}));

export const maintenanceRequestsRelations = relations(maintenanceRequests, ({ one }) => ({
  property: one(properties, {
    fields: [maintenanceRequests.propertyId],
    references: [properties.id],
  }),
  tenant: one(tenants, {
    fields: [maintenanceRequests.tenantId],
    references: [tenants.id],
  }),
  assignedUser: one(users, {
    fields: [maintenanceRequests.assignedTo],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  property: one(properties, {
    fields: [documents.propertyId],
    references: [properties.id],
  }),
  tenant: one(tenants, {
    fields: [documents.tenantId],
    references: [tenants.id],
  }),
  lease: one(leases, {
    fields: [documents.leaseId],
    references: [leases.id],
  }),
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

