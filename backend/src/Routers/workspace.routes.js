import express from 'express';
import WorkspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, WorkspaceController.create);
router.get('/', authMiddleware,WorkspaceController.getAll);
router.get('/:id', authMiddleware, WorkspaceController.getById);
router.post('/:id/members', authMiddleware, WorkspaceController.addMember);
export default router;