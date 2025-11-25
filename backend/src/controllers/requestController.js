import { asyncHandler } from '../middleware/errorHandler.js';
import * as requestService from '../services/requestService.js';
import { createResponse } from '../utils/helpers.js';

/**
 * @route   POST /api/requests
 * @desc    Create a new request
 * @access  Private
 */
export const createRequest = asyncHandler(async (req, res) => {
    const request = await requestService.createRequest(req.body, req.user.id);

    res.status(201).json(
        createResponse(true, 'Request created successfully', { request })
    );
});

/**
 * @route   GET /api/requests
 * @desc    Get all requests (filtered by user role)
 * @access  Private
 */
export const getRequests = asyncHandler(async (req, res) => {
    const requests = await requestService.getRequests(req.user.id, req.user.role);

    res.status(200).json(
        createResponse(true, 'Requests retrieved successfully', { requests })
    );
});

/**
 * @route   GET /api/requests/:id
 * @desc    Get request by ID
 * @access  Private
 */
export const getRequestById = asyncHandler(async (req, res) => {
    const request = await requestService.getRequestById(
        req.params.id,
        req.user.id,
        req.user.role
    );

    res.status(200).json(
        createResponse(true, 'Request retrieved successfully', { request })
    );
});

/**
 * @route   PUT /api/requests/:id/approve
 * @desc    Approve a request
 * @access  Private (Manager only)
 */
export const approveRequest = asyncHandler(async (req, res) => {
    const request = await requestService.approveRequest(
        req.params.id,
        req.user.id
    );

    res.status(200).json(
        createResponse(true, 'Request approved successfully', { request })
    );
});

/**
 * @route   PUT /api/requests/:id/reject
 * @desc    Reject a request
 * @access  Private (Manager only)
 */
export const rejectRequest = asyncHandler(async (req, res) => {
    const request = await requestService.rejectRequest(
        req.params.id,
        req.user.id
    );

    res.status(200).json(
        createResponse(true, 'Request rejected successfully', { request })
    );
});

/**
 * @route   PUT /api/requests/:id/action
 * @desc    Start working on a request
 * @access  Private (Assigned employee only)
 */
export const actionRequest = asyncHandler(async (req, res) => {
    const request = await requestService.actionRequest(
        req.params.id,
        req.user.id
    );

    res.status(200).json(
        createResponse(true, 'Request actioned successfully', { request })
    );
});

/**
 * @route   PUT /api/requests/:id/close
 * @desc    Close a request
 * @access  Private (Assigned employee only)
 */
export const closeRequest = asyncHandler(async (req, res) => {
    const request = await requestService.closeRequest(
        req.params.id,
        req.user.id
    );

    res.status(200).json(
        createResponse(true, 'Request closed successfully', { request })
    );
});
