import { Response } from 'express';
import { tenants, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import db from '../db';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const tenantSchema = z.object({
  userId: z.string(),
  propertyId: z.string(),
  leaseId: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  moveInDate: z.string(),
  moveOutDate: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

export const getAllTenants = async (req: AuthRequest, res: Response) => {
  try {
    const allTenants = await db
      .select({
        id: tenants.id,
        userId: tenants.userId,
        propertyId: tenants.propertyId,
        leaseId: tenants.leaseId,
        emergencyContactName: tenants.emergencyContactName,
        emergencyContactPhone: tenants.emergencyContactPhone,
        emergencyContactRelationship: tenants.emergencyContactRelationship,
        moveInDate: tenants.moveInDate,
        moveOutDate: tenants.moveOutDate,
        status: tenants.status,
        createdAt: tenants.createdAt,
        updatedAt: tenants.updatedAt,
      })
      .from(tenants);

    res.json(allTenants);
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTenantById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTenantsByProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.query;
    
    if (!propertyId || typeof propertyId !== 'string') {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const propertyTenants = await db
      .select()
      .from(tenants)
      .where(eq(tenants.propertyId, propertyId));

    res.json(propertyTenants);
  } catch (error) {
    console.error('Get tenants by property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTenant = async (req: AuthRequest, res: Response) => {
  try {
    const validated = tenantSchema.parse(req.body);

    const [tenant] = await db
      .insert(tenants)
      .values({
        ...validated,
        moveInDate: new Date(validated.moveInDate),
        moveOutDate: validated.moveOutDate ? new Date(validated.moveOutDate) : undefined,
      })
      .returning();

    res.status(201).json(tenant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create tenant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.moveInDate) {
      updateData.moveInDate = new Date(updateData.moveInDate);
    }
    if (updateData.moveOutDate) {
      updateData.moveOutDate = new Date(updateData.moveOutDate);
    }
    updateData.updatedAt = new Date();

    const [tenant] = await db
      .update(tenants)
      .set(updateData)
      .where(eq(tenants.id, id))
      .returning();

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(tenants).where(eq(tenants.id, id));
    res.status(204).send();
  } catch (error) {
    console.error('Delete tenant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

