import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './Routers/authRouter.js';
import workspaceRoutes from './Routers/workspaceRouter.js';
import projectRoutes from './Routers/projectRouter.js';

import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspaces/:workspaceId/projects', projectRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;