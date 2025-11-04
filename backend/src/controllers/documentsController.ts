import { Response } from 'express';
import { documents } from '../db/schema';
import { eq } from 'drizzle-orm';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

export const getAllDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { role, id } = req.user!;
    
    let allDocuments;
    if (role === 'tenant') {
      allDocuments = await db.select().from(documents).where(eq(documents.tenantId, id));
    } else {
      allDocuments = await db.select().from(documents);
    }

    res.json(allDocuments);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [document] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, propertyId, tenantId, leaseId } = req.body;
    const { id: userId } = req.user!;

    // In a real implementation, you would upload the file to storage (S3, local filesystem, etc.)
    // For now, we'll store the file metadata
    const fileUrl = `/uploads/${Date.now()}-${name}`;

    const [document] = await db
      .insert(documents)
      .values({
        name,
        type,
        url: fileUrl,
        propertyId: propertyId || null,
        tenantId: tenantId || null,
        leaseId: leaseId || null,
        uploadedBy: userId,
      })
      .returning();

    res.status(201).json(document);
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(documents).where(eq(documents.id, id));
    res.status(204).send();
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

