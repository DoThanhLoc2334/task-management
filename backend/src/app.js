import express from "express";
const app = express();
import authRoutes from './Routers/auth.routes.js';

import cors from 'cors';
import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/auth', authRoutes);

import taskRoutes from './Routers/task.routes.js';

app.use('/api/tasks', taskRoutes);

export default app;

