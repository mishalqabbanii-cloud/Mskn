import { Response } from 'express';
import { leases } from '../db/schema';
import { eq } from 'drizzle-orm';
import db from '../db';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const leaseSchema = z.object({
  propertyId: z.string(),
  tenantId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  monthlyRent: z.number().min(0),
  deposit: z.number().min(0),
  status: z.enum(['active', 'expired', 'terminated']).optional(),
  terms: z.string().optional(),
  signedDate: z.string(),
});

export const getAllLeases = async (req: AuthRequest, res: Response) => {
  try {
    const { role, id } = req.user!;
    
    let allLeases;
    if (role === 'tenant') {
      // Get tenant's leases
      const tenantLeases = await db
        .select()
        .from(leases)
        .innerJoin(leases, eq(leases.tenantId, leases.tenantId));
      allLeases = await db.select().from(leases);
    } else {
      allLeases = await db.select().from(leases);
    }

    res.json(allLeases);
  } catch (error) {
    console.error('Get leases error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLeaseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [lease] = await db.select().from(leases).where(eq(leases.id, id)).limit(1);

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    res.json(lease);
  } catch (error) {
    console.error('Get lease error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLeasesByProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.query;
    
    if (!propertyId || typeof propertyId !== 'string') {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const propertyLeases = await db
      .select()
      .from(leases)
      .where(eq(leases.propertyId, propertyId));

    res.json(propertyLeases);
  } catch (error) {
    console.error('Get leases by property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLeasesByTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    const tenantLeases = await db
      .select()
      .from(leases)
      .where(eq(leases.tenantId, tenantId));

    res.json(tenantLeases);
  } catch (error) {
    console.error('Get leases by tenant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createLease = async (req: AuthRequest, res: Response) => {
  try {
    const validated = leaseSchema.parse(req.body);

    const [lease] = await db
      .insert(leases)
      .values({
        ...validated,
        monthlyRent: validated.monthlyRent.toString(),
        deposit: validated.deposit.toString(),
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        signedDate: new Date(validated.signedDate),
      })
      .returning();

    res.status(201).json(lease);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create lease error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateLease = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.monthlyRent) {
      updateData.monthlyRent = updateData.monthlyRent.toString();
    }
    if (updateData.deposit) {
      updateData.deposit = updateData.deposit.toString();
    }
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }
    if (updateData.signedDate) {
      updateData.signedDate = new Date(updateData.signedDate);
    }
    updateData.updatedAt = new Date();

    const [lease] = await db
      .update(leases)
      .set(updateData)
      .where(eq(leases.id, id))
      .returning();

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    res.json(lease);
  } catch (error) {
    console.error('Update lease error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteLease = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(leases).where(eq(leases.id, id));
    res.status(204).send();
  } catch (error) {
    console.error('Delete lease error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

