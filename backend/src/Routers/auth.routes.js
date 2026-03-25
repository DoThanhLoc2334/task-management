import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import workspaceAuth from '../middleware/workspaceAuth.js';
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/user',authMiddleware,AuthController.getUsers)
router.get('/invitemenber',authMiddleware, AuthController.getUsersNotInWorkspace);

export default router;