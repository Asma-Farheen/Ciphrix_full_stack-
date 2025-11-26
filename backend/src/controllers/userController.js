import { asyncHandler } from '../middleware/errorHandler.js';
import * as userService from '../services/userService.js';
import { createResponse } from '../utils/helpers.js';

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();

    res.status(200).json(
        createResponse(true, 'Users retrieved successfully', { users })
    );
});

/**
 * @route   GET /api/users/managers
 * @desc    Get all managers (public for registration)
 * @access  Public
 */
export const getManagers = asyncHandler(async (req, res) => {
    const managers = await userService.getUsersByRole('MANAGER');

    res.status(200).json(
        createResponse(true, 'Managers retrieved successfully', { managers })
    );
});

/**
 * @route   GET /api/users/employees
 * @desc    Get all employees
 * @access  Private (Manager only)
 */
export const getEmployees = asyncHandler(async (req, res) => {
    const employees = await userService.getUsersByRole('EMPLOYEE');

    res.status(200).json(
        createResponse(true, 'Employees retrieved successfully', { employees })
    );
});

/**
 * @route   GET /api/users/my-employees
 * @desc    Get employees under current manager
 * @access  Private (Manager only)
 */
export const getMyEmployees = asyncHandler(async (req, res) => {
    const employees = await userService.getEmployeesUnderManager(req.user.id);

    res.status(200).json(
        createResponse(true, 'Your employees retrieved successfully', { employees })
    );
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
export const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserWithManager(req.params.id);

    res.status(200).json(
        createResponse(true, 'User retrieved successfully', { user })
    );
});
