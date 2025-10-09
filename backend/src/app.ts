import express from 'express';
import { Application, Request, Response } from "express";
import http, {Server as HTTPServer} from 'http';
import connectToDatabase from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRouter.js';
import followRoutes from './routes/followRoutes.js';
import likeRoutes from './routes/likeRoutes.js';

import { initSocket } from './socket/socket.js';

//only test
// import path from "path";
// import { fileURLToPath } from "url";

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT  || 3000;

const app: Application = express();
const server: HTTPServer = http.createServer(app); // HTTP-server for Express + Socket.IO

// const __filename = fileURLToPath(import.meta.url);//only test
// const __dirname = path.dirname(__filename); //only test
// app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (_req: Request, res: Response) => {
  res.send('HomePage');
});

//Routes
app.use('/api/auth', authRoutes);
app.use ('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', followRoutes);
app.use('/api/likes', likeRoutes)

// Socket.IO
initSocket(server);

// Start server
server.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error(
      'Failed to start the server due to MongoDB connection issue',
      error
    );
  }
});