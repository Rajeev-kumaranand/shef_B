import express from 'express';
import { getProducts, getProductById, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { validateProduct } from '../validators/product.validator.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.use(authenticateAdmin);

router.post('/', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
