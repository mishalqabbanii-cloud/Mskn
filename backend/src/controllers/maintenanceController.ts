import { Response } from 'express';
import { maintenanceRequests } from '../db/schema';
import { eq } from 'drizzle-orm';
import db from '../db';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const maintenanceSchema = z.object({
  propertyId: z.string(),
  tenantId: z.string(),
  title: z.string().min(1),
  description: z.string().min(10),
  category: z.enum(['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'emergency']).optional(),
});

export const getAllMaintenanceRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { role, id } = req.user!;
    
    let allRequests;
    if (role === 'tenant') {
      allRequests = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.tenantId, id));
    } else {
      allRequests = await db.select().from(maintenanceRequests);
    }

    res.json(allRequests);
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMaintenanceRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [request] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, id)).limit(1);

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Get maintenance request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMaintenanceByProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.query;
    
    if (!propertyId || typeof propertyId !== 'string') {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const propertyRequests = await db
      .select()
      .from(maintenanceRequests)
      .where(eq(maintenanceRequests.propertyId, propertyId));

    res.json(propertyRequests);
  } catch (error) {
    console.error('Get maintenance by property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMaintenanceByTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    const tenantRequests = await db
      .select()
      .from(maintenanceRequests)
      .where(eq(maintenanceRequests.tenantId, tenantId));

    res.json(tenantRequests);
  } catch (error) {
    console.error('Get maintenance by tenant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMaintenanceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const validated = maintenanceSchema.parse(req.body);

    const [request] = await db
      .insert(maintenanceRequests)
      .values({
        ...validated,
        requestedDate: new Date(),
        status: 'pending',
      })
      .returning();

    res.status(201).json(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create maintenance request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMaintenanceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    updateData.updatedAt = new Date();

    const [request] = await db
      .update(maintenanceRequests)
      .set(updateData)
      .where(eq(maintenanceRequests.id, id))
      .returning();

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Update maintenance request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const assignMaintenanceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const [request] = await db
      .update(maintenanceRequests)
      .set({
        assignedTo,
        status: 'in_progress',
        updatedAt: new Date(),
      })
      .where(eq(maintenanceRequests.id, id))
      .returning();

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Assign maintenance request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const completeMaintenanceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { completedDate, actualCost, notes } = req.body;

    const updateData: any = {
      status: 'completed',
      completedDate: new Date(completedDate),
      updatedAt: new Date(),
    };

    if (actualCost !== undefined) {
      updateData.actualCost = actualCost.toString();
    }
    if (notes) {
      updateData.notes = notes;
    }

    const [request] = await db
      .update(maintenanceRequests)
      .set(updateData)
      .where(eq(maintenanceRequests.id, id))
      .returning();

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Complete maintenance request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

