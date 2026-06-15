import express from 'express';
import { 
  createReview,
  getProductReviews,
  getAllReviews,
  approveReview,
  deleteReview
} from '../controllers/review.controller.js';
import { authenticateAdmin, authenticateCustomer } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public
router.get('/product/:productId', getProductReviews);

// Customer
router.post('/', authenticateCustomer, createReview);

// Admin
router.get('/', authenticateAdmin, getAllReviews);
router.put('/:id/approve', authenticateAdmin, approveReview);
router.delete('/:id', authenticateAdmin, deleteReview);

export default router;
