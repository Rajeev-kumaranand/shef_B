import express from 'express';
import { getShopContent, updateShopContent } from '../controllers/shop.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getShopContent)
  .put(authenticateAdmin, updateShopContent);

export default router;
