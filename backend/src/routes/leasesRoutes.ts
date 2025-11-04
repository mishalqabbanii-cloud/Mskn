import { Router } from 'express';
import {
  getAllLeases,
  getLeaseById,
  getLeasesByProperty,
  getLeasesByTenant,
  createLease,
  updateLease,
  deleteLease,
} from '../controllers/leasesController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllLeases);
router.get('/:id', authenticate, getLeaseById);
router.get('/property/:propertyId', authenticate, (req, res) => {
  req.query.propertyId = req.params.propertyId;
  getLeasesByProperty(req as any, res);
});
router.get('/tenant/:tenantId', authenticate, (req, res) => {
  req.query.tenantId = req.params.tenantId;
  getLeasesByTenant(req as any, res);
});
router.post('/', authenticate, authorize('property_manager'), createLease);
router.put('/:id', authenticate, authorize('property_manager'), updateLease);
router.delete('/:id', authenticate, authorize('property_manager'), deleteLease);

export default router;

