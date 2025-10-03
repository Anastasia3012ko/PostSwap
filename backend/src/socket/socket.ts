import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from "http";
import Chat, { IChat } from '../models/Chat.js';
import Message,{ IMessage } from '../models/Message.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthSocket extends Socket {
  userId?: string;
}

interface ServerToClientEvents {
  roomHistory: (messages: IMessage[]) => void;
  message: (msg: IMessage) => void;
  error: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  joinRoom: (data: { chatId: string }) => void;
  message: (data: { chatId: string; text: string }) => void;
}

export const initSocket = (server: HTTPServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // auth connect with jwt
  io.use((socket: AuthSocket, next) => {
    try {
      // token from cookie
      const token = socket.handshake.headers.cookie?.split('token=')[1];
      if (!token) return next(new Error('Not authorized'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (!decoded || typeof decoded !== "object" || !decoded.userId) {
        return next(new Error("Invalid token"));
      }
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Token invalid'));
    }
  });

  //connect with room (chat Id)
  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.id}, userId: ${socket.userId}`);

    socket.on('joinRoom', async ({ chatId }) => {
      try {
        const chat: IChat | null = await Chat.findById(chatId);
        if (!chat || !chat.participants.some((p) => p.toString() === socket.userId)) {
          return socket.emit("error", {
            message: "Not authorized to join this room",
          });
        }

        socket.join(chatId);

        // send message history
        const messages = await Message.find({ room: chatId }).sort({ createdAt: 1 });
        socket.emit("roomHistory", messages);
      } catch (error) {
        console.error("Error joining room:", error instanceof Error ? error.message : error);
        socket.emit("roomHistory", []);
      }
    });

    // send new message
    socket.on('message', async ({ chatId, text }) => {
      try {
        const chat: IChat | null = await Chat.findById(chatId);
        if (!chat || !chat.participants.some((p) => p.toString() === socket.userId)) {
          return socket.emit("error", {
            message: "Not authorized to send message in this room",
          });
        }
        const msg = new Message({ room: chatId, sender: socket.userId, text });
        await msg.save();

        chat.lastMessageAt = new Date();
        await chat.save();

        io.to(chatId).emit("message", msg);
      } catch (error) {
        console.error('Error saving message:', error instanceof Error ? error.message : error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}, socketId: ${socket.id}`);
    });
  });
};