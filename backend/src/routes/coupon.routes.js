import express from 'express';
import { 
  createCoupon, 
  getCoupons, 
  updateCoupon, 
  deleteCoupon,
  validateCoupon
} from '../controllers/coupon.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public
router.post('/validate', validateCoupon);

// Admin
router.post('/', authenticateAdmin, createCoupon);
router.get('/', authenticateAdmin, getCoupons);
router.put('/:id', authenticateAdmin, updateCoupon);
router.delete('/:id', authenticateAdmin, deleteCoupon);

export default router;
