import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
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
