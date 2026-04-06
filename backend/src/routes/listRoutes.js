import express from 'express';
import {
  createList,
  deleteList,
  getLists,
  updateList
} from '../controllers/listController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getLists);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

export default router;
