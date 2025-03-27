import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required')
  ],
  register
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  login
);

// Get user profile
router.get('/profile', auth, getProfile);

export default router; 