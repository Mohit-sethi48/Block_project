import express from 'express';
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getPublishedBlogBySlug,
  getPublishedBlogs,
  updateBlog
} from '../controllers/blogController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/published', getPublishedBlogs);
router.get('/published/:slug', getPublishedBlogBySlug);

router.use(authenticateToken);
router.get('/', getBlogs);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
