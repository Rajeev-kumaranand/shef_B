import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  getOrderStats,
  getMyOrders
} from '../controllers/order.controller.js';
import { authenticateAdmin, authenticateCustomer } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public / Customer routes
router.post('/', createOrder);
router.get('/my-orders', authenticateCustomer, getMyOrders);
router.get('/:id', getOrderById);

// Admin routes
router.get('/', authenticateAdmin, getOrders);
router.get('/stats/metrics', authenticateAdmin, getOrderStats);
router.patch('/:id/status', authenticateAdmin, updateOrderStatus);

export default router;
