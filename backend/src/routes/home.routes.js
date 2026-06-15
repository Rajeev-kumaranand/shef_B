import express from 'express';
import { getHomeContent, updateHomeContent } from '../controllers/home.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getHomeContent)
  .put(authenticateAdmin, updateHomeContent);

export default router;
