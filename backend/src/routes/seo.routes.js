import express from 'express';
import { getSeoByPage, updateSeo, generateSitemap, generateRobotsTxt } from '../controllers/seo.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', generateRobotsTxt);
router.get('/:pageKey', getSeoByPage);

// Admin routes
router.put('/:pageKey', authenticateAdmin, updateSeo);

export default router;
