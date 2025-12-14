import { Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import bcrypt from 'bcryptjs';
import { mockUsers } from '../config/db';

// Helper function to check if MongoDB is connected
const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// Register user - Now supports public registration
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, name, email, password, role } = req.body;


    // MongoDB operations when connected
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = new User({
      username,
      name,
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      role: role || 'viewer' // Default to viewer for public registration
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login user
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password } = req.body;

    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      const user = mockUsers.find(u => u.username === username);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // In a real app, all passwords would be properly hashed
      let validPassword = false;
      if (username === 'admin' && password === 'admin123') {
        validPassword = true;
      } else if (username === 'editor' && password === 'editor123') {
        validPassword = true;
      } else if (user.passwordHash.startsWith('$2b$')) {
        // For newly registered users with proper password hash
        validPassword = await bcrypt.compare(password, user.passwordHash);
      }

      if (!validPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      return;
    }

    // MongoDB operations when connected
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      const user = mockUsers.find(u => u._id === req.user?._id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      res.json({
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      });
      return;
    }

    // MongoDB operations when connected
    const user = await User.findById(req.user?._id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Get users count (public endpoint)
export const getUsersCount = async (req: AuthRequest, res: Response): Promise<void> => {

    
    // MongoDB query when connected
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users count', error });
  }
};

// Validation rules - Updated for public registration
export const registerValidation = [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('name').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['admin', 'editor', 'viewer']).withMessage('Role must be admin, editor, or viewer')
];

export const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];
