import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { connectDatabase } from './config/database';
import apiRoutes from './routes';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Connect to database
connectDatabase();

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DIPLOMAT INTERNATIONAL DELIVERY LTD'
  });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('subscribe_tracking', (trackingNumber) => {
    socket.join(`tracking_${trackingNumber}`);
    console.log(`Client subscribed to tracking: ${trackingNumber}`);
  });

  socket.on('unsubscribe_tracking', (trackingNumber) => {
    socket.leave(`tracking_${trackingNumber}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`\n🚀 DIPLOMAT INTERNATIONAL DELIVERY LTD API`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}\n`);
});

export default app;
