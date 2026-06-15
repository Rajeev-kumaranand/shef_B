import express from 'express';
import { getCompany, updateCompany } from '../controllers/company.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getCompany)
  .put(authenticateAdmin, updateCompany);

export default router;
