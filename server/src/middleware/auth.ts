import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };
    const user = await require('../models/User').default.findById(decoded._id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await auth(req, res, () => {
      if (req.user?.role !== 'admin') {
        throw new Error();
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
}; 