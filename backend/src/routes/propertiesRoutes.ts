import { Router } from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertiesController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllProperties);
router.get('/:id', authenticate, getPropertyById);
router.post('/', authenticate, authorize('property_manager', 'property_owner'), createProperty);
router.put('/:id', authenticate, authorize('property_manager', 'property_owner'), updateProperty);
router.delete('/:id', authenticate, authorize('property_owner'), deleteProperty);

export default router;

