import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data: {
        businessName: string;
        businessEmail: string;
        phone: string;
        password: string;
    }) => api.post('/auth/register', data),

    login: (data: { businessName: string; password: string }) =>
        api.post('/auth/login', data),

    loginAdmin: (data: { email: string; password: string }) =>
        api.post('/auth/admin/login', data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.patch('/auth/change-password', data),
};

// Products API
export const productsAPI = {
    getAll: (params?: { search?: string; category?: string }) =>
        api.get('/products', { params }),

    getOne: (id: string) => api.get(`/products/${id}`),

    create: (data: any) => api.post('/products', data),

    update: (id: string, data: any) => api.patch(`/products/${id}`, data),

    delete: (id: string) => api.delete(`/products/${id}`),

    bulkOnboard: (items: any[]) =>
        api.post('/products/bulk-onboard', { items }),

    recordSale: (id: string, data: { quantity: number; notes?: string }) =>
        api.post(`/products/${id}/sell`, data),

    getInventorySummary: () => api.get('/products/inventory-summary'),

    getCategories: () => api.get('/products/categories'),
};

export const businessAPI = {
    getMe: () => api.get('/business/me'),
    updateMe: (data: any) => api.patch('/business/me', data),
};

// Orders API
export const ordersAPI = {
    getAll: (params?: { status?: string }) => api.get('/orders', { params }),

    getOne: (id: string) => api.get(`/orders/${id}`),

    getStats: () => api.get('/orders/stats'),

    updateStatus: (id: string, status: string, mpesaCode?: string) =>
        api.patch(`/orders/${id}/status`, { status, mpesaCode }),
};

// Marketplace API
export const marketplaceAPI = {
    getProducts: (params?: {
        search?: string;
        category?: string;
        lat?: number;
        lng?: number;
    }) => api.get('/marketplace/products', { params }),

    getProduct: (id: string) => api.get(`/marketplace/products/${id}`),

    getBusiness: (id: string) => api.get(`/marketplace/business/${id}`),

    submitReview: (data: {
        businessId: string;
        customerName: string;
        rating: number;
        comment?: string;
    }) => api.post('/marketplace/reviews', data),

    submitComplaint: (data: {
        businessId: string;
        customerName: string;
        customerEmail?: string;
        description: string;
    }) => api.post('/marketplace/complaints', data),
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),

    getBusinesses: () => api.get('/admin/businesses'),

    updateBusinessStatus: (id: string, status: string) =>
        api.patch(`/admin/businesses/${id}/status`, { status }),

    resetPassword: (id: string) =>
        api.patch(`/admin/businesses/${id}/reset-password`),

    getComplaints: () => api.get('/admin/complaints'),

    updateComplaint: (id: string, status: string, resolution?: string) =>
        api.patch(`/admin/complaints/${id}`, { status, resolution }),

    getReviews: () => api.get('/admin/reviews'),

    updateReview: (id: string, isApproved: boolean) =>
        api.patch(`/admin/reviews/${id}`, { isApproved }),
};

export default api;
