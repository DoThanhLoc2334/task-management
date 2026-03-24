import AuthService from '../services/auth.service.js';
import { successResponse, errorResponse } from '../Utils/response.js';

const AuthController = {
  async register(req, res) {
    try {
      const data = await AuthService.register(req.body);
      return successResponse(res, data, 'User registered');
    } catch (err) {
      if (err.message === 'EMAIL_ALREADY_EXISTS') {
        return errorResponse(res, 'Email already exists', 400);
      }
      if (err.message === 'MISSING_REQUIRED_FIELDS') {
        return errorResponse(res, 'Missing required fields', 400);
      }
      return errorResponse(res, err.message);
    }
  },

  async login(req, res) {
    try {
      const data = await AuthService.login(req.body);
      return successResponse(res, data, 'Login successful');
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return errorResponse(res, 'Invalid credentials', 401);
      }
      return errorResponse(res, err.message);
    }
  }
};

export default AuthController;