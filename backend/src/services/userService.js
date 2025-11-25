import prisma from '../config/database.js';
import { excludePassword } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get all users (for assignment dropdown)
 */
export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            managerId: true,
        },
        orderBy: {
            name: 'asc',
        },
    });

    return users;
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role) => {
    const users = await prisma.user.findMany({
        where: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            managerId: true,
        },
        orderBy: {
            name: 'asc',
        },
    });

    return users;
};

/**
 * Get employees under a manager
 */
export const getEmployeesUnderManager = async (managerId) => {
    const employees = await prisma.user.findMany({
        where: {
            managerId: managerId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: {
            name: 'asc',
        },
    });

    return employees;
};

/**
 * Get user with manager info
 */
export const getUserWithManager = async (userId) => {
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
        },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return excludePassword(user);
};

/**
 * Check if user is manager of another user
 */
export const isUserManagerOf = async (managerId, employeeId) => {
    const employee = await prisma.user.findUnique({
        where: { id: employeeId },
        select: { managerId: true },
    });

    if (!employee) {
        throw new AppError('Employee not found', 404);
    }

    return employee.managerId === managerId;
};
