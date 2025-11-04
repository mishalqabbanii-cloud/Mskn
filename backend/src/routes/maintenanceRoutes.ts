import { Router } from 'express';
import {
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  getMaintenanceByProperty,
  getMaintenanceByTenant,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  assignMaintenanceRequest,
  completeMaintenanceRequest,
} from '../controllers/maintenanceController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllMaintenanceRequests);
router.get('/:id', authenticate, getMaintenanceRequestById);
router.get('/property/:propertyId', authenticate, (req, res) => {
  req.query.propertyId = req.params.propertyId;
  getMaintenanceByProperty(req as any, res);
});
router.get('/tenant/:tenantId', authenticate, (req, res) => {
  req.query.tenantId = req.params.tenantId;
  getMaintenanceByTenant(req as any, res);
});
router.post('/', authenticate, authorize('tenant', 'property_manager'), createMaintenanceRequest);
router.put('/:id', authenticate, authorize('property_manager'), updateMaintenanceRequest);
router.post('/:id/assign', authenticate, authorize('property_manager'), assignMaintenanceRequest);
router.post('/:id/complete', authenticate, authorize('property_manager'), completeMaintenanceRequest);

export default router;

