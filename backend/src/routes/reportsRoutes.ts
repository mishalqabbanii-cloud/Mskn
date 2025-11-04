import { Router } from 'express';
import { getPropertyReport, getOwnerReport } from '../controllers/reportsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/property/:id', authenticate, authorize('property_manager', 'property_owner'), getPropertyReport);
router.get('/owner/:id', authenticate, authorize('property_owner'), getOwnerReport);

export default router;

