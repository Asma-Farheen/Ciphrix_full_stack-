import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestsAPI, usersAPI } from '../services/api';
import {
    Plus,
    CheckCircle,
    XCircle,
    PlayCircle,
    StopCircle,
    Clock,
    AlertCircle,
    Filter,
} from 'lucide-react';
import CreateRequestModal from '../components/CreateRequestModal';
import RequestCard from '../components/RequestCard';
import './Dashboard.css';

const Dashboard = () => {
    const { user, isManager } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await requestsAPI.getRequests();
            setRequests(response.data.data.requests);
            setError('');
        } catch (err) {
            setError('Failed to load requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestCreated = () => {
        setShowCreateModal(false);
        fetchRequests();
    };

    const handleRequestUpdated = () => {
        fetchRequests();
    };

    // Filter requests
    const filteredRequests = requests.filter((req) => {
        if (filter === 'ALL') return true;
        return req.status === filter;
    });

    // Calculate stats
    const stats = {
        total: requests.length,
        pending: requests.filter((r) => r.status === 'PENDING').length,
        approved: requests.filter((r) => r.status === 'APPROVED').length,
        inProgress: requests.filter((r) => r.status === 'IN_PROGRESS').length,
        closed: requests.filter((r) => r.status === 'CLOSED').length,
        rejected: requests.filter((r) => r.status === 'REJECTED').length,
    };

    const statCards = [
        {
            label: 'Total Requests',
            value: stats.total,
            icon: <Filter size={20} />,
            color: 'primary',
            filter: 'ALL',
        },
        {
            label: 'Pending',
            value: stats.pending,
            icon: <Clock size={20} />,
            color: 'pending',
            filter: 'PENDING',
        },
        {
            label: 'Approved',
            value: stats.approved,
            icon: <CheckCircle size={20} />,
            color: 'approved',
            filter: 'APPROVED',
        },
        {
            label: 'In Progress',
            value: stats.inProgress,
            icon: <PlayCircle size={20} />,
            color: 'in-progress',
            filter: 'IN_PROGRESS',
        },
        {
            label: 'Closed',
            value: stats.closed,
            icon: <StopCircle size={20} />,
            color: 'closed',
            filter: 'CLOSED',
        },
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">
                            Welcome back, {user?.name}! 👋
                        </h1>
                        <p className="dashboard-subtitle">
                            {isManager
                                ? 'Manage and approve requests from your team'
                                : 'Create and track your requests'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary"
                    >
                        <Plus size={20} />
                        Create Request
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`stat-card card ${filter === stat.filter ? 'active' : ''}`}
                            onClick={() => setFilter(stat.filter)}
                        >
                            <div className={`stat-icon stat-icon-${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Requests */}
                <div className="requests-section">
                    <div className="requests-header">
                        <h2 className="requests-title">
                            {filter === 'ALL' ? 'All Requests' : `${filter} Requests`}
                        </h2>
                        <div className="requests-count">
                            {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
                        </div>
                    </div>

                    {filteredRequests.length === 0 ? (
                        <div className="empty-state card">
                            <div className="empty-icon">
                                <Filter size={48} />
                            </div>
                            <h3 className="empty-title">No requests found</h3>
                            <p className="empty-description">
                                {filter === 'ALL'
                                    ? 'Create your first request to get started'
                                    : `No ${filter.toLowerCase()} requests at the moment`}
                            </p>
                            {filter !== 'ALL' && (
                                <button
                                    onClick={() => setFilter('ALL')}
                                    className="btn btn-secondary btn-sm"
                                >
                                    View All Requests
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="requests-grid">
                            {filteredRequests.map((request) => (
                                <RequestCard
                                    key={request.id}
                                    request={request}
                                    currentUser={user}
                                    onUpdate={handleRequestUpdated}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Request Modal */}
            {showCreateModal && (
                <CreateRequestModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleRequestCreated}
                />
            )}
        </div>
    );
};

export default Dashboard;
