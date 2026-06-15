import express from 'express';
import { getMedia, uploadMediaFile, deleteMediaFile } from '../controllers/media.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { uploadMedia } from '../middlewares/mediaUpload.middleware.js';

const router = express.Router();

router.route('/')
  .get(authenticateAdmin, getMedia)
  .post(authenticateAdmin, uploadMedia.single('file'), uploadMediaFile);

router.route('/:id')
  .delete(authenticateAdmin, deleteMediaFile);

export default router;
