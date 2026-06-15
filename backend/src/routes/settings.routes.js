import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route to get settings
router.get('/', getSettings);

// Admin route to update settings
router.put('/', authenticateAdmin, updateSettings);

export default router;
