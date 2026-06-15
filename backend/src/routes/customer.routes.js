import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/customer.controller.js';
import { authenticateCustomer } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticateCustomer, getMe);
router.put('/me', authenticateCustomer, updateProfile);

router.get('/addresses', authenticateCustomer, getAddresses);
router.post('/addresses', authenticateCustomer, addAddress);
router.put('/addresses/:id', authenticateCustomer, updateAddress);
router.delete('/addresses/:id', authenticateCustomer, deleteAddress);

export default router;
