import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Get single product
router.get('/:id', getProduct);

// Create product - Admin only
router.post(
  '/',
  [
    auth,
    adminAuth,
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isIn(['Equipment', 'Consumables', 'Instruments', 'Hygiene', 'Orthodontics'])
      .withMessage('Invalid category'),
    body('imageUrl').isURL().withMessage('Invalid image URL'),
    body('inStock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  createProduct
);

// Update product - Admin only
router.put(
  '/:id',
  [
    auth,
    adminAuth,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').optional()
      .isIn(['Equipment', 'Consumables', 'Instruments', 'Hygiene', 'Orthodontics'])
      .withMessage('Invalid category'),
    body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
    body('inStock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  updateProduct
);

// Delete product - Admin only
router.delete('/:id', [auth, adminAuth], deleteProduct);

export default router; 