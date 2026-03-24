import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorResponse } from '../Utils/response.js';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (err) {
    return errorResponse(res, 'Invalid token', 401);
  }
};

export default authMiddleware;