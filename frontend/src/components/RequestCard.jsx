import { useState } from 'react';
import { requestsAPI } from '../services/api';
import {
    CheckCircle,
    XCircle,
    PlayCircle,
    StopCircle,
    User,
    Calendar,
    AlertCircle,
} from 'lucide-react';
import './RequestCard.css';

const RequestCard = ({ request, currentUser, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const canApprove =
        currentUser.role === 'MANAGER' &&
        request.status === 'PENDING' &&
        request.assignedTo.managerId === currentUser.id;

    const canAction =
        request.assignedToId === currentUser.id &&
        request.status === 'APPROVED';

    const canClose =
        request.assignedToId === currentUser.id &&
        request.status === 'IN_PROGRESS';

    const handleApprove = async () => {
        try {
            setLoading(true);
            setError('');
            await requestsAPI.approveRequest(request.id);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve request');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        try {
            setLoading(true);
            setError('');
            await requestsAPI.rejectRequest(request.id);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject request');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        try {
            setLoading(true);
            setError('');
            await requestsAPI.actionRequest(request.id);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to action request');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async () => {
        try {
            setLoading(true);
            setError('');
            await requestsAPI.closeRequest(request.id);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to close request');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { class: 'badge-pending', label: 'Pending' },
            APPROVED: { class: 'badge-approved', label: 'Approved' },
            REJECTED: { class: 'badge-rejected', label: 'Rejected' },
            IN_PROGRESS: { class: 'badge-in-progress', label: 'In Progress' },
            CLOSED: { class: 'badge-closed', label: 'Closed' },
        };
        const badge = badges[status] || badges.PENDING;
        return <span className={`badge ${badge.class}`}>{badge.label}</span>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="request-card card">
            <div className="request-card-header">
                <div>
                    <h3 className="request-title">{request.title}</h3>
                    {getStatusBadge(request.status)}
                </div>
            </div>

            <p className="request-description">{request.description}</p>

            <div className="request-meta">
                <div className="meta-item">
                    <User size={16} />
                    <span>
                        <strong>Created by:</strong> {request.createdBy.name}
                    </span>
                </div>
                <div className="meta-item">
                    <User size={16} />
                    <span>
                        <strong>Assigned to:</strong> {request.assignedTo.name}
                    </span>
                </div>
                <div className="meta-item">
                    <Calendar size={16} />
                    <span>
                        <strong>Created:</strong> {formatDate(request.createdAt)}
                    </span>
                </div>
                {request.approvedBy && (
                    <div className="meta-item">
                        <CheckCircle size={16} />
                        <span>
                            <strong>Approved by:</strong> {request.approvedBy.name}
                        </span>
                    </div>
                )}
            </div>

            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <div className="request-actions">
                {canApprove && (
                    <>
                        <button
                            onClick={handleApprove}
                            className="btn btn-success btn-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Approve
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReject}
                            className="btn btn-danger btn-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    <XCircle size={18} />
                                    Reject
                                </>
                            )}
                        </button>
                    </>
                )}

                {canAction && (
                    <button
                        onClick={handleAction}
                        className="btn btn-primary btn-sm"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                <PlayCircle size={18} />
                                Start Working
                            </>
                        )}
                    </button>
                )}

                {canClose && (
                    <button
                        onClick={handleClose}
                        className="btn btn-success btn-sm"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                <StopCircle size={18} />
                                Close Request
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RequestCard;
