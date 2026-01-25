import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
apiClient.interceptors.request.use(
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

// Handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default {
    // Auth
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),  // data should contain { nik, password }
    getProfile: () => apiClient.get('/auth/profile'),

    // Admin - User Management
    createUser: (data) => apiClient.post('/admin/users', data),
    getAllUsers: () => apiClient.get('/admin/users'),
    updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),

    // Registrations
    createRegistration: (data) => apiClient.post('/registrations', data),
    getAllRegistrations: (params) => apiClient.get('/registrations', { params }),
    getRegistrationById: (id) => apiClient.get(`/registrations/${id}`),
    getMyRegistrations: () => apiClient.get('/registrations/my-registrations'),
    updateRegistrationStatus: (id, data) => apiClient.patch(`/registrations/${id}/status`, data),
    verifyArrival: (id) => apiClient.patch(`/registrations/${id}/verify-arrival`),

    // Lab Results
    createLabResult: (data) => apiClient.post('/lab-results', data),
    getLabResultByRegistration: (registrationId) => apiClient.get(`/lab-results/registration/${registrationId}`),
    updateLabResult: (id, data) => apiClient.put(`/lab-results/${id}`, data),
    getMyLabResults: () => apiClient.get('/lab-results/my-results'),

    // Stats
    getDashboardStats: () => apiClient.get('/stats/dashboard'),
    getPatientDistribution: () => apiClient.get('/stats/distribution'),
    getMonthlyTrends: (params) => apiClient.get('/stats/monthly-trends', { params }),
    getKelurahanStats: () => apiClient.get('/stats/kelurahan'),
    getKelurahanStatsPublic: () => apiClient.get('/stats/kelurahan-public'),
};

