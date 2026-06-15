import express from 'express';
import { getSlides, getSlide, createSlide, updateSlide, deleteSlide } from '../controllers/slide.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getSlides)
  .post(authenticateAdmin, createSlide);

router.route('/:id')
  .get(getSlide)
  .put(authenticateAdmin, updateSlide)
  .delete(authenticateAdmin, deleteSlide);

export default router;
