import express from "express";
const app = express();
import authRoutes from './Routers/authRouter.js';

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



export default app;

