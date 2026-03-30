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
    TaskController.update
  );
  
  router.delete(
    '/:id',
    authMiddleware,
    TaskController.delete
  );

export default router;