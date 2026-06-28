import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  submitCommunityReview,
  getApprovedCommunityReviews,
  getAllCommunityReviews,
  toggleReviewApproval,
  deleteCommunityReview
} from '../controllers/communityReview.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rate limiter for review submission
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Too many submissions from this IP, please try again later.' }
});

// Validation
const reviewValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Review message is required').escape(),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

// PUBLIC ROUTES
router.post('/', reviewLimiter, reviewValidation, submitCommunityReview);
router.get('/approved', getApprovedCommunityReviews);

// ADMIN ROUTES
router.get('/admin', authenticateAdmin, getAllCommunityReviews);
router.put('/admin/:id/approve', authenticateAdmin, toggleReviewApproval);
router.delete('/admin/:id', authenticateAdmin, deleteCommunityReview);

export default router;
