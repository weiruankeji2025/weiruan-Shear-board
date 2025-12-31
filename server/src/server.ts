import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from 'passport';

import { connectDatabase } from './config/database';
import { configurePassport } from './config/passport';
import authRoutes from './routes/auth';
import clipboardRoutes from './routes/clipboard';
import backupRoutes from './routes/backup';
import { verifyToken } from './utils/jwt';
import DeviceSession from './models/DeviceSession';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Store io instance for controllers
let ioInstance: SocketIOServer;

export const getIO = (): SocketIOServer => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
};

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);

// Passport
app.use(passport.initialize());
configurePassport();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clipboard', clipboardRoutes);
app.use('/api/backup', backupRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = verifyToken(token);
    socket.data.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

// Socket.io connection handler
io.on('connection', async (socket) => {
  const userId = socket.data.userId;
  console.log(`User connected: ${userId}, Socket: ${socket.id}`);

  // Join user room for broadcasting
  socket.join(`user:${userId}`);

  // Handle device registration
  socket.on('register:device', async (deviceInfo) => {
    try {
      await DeviceSession.findOneAndUpdate(
        { userId, deviceId: deviceInfo.deviceId },
        {
          userId,
          deviceId: deviceInfo.deviceId,
          deviceName: deviceInfo.deviceName,
          platform: deviceInfo.platform,
          browser: deviceInfo.browser,
          lastActive: new Date(),
          ipAddress: socket.handshake.address,
          socketId: socket.id,
        },
        { upsert: true, new: true }
      );

      // Notify other devices
      socket.to(`user:${userId}`).emit('device:connected', deviceInfo);
    } catch (error) {
      console.error('Device registration error:', error);
    }
  });

  // Handle clipboard sync
  socket.on('clipboard:sync', (data) => {
    socket.to(`user:${userId}`).emit('clipboard:new', data);
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${userId}, Socket: ${socket.id}`);

    try {
      const session = await DeviceSession.findOne({ socketId: socket.id });
      if (session) {
        socket.to(`user:${userId}`).emit('device:disconnected', {
          deviceId: session.deviceId,
          deviceName: session.deviceName,
        });
      }
    } catch (error) {
      console.error('Disconnect handling error:', error);
    }
  });

  // Heartbeat
  socket.on('heartbeat', async () => {
    try {
      await DeviceSession.updateOne(
        { socketId: socket.id },
        { lastActive: new Date() }
      );
    } catch (error) {
      console.error('Heartbeat error:', error);
    }
  });
});

ioInstance = io;

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  Clipboard Sync Server                 ║
║  Port: ${PORT}                            ║
║  Environment: ${process.env.NODE_ENV || 'development'}           ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
