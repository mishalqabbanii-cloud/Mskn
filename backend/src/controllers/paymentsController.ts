import { Response } from 'express';
import { payments } from '../db/schema';
import { eq } from 'drizzle-orm';
import db from '../db';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const paymentSchema = z.object({
  leaseId: z.string(),
  tenantId: z.string(),
  propertyId: z.string(),
  amount: z.number().min(0),
  dueDate: z.string(),
  paidDate: z.string().optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'partial']).optional(),
  type: z.enum(['rent', 'deposit', 'fee', 'maintenance']),
  method: z.enum(['bank_transfer', 'credit_card', 'check', 'cash']).optional(),
  transactionId: z.string().optional(),
});

export const getAllPayments = async (req: AuthRequest, res: Response) => {
  try {
    const { role, id } = req.user!;
    
    let allPayments;
    if (role === 'tenant') {
      // Get tenant's payments
      allPayments = await db.select().from(payments).where(eq(payments.tenantId, id));
    } else {
      allPayments = await db.select().from(payments);
    }

    res.json(allPayments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPaymentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [payment] = await db.select().from(payments).where(eq(payments.id, id)).limit(1);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPaymentsByTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    const tenantPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.tenantId, tenantId));

    res.json(tenantPayments);
  } catch (error) {
    console.error('Get payments by tenant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPaymentsByProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.query;
    
    if (!propertyId || typeof propertyId !== 'string') {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const propertyPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.propertyId, propertyId));

    res.json(propertyPayments);
  } catch (error) {
    console.error('Get payments by property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const validated = paymentSchema.parse(req.body);

    const [payment] = await db
      .insert(payments)
      .values({
        ...validated,
        amount: validated.amount.toString(),
        dueDate: new Date(validated.dueDate),
        paidDate: validated.paidDate ? new Date(validated.paidDate) : undefined,
      })
      .returning();

    res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.amount) {
      updateData.amount = updateData.amount.toString();
    }
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }
    if (updateData.paidDate) {
      updateData.paidDate = new Date(updateData.paidDate);
    }
    updateData.updatedAt = new Date();

    const [payment] = await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const recordPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { paidDate, method, transactionId } = req.body;

    const [payment] = await db
      .update(payments)
      .set({
        paidDate: new Date(paidDate),
        method,
        transactionId,
        status: 'paid',
        updatedAt: new Date(),
      })
      .where(eq(payments.id, id))
      .returning();

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

