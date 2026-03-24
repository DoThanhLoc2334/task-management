import express from "express";
const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser';

// 🔥 IMPORT ROUTES
import authRoutes from './Routers/auth.routes.js';
import taskRoutes from './Routers/task.routes.js';
import workspaceRoutes from './Routers/workspace.routes.js';
import projectRoutes from './Routers/project.routes.js';
import columnRoutes from './Routers/column.routes.js';

// 🔥 MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 🔥 ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/workspaces', workspaceRoutes); 
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/columns', columnRoutes);


export default app;