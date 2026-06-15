import express from 'express';
import { getLatestContent, updateLatestContent } from '../controllers/latest.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getLatestContent)
  .put(authenticateAdmin, updateLatestContent);

export default router;
