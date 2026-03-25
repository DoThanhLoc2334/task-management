import express from 'express';
import TaskController from '../controllers/task.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import permissionMiddleware from '../middleware/permission.middleware.js';

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    TaskController.getAll
  );
  
  router.get(
    '/:id',
    authMiddleware,
    permissionMiddleware(['owner', 'admin', 'member', 'viewer']),
    TaskController.getById
  );
  
  router.post(
    '/',
    authMiddleware,
    TaskController.create
  );
  
  router.put(
    '/:id', 
    authMiddleware,
    permissionMiddleware(['owner', 'admin', 'member']),
    TaskController.update
  );
  
  router.delete(
    '/:id',
    authMiddleware,
    permissionMiddleware(['owner', 'admin']),
    TaskController.delete
  );

export default router;