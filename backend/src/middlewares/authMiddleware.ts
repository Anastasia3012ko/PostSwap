import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Request can save userId
export interface AuthRequest extends Request {
  userId?: string;
}
interface JwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.cookies?.token;
  console.log(token);
  
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithUserId;
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid',  error: error instanceof Error ? error.message : error});
  }
};
