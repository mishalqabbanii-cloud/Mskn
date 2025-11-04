import { Router } from 'express';
import {
  getAllTenants,
  getTenantById,
  getTenantsByProperty,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('property_manager'), getAllTenants);
router.get('/:id', authenticate, authorize('property_manager'), getTenantById);
router.get('/property/:propertyId', authenticate, authorize('property_manager'), (req, res) => {
  req.query.propertyId = req.params.propertyId;
  getTenantsByProperty(req as any, res);
});
router.post('/', authenticate, authorize('property_manager'), createTenant);
router.put('/:id', authenticate, authorize('property_manager'), updateTenant);
router.delete('/:id', authenticate, authorize('property_manager'), deleteTenant);

export default router;

