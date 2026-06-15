import express from 'express';
import { 
  getCategories, createCategory,
  getTags, createTag,
  getAuthors, createAuthor,
  getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle
} from '../controllers/magazine.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/authors', getAuthors);
router.get('/articles', getArticles);
router.get('/articles/:slug', getArticleBySlug);

// Admin routes
router.use(authenticateAdmin);

router.post('/categories', createCategory);
router.post('/tags', createTag);
router.post('/authors', createAuthor);

router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

export default router;
