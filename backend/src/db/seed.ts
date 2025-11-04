import db from './index';
import { users, properties, tenants, leases, payments, maintenanceRequests } from './schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

async function seed() {
  try {
    console.log('Seeding database...');

    // Clear existing data - delete in reverse order of dependencies
    try {
      await db.delete(payments);
      await db.delete(maintenanceRequests);
      await db.delete(leases);
      await db.delete(tenants);
      await db.delete(properties);
      await db.delete(users);
    } catch (e) {
      // Tables might not exist or be empty, continue
      console.log('Note: Some tables may have been empty');
    }

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert users with explicit UUIDs to avoid conflicts
    const managerId = randomUUID();
    const tenantUserId = randomUUID();
    const ownerId = randomUUID();

    const manager = (await db.insert(users).values({
      id: managerId,
      email: 'manager@mskn.com',
      password: hashedPassword,
      name: 'John Manager',
      role: 'property_manager',
      phone: '555-0101',
    }).returning())[0];

    const tenantUser = (await db.insert(users).values({
      id: tenantUserId,
      email: 'tenant@mskn.com',
      password: hashedPassword,
      name: 'Jane Tenant',
      role: 'tenant',
      phone: '555-0102',
    }).returning())[0];

    const owner = (await db.insert(users).values({
      id: ownerId,
      email: 'owner@mskn.com',
      password: hashedPassword,
      name: 'Bob Owner',
      role: 'property_owner',
      phone: '555-0103',
    }).returning())[0];

    console.log('Users created:', manager.email, tenantUser.email, owner.email);

    // Insert properties with explicit UUIDs
    const property1Id = randomUUID();
    const property2Id = randomUUID();

    const property1 = (await db.insert(properties).values({
      id: property1Id,
      name: 'Sunset Apartments',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      type: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 1200,
      rentAmount: '1200.00',
      status: 'occupied',
      ownerId: owner.id,
      managerId: manager.id,
      description: 'Beautiful 2-bedroom apartment in downtown area',
    }).returning())[0];

    const property2 = (await db.insert(properties).values({
      id: property2Id,
      name: 'Oakwood House',
      address: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      type: 'house',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      rentAmount: '1800.00',
      status: 'available',
      ownerId: owner.id,
      managerId: manager.id,
      description: 'Spacious 3-bedroom house with backyard',
    }).returning())[0];

    console.log('Properties created:', property1.name, property2.name);

    // Insert tenant with explicit UUID
    const tenantId = randomUUID();
    const tenant = (await db.insert(tenants).values({
      id: tenantId,
      userId: tenantUser.id,
      propertyId: property1.id,
      moveInDate: new Date('2024-01-01'),
      status: 'active',
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '555-9999',
      emergencyContactRelationship: 'Parent',
    }).returning())[0];

    console.log('Tenant created');

    // Insert lease with explicit UUID
    const leaseId = randomUUID();
    const lease = (await db.insert(leases).values({
      id: leaseId,
      propertyId: property1.id,
      tenantId: tenant.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      monthlyRent: '1200.00',
      deposit: '2400.00',
      status: 'active',
      signedDate: new Date('2023-12-15'),
    }).returning())[0];

    // Update tenant with lease ID
    await db.update(tenants).set({ leaseId: lease.id }).where(eq(tenants.id, tenant.id));

    console.log('Lease created');

    // Insert payments with explicit UUIDs
    const payment1Id = randomUUID();
    const payment2Id = randomUUID();

    await db.insert(payments).values([
      {
        id: payment1Id,
        leaseId: lease.id,
        tenantId: tenant.id,
        propertyId: property1.id,
        amount: '1200.00',
        dueDate: new Date('2024-02-01'),
        paidDate: new Date('2024-01-28'),
        status: 'paid',
        type: 'rent',
        method: 'bank_transfer',
      },
      {
        id: payment2Id,
        leaseId: lease.id,
        tenantId: tenant.id,
        propertyId: property1.id,
        amount: '1200.00',
        dueDate: new Date('2024-03-01'),
        status: 'pending',
        type: 'rent',
      },
    ]);

    console.log('Payments created');

    // Insert maintenance requests with explicit UUIDs
    const maintenance1Id = randomUUID();
    const maintenance2Id = randomUUID();

    await db.insert(maintenanceRequests).values([
      {
        id: maintenance1Id,
        propertyId: property1.id,
        tenantId: tenant.id,
        title: 'Leaky Faucet',
        description: 'The kitchen faucet has been leaking for the past week',
        category: 'plumbing',
        priority: 'medium',
        status: 'pending',
        requestedDate: new Date('2024-02-10'),
      },
      {
        id: maintenance2Id,
        propertyId: property1.id,
        tenantId: tenant.id,
        title: 'AC Not Working',
        description: 'Air conditioning unit stopped working in the living room',
        category: 'hvac',
        priority: 'high',
        status: 'in_progress',
        requestedDate: new Date('2024-02-05'),
        assignedTo: manager.id,
      },
    ]);

    console.log('Maintenance requests created');

    console.log('✅ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Manager: manager@mskn.com / password123');
    console.log('Tenant: tenant@mskn.com / password123');
    console.log('Owner: owner@mskn.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();

