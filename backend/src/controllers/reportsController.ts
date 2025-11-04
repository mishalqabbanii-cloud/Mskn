import { Response } from 'express';
import { payments, properties, maintenanceRequests } from '../db/schema';
import { eq, and, sum, sql, inArray } from 'drizzle-orm';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

export const getPropertyReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { period } = req.query;

    // Get payments for the property
    const propertyPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.propertyId, id));

    // Filter by period if provided
    let filteredPayments = propertyPayments;
    if (period === 'month') {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      filteredPayments = propertyPayments.filter(p => new Date(p.dueDate) >= startDate);
    } else if (period === 'quarter') {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      filteredPayments = propertyPayments.filter(p => new Date(p.dueDate) >= startDate);
    } else if (period === 'year') {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      filteredPayments = propertyPayments.filter(p => new Date(p.dueDate) >= startDate);
    }

    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    const totalIncome = paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const rentCollected = paidPayments
      .filter(p => p.type === 'rent')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    // Get maintenance costs
    const maintenanceCosts = await db
      .select()
      .from(maintenanceRequests)
      .where(eq(maintenanceRequests.propertyId, id));

    const totalMaintenance = maintenanceCosts
      .filter(m => m.actualCost)
      .reduce((sum, m) => sum + parseFloat(m.actualCost || '0'), 0);

    // Estimate expenses (in a real app, you'd have an expenses table)
    const totalExpenses = totalMaintenance + totalIncome * 0.2; // 20% for other expenses
    const netIncome = totalIncome - totalExpenses;

    const report = {
      id: `report_${id}_${period || 'all'}`,
      propertyId: id,
      period: period || 'all',
      totalIncome,
      totalExpenses,
      netIncome,
      rentCollected,
      expenses: {
        maintenance: totalMaintenance,
        utilities: totalIncome * 0.05,
        taxes: totalIncome * 0.1,
        insurance: totalIncome * 0.03,
        other: totalIncome * 0.02,
      },
      generatedDate: new Date().toISOString(),
    };

    res.json(report);
  } catch (error) {
    console.error('Get property report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOwnerReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { period } = req.query;

    // Get all properties owned by this owner
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, id));

    const propertyIds = ownerProperties.map(p => p.id);

    // Get all payments for owner's properties
    const allPayments = await db
      .select()
      .from(payments)
      .where(inArray(payments.propertyId, propertyIds));

    // Filter by period if provided
    let filteredPayments = allPayments;
    if (period === 'month') {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      filteredPayments = allPayments.filter(p => new Date(p.dueDate) >= startDate);
    } else if (period === 'quarter') {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      filteredPayments = allPayments.filter(p => new Date(p.dueDate) >= startDate);
    } else if (period === 'year') {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      filteredPayments = allPayments.filter(p => new Date(p.dueDate) >= startDate);
    }

    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    const totalIncome = paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const rentCollected = paidPayments
      .filter(p => p.type === 'rent')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    // Get maintenance costs for all properties
    const allMaintenance = await db
      .select()
      .from(maintenanceRequests)
      .where(inArray(maintenanceRequests.propertyId, propertyIds));

    const totalMaintenance = allMaintenance
      .filter(m => m.actualCost)
      .reduce((sum, m) => sum + parseFloat(m.actualCost || '0'), 0);

    const totalExpenses = totalMaintenance + totalIncome * 0.2;
    const netIncome = totalIncome - totalExpenses;

    const report = {
      id: `report_owner_${id}_${period || 'all'}`,
      ownerId: id,
      period: period || 'all',
      totalIncome,
      totalExpenses,
      netIncome,
      rentCollected,
      expenses: {
        maintenance: totalMaintenance,
        utilities: totalIncome * 0.05,
        taxes: totalIncome * 0.1,
        insurance: totalIncome * 0.03,
        other: totalIncome * 0.02,
      },
      generatedDate: new Date().toISOString(),
    };

    res.json(report);
  } catch (error) {
    console.error('Get owner report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

