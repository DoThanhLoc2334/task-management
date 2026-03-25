import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/user',authMiddleware,AuthController.getUsers)
export default router;