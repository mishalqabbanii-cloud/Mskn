import { Router } from 'express';
import {
  getAllDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
} from '../controllers/documentsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllDocuments);
router.get('/:id', authenticate, getDocumentById);
router.post('/upload', authenticate, authorize('property_manager'), uploadDocument);
router.delete('/:id', authenticate, authorize('property_manager'), deleteDocument);

export default router;

