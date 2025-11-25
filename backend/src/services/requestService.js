import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';

/**
 * Create a new request
 * Business Rule: Employee A creates request and assigns to Employee B
 */
export const createRequest = async (requestData, createdById) => {
    const { title, description, assignedToId } = requestData;

    // Verify assigned user exists
    const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
    });

    if (!assignedUser) {
        throw new AppError('Assigned user not found', 404);
    }

    // Create request with PENDING status
    const request = await prisma.request.create({
        data: {
            title,
            description,
            createdById,
            assignedToId,
            status: 'PENDING',
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    managerId: true,
                },
            },
        },
    });

    logger.info('Request created', {
        requestId: request.id,
        createdBy: createdById,
        assignedTo: assignedToId,
    });

    return request;
};

/**
 * Get all requests with filters based on user role
 */
export const getRequests = async (userId, userRole) => {
    let whereClause = {};

    if (userRole === 'EMPLOYEE') {
        // Employees see requests they created or are assigned to
        whereClause = {
            OR: [
                { createdById: userId },
                { assignedToId: userId },
            ],
        };
    } else if (userRole === 'MANAGER') {
        // Managers see requests assigned to their employees
        const employees = await prisma.user.findMany({
            where: { managerId: userId },
            select: { id: true },
        });

        const employeeIds = employees.map(emp => emp.id);

        whereClause = {
            OR: [
                { createdById: userId },
                { assignedToId: userId },
                { assignedToId: { in: employeeIds } },
            ],
        };
    }

    const requests = await prisma.request.findMany({
        where: whereClause,
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    managerId: true,
                },
            },
            approvedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return requests;
};

/**
 * Get request by ID
 */
export const getRequestById = async (requestId, userId, userRole) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    managerId: true,
                },
            },
            approvedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Check if user has access to this request
    const hasAccess =
        request.createdById === userId ||
        request.assignedToId === userId ||
        request.assignedTo.managerId === userId;

    if (!hasAccess) {
        throw new AppError('You do not have access to this request', 403);
    }

    return request;
};

/**
 * Approve request
 * Business Rule: Only Employee B's manager can approve
 */
export const approveRequest = async (requestId, approverId) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId },
        include: {
            assignedTo: {
                select: {
                    id: true,
                    managerId: true,
                },
            },
        },
    });

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Check if request is in PENDING status
    if (request.status !== 'PENDING') {
        throw new AppError(`Cannot approve request with status: ${request.status}`, 400);
    }

    // Verify approver is the assigned employee's manager
    if (request.assignedTo.managerId !== approverId) {
        throw new AppError('Only the assigned employee\'s manager can approve this request', 403);
    }

    // Update request status to APPROVED
    const updatedRequest = await prisma.request.update({
        where: { id: requestId },
        data: {
            status: 'APPROVED',
            approvedById: approverId,
            approvedAt: new Date(),
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            approvedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    logger.info('Request approved', {
        requestId,
        approvedBy: approverId,
    });

    return updatedRequest;
};

/**
 * Reject request
 * Business Rule: Only Employee B's manager can reject
 */
export const rejectRequest = async (requestId, rejecterId) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId },
        include: {
            assignedTo: {
                select: {
                    id: true,
                    managerId: true,
                },
            },
        },
    });

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Check if request is in PENDING status
    if (request.status !== 'PENDING') {
        throw new AppError(`Cannot reject request with status: ${request.status}`, 400);
    }

    // Verify rejecter is the assigned employee's manager
    if (request.assignedTo.managerId !== rejecterId) {
        throw new AppError('Only the assigned employee\'s manager can reject this request', 403);
    }

    // Update request status to REJECTED
    const updatedRequest = await prisma.request.update({
        where: { id: requestId },
        data: {
            status: 'REJECTED',
            approvedById: rejecterId,
            approvedAt: new Date(),
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            approvedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    logger.info('Request rejected', {
        requestId,
        rejectedBy: rejecterId,
    });

    return updatedRequest;
};

/**
 * Action request (start working on it)
 * Business Rule: Employee B can only action if status is APPROVED
 */
export const actionRequest = async (requestId, userId) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId },
    });

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Verify user is the assigned employee
    if (request.assignedToId !== userId) {
        throw new AppError('Only the assigned employee can action this request', 403);
    }

    // Check if request is APPROVED
    if (request.status !== 'APPROVED') {
        throw new AppError('Request must be approved before it can be actioned', 400);
    }

    // Update status to IN_PROGRESS
    const updatedRequest = await prisma.request.update({
        where: { id: requestId },
        data: {
            status: 'IN_PROGRESS',
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            approvedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    logger.info('Request actioned', {
        requestId,
        actionedBy: userId,
    });

    return updatedRequest;
};

/**
 * Close request
 * Business Rule: Employee B can close only if status is IN_PROGRESS
 */
export const closeRequest = async (requestId, userId) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId },
    });

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    // Verify user is the assigned employee
    if (request.assignedToId !== userId) {
        throw new AppError('Only the assigned employee can close this request', 403);
    }

    // Check if request is IN_PROGRESS
    if (request.status !== 'IN_PROGRESS') {
        throw new AppError('Request must be in progress before it can be closed', 400);
    }

    // Update status to CLOSED
    const updatedRequest = await prisma.request.update({
        where: { id: requestId },
        data: {
            status: 'CLOSED',
            closedAt: new Date(),
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            approvedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    logger.info('Request closed', {
        requestId,
        closedBy: userId,
    });

    return updatedRequest;
};
