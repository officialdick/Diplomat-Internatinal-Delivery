import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DIPLOMAT INTERNATIONAL DELIVERY LTD - API'
  });
});

app.get('/api/', (req, res) => {
  res.json({
    message: 'DIPLOMAT INTERNATIONAL DELIVERY LTD API v1.0',
    endpoints: {
      auth: '/api/auth',
      shipments: '/api/shipments',
      tracking: '/api/tracking',
      carriers: '/api/carriers'
    }
  });
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('track_shipment', (trackingNumber) => {
    socket.emit('tracking_update', {
      trackingNumber,
      status: 'In Transit',
      lastUpdate: new Date().toISOString()
    });
  });
});

server.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

export default app;
