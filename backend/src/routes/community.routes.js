import express from 'express';
import { getCommunityContent, updateCommunityContent } from '../controllers/community.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getCommunityContent)
  .put(authenticateAdmin, updateCommunityContent);

export default router;
