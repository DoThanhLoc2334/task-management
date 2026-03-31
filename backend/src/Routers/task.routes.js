import express from 'express';
import TaskController from '../controllers/task.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import permissionMiddleware from '../middleware/permission.middleware.js';

const router = express.Router();

//  route cụ thể trước
router.put(
  '/:id/reorder',
  authMiddleware,
  TaskController.reorder
);

router.patch(
  '/:id/status',
  authMiddleware,
  TaskController.updateStatus
);

router.patch(
  '/:id/assign',
  authMiddleware,
  TaskController.assignTask
);

//  route chung
router.get(
  '/',
  authMiddleware,
  TaskController.getAll
);

router.post(
  '/',
  authMiddleware,
  TaskController.create
);

//  route có :id phải để sau cùng
router.get(
  '/:id',
  authMiddleware,
  TaskController.getById
);

router.put(
  '/:id', 
  authMiddleware,
  TaskController.update
);

router.delete(
  '/:id',
  authMiddleware,
  TaskController.delete
); 

export default router;