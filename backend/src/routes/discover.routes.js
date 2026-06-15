import express from 'express';
import { getDiscoverContent, updateDiscoverContent } from '../controllers/discover.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getDiscoverContent)
  .put(authenticateAdmin, updateDiscoverContent);

export default router;
