import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
    getAllUsers: () => api.get('/users'),
    getUserById: (id) => api.get(`/users/${id}`),
    getEmployees: () => api.get('/users/role/employees'),
    getMyEmployees: () => api.get('/users/manager/my-employees'),
};

// Requests API
export const requestsAPI = {
    createRequest: (data) => api.post('/requests', data),
    getRequests: () => api.get('/requests'),
    getRequestById: (id) => api.get(`/requests/${id}`),
    approveRequest: (id) => api.put(`/requests/${id}/approve`),
    rejectRequest: (id) => api.put(`/requests/${id}/reject`),
    actionRequest: (id) => api.put(`/requests/${id}/action`),
    closeRequest: (id) => api.put(`/requests/${id}/close`),
};

export default api;
