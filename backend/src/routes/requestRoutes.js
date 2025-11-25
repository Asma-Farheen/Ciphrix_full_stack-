import express from 'express';
import * as requestController from '../controllers/requestController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createRequestSchema } from '../utils/validators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create and list requests
router.post('/', validate(createRequestSchema), requestController.createRequest);
router.get('/', requestController.getRequests);

// Get specific request
router.get('/:id', requestController.getRequestById);

// Request actions
router.put('/:id/approve', requestController.approveRequest);
router.put('/:id/reject', requestController.rejectRequest);
router.put('/:id/action', requestController.actionRequest);
router.put('/:id/close', requestController.closeRequest);

export default router;
