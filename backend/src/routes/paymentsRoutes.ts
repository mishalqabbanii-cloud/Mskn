import { Router } from 'express';
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByTenant,
  getPaymentsByProperty,
  createPayment,
  updatePayment,
  recordPayment,
} from '../controllers/paymentsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllPayments);
router.get('/:id', authenticate, getPaymentById);
router.get('/tenant/:tenantId', authenticate, (req, res) => {
  req.query.tenantId = req.params.tenantId;
  getPaymentsByTenant(req as any, res);
});
router.get('/property/:propertyId', authenticate, (req, res) => {
  req.query.propertyId = req.params.propertyId;
  getPaymentsByProperty(req as any, res);
});
router.post('/', authenticate, authorize('property_manager', 'tenant'), createPayment);
router.put('/:id', authenticate, authorize('property_manager'), updatePayment);
router.post('/:id/record', authenticate, authorize('property_manager', 'tenant'), recordPayment);

export default router;

