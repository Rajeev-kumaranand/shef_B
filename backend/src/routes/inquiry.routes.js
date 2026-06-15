import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { 
  submitInquiry, 
  getInquiries, 
  getInquiryById, 
  updateInquiry, 
  deleteInquiry,
  getInquiryStats 
} from '../controllers/inquiry.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rate limiter for contact form: max 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Validation and sanitization middleware for the contact form
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim().escape(),
  body('subject').trim().notEmpty().withMessage('Subject is required').escape(),
  body('message').trim().notEmpty().withMessage('Message is required').escape()
];

// PUBLIC ROUTE: Submit an inquiry
router.post('/contact', contactLimiter, contactValidation, submitInquiry);

// ADMIN ROUTES: Protected
router.get('/admin/inquiries/stats', authenticateAdmin, getInquiryStats);
router.get('/admin/inquiries', authenticateAdmin, getInquiries);
router.get('/admin/inquiries/:id', authenticateAdmin, getInquiryById);
router.put('/admin/inquiries/:id', authenticateAdmin, updateInquiry);
router.delete('/admin/inquiries/:id', authenticateAdmin, deleteInquiry);

export default router;
