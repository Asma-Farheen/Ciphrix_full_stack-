import { asyncHandler } from '../middleware/errorHandler.js';
import * as authService from '../services/authService.js';
import { createResponse } from '../utils/helpers.js';
import logger from '../config/logger.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body);

    logger.info('User registered', {
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
    });

    res.status(201).json(
        createResponse(true, 'User registered successfully', result)
    );
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    logger.info('User logged in', {
        userId: result.user.id,
        email: result.user.email,
    });

    res.status(200).json(
        createResponse(true, 'Login successful', result)
    );
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);

    res.status(200).json(
        createResponse(true, 'User profile retrieved', { user })
    );
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
    logger.info('User logged out', {
        userId: req.user.id,
    });

    res.status(200).json(
        createResponse(true, 'Logout successful')
    );
});
