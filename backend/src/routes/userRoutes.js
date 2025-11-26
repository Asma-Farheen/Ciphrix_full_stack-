import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route for fetching managers (for registration)
router.get('/managers', userController.getManagers);

// All other routes require authentication
router.use(authenticate);

// Get all users (for assignment dropdown)
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Manager-only routes
router.get('/role/employees', authorize('MANAGER'), userController.getEmployees);
router.get('/manager/my-employees', authorize('MANAGER'), userController.getMyEmployees);

export default router;
