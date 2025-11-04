import { Response } from 'express';
import { properties, tenants } from '../db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import db from '../db';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const propertySchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  type: z.enum(['apartment', 'house', 'commercial', 'condo']),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFeet: z.number().min(0).optional(),
  rentAmount: z.number().min(0),
  status: z.enum(['available', 'occupied', 'maintenance']),
  ownerId: z.string(),
  managerId: z.string().optional(),
  description: z.string().optional(),
});

export const getAllProperties = async (req: AuthRequest, res: Response) => {
  try {
    const { role, id } = req.user!;
    
    let allProperties;
    if (role === 'property_owner') {
      allProperties = await db.select().from(properties).where(eq(properties.ownerId, id));
    } else if (role === 'property_manager') {
      allProperties = await db.select().from(properties).where(eq(properties.managerId, id));
    } else {
      // Tenant can see properties they're assigned to (via tenants table)
      const tenantRecords = await db
        .select({ propertyId: tenants.propertyId })
        .from(tenants)
        .where(eq(tenants.userId, id));
      
      const propertyIds = tenantRecords.map(t => t.propertyId);
      if (propertyIds.length > 0) {
        allProperties = await db
          .select()
          .from(properties)
          .where(inArray(properties.id, propertyIds));
      } else {
        allProperties = [];
      }
    }

    res.json(allProperties);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user!;

    const [property] = await db.select().from(properties).where(eq(properties.id, id)).limit(1);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check access permissions
    if (role === 'property_owner' && property.ownerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (role === 'property_manager' && property.managerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const validated = propertySchema.parse(req.body);
    const { id: userId, role } = req.user!;

    // Only managers and owners can create properties
    if (role !== 'property_manager' && role !== 'property_owner') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // If owner, ensure ownerId matches
    if (role === 'property_owner' && validated.ownerId !== userId) {
      return res.status(403).json({ message: 'Cannot create property for another owner' });
    }

    const [property] = await db
      .insert(properties)
      .values({
        ...validated,
        rentAmount: validated.rentAmount.toString(),
      })
      .returning();

    res.status(201).json(property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user!;

    const [existing] = await db.select().from(properties).where(eq(properties.id, id)).limit(1);

    if (!existing) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check permissions
    if (role === 'property_owner' && existing.ownerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (role === 'property_manager' && existing.managerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = { ...req.body };
    if (updateData.rentAmount) {
      updateData.rentAmount = updateData.rentAmount.toString();
    }
    updateData.updatedAt = new Date();

    const [property] = await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, id))
      .returning();

    res.json(property);
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user!;

    const [existing] = await db.select().from(properties).where(eq(properties.id, id)).limit(1);

    if (!existing) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Only owner can delete
    if (role !== 'property_owner' || existing.ownerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.delete(properties).where(eq(properties.id, id));

    res.status(204).send();
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

