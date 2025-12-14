import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { mockUsers } from '../config/db';
import { requireAdmin, requireEditor, requireViewer } from './roleMiddleware';

export interface AuthRequest extends Request {
  user?: any;
}

// Helper function to check if MongoDB is connected
const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    let user;
    
    
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Re-export role middleware functions
export { requireAdmin, requireEditor, requireViewer };
