import express from 'express';
import ColumnController from '../controllers/column.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, ColumnController.create);
router.get('/', authMiddleware, ColumnController.getAll);
router.put('/:id', authMiddleware, ColumnController.update);
router.delete('/:id', authMiddleware, ColumnController.delete);

router.patch('/reorder', authMiddleware, ColumnController.reorder); // 🔥

export default router;