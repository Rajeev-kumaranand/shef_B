import express from 'express';
import { getNoteContent, updateNoteContent } from '../controllers/note.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getNoteContent)
  .put(authenticateAdmin, updateNoteContent);

export default router;
