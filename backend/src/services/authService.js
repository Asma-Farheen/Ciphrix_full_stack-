import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken, excludePassword } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
    const { email, password, name, role, managerId } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError('User with this email already exists', 400);
    }

    // If managerId is provided, verify the manager exists and has MANAGER role
    if (managerId) {
        const manager = await prisma.user.findUnique({
            where: { id: managerId },
        });

        if (!manager) {
            throw new AppError('Manager not found', 404);
        }

        if (manager.role !== 'MANAGER') {
            throw new AppError('Assigned manager must have MANAGER role', 400);
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role,
            ...(role === 'EMPLOYEE' && managerId ? { managerId } : {}),
        },
    });

    // Generate token
    const token = generateToken(user.id);

    return {
        user: excludePassword(user),
        token,
    };
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user.id);

    return {
        user: excludePassword(user),
        token,
    };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            manager: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            employees: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return excludePassword(user);
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (userId) => {
    return getUserById(userId);
};
