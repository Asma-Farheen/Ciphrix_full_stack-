import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Create standardized API response
 */
export const createResponse = (success, message, data = null) => {
    const response = { success, message };
    if (data !== null) {
        response.data = data;
    }
    return response;
};

/**
 * Exclude sensitive fields from user object
 */
export const excludePassword = (user) => {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString();
};

/**
 * Check if user is manager of another user
 */
export const isManagerOf = (managerId, employeeId, employee) => {
    return employee && employee.managerId === managerId;
};

/**
 * Pagination helper
 */
export const getPagination = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return {
        skip,
        take: limit,
    };
};

/**
 * Calculate pagination metadata
 */
export const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
};
