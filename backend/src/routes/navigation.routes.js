import express from 'express';
import { getNavigations, createNavigation, updateNavigation, deleteNavigation } from '../controllers/navigation.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getNavigations)
  .post(authenticateAdmin, createNavigation);

router.route('/:id')
  .put(authenticateAdmin, updateNavigation)
  .delete(authenticateAdmin, deleteNavigation);

export default router;
