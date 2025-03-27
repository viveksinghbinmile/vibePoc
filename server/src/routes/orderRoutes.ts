import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus
} from '../controllers/orderController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Create order
router.post(
  '/',
  [
    auth,
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.product').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress').isObject().withMessage('Shipping address is required'),
    body('shippingAddress.street').notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.state').notEmpty().withMessage('State is required'),
    body('shippingAddress.zipCode').notEmpty().withMessage('ZIP code is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required')
  ],
  createOrder
);

// Get user orders
router.get('/', auth, getUserOrders);

// Get order by ID
router.get('/:id', auth, getOrder);

// Update order status - Admin only
router.put(
  '/:id/status',
  [
    auth,
    adminAuth,
    body('status')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status')
  ],
  updateOrderStatus
);

export default router; 