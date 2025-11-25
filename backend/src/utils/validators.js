import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 100 characters',
        'any.required': 'Name is required',
    }),
    role: Joi.string().valid('EMPLOYEE', 'MANAGER').required().messages({
        'any.only': 'Role must be either EMPLOYEE or MANAGER',
        'any.required': 'Role is required',
    }),
    managerId: Joi.string().uuid().optional().allow(null, '').messages({
        'string.guid': 'Manager ID must be a valid UUID',
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

// Request validation schemas
export const createRequestSchema = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must not exceed 200 characters',
        'any.required': 'Title is required',
    }),
    description: Joi.string().min(10).max(2000).required().messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description must not exceed 2000 characters',
        'any.required': 'Description is required',
    }),
    assignedToId: Joi.string().uuid().required().messages({
        'string.guid': 'Assigned user ID must be a valid UUID',
        'any.required': 'Assigned user is required',
    }),
});

export const updateRequestStatusSchema = Joi.object({
    status: Joi.string()
        .valid('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'CLOSED')
        .optional()
        .messages({
            'any.only': 'Invalid status value',
        }),
    comment: Joi.string().max(500).optional().allow('').messages({
        'string.max': 'Comment must not exceed 500 characters',
    }),
});
