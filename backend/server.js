import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupBattleSockets } from './socket/battleRoom.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allows Next.js frontend connection
    methods: ['GET', 'POST'],
  },
});

// Setup Real-time Battle Sockets
setupBattleSockets(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`⚔️  AI Battle Backend running on http://localhost:${PORT}`);
});