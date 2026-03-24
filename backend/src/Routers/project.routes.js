import express from 'express';
import ProjectController from '../controllers/project.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, ProjectController.create);
router.get('/', authMiddleware, ProjectController.getAll);
router.get('/:id', authMiddleware, ProjectController.getById);
router.put('/:id', authMiddleware, ProjectController.update);
router.delete('/:id', authMiddleware, ProjectController.delete);

export default router;