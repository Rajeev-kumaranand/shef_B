import express from 'express';
import { getContact, updateContact } from '../controllers/contact.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getContact)
  .put(authenticateAdmin, updateContact);

export default router;
