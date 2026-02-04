// Centralized API service with JWT authentication
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin';
        }
        return Promise.reject(error);
    }
);

// ============ AUTH ============
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    me: () => api.get('/auth/me'),
};

// ============ WINGS ============
export const wingsAPI = {
    getAll: () => api.get('/wings'),
    getBySlug: (slug) => api.get(`/wings/${slug}`),
    create: (data) => api.post('/admin/wing', data),
    update: (id, data) => api.put(`/admin/wing/${id}`, data),
    delete: (id) => api.delete(`/admin/wing/${id}`),
    // Gallery management
    getGallery: (wingId) => api.get(`/admin/wing/${wingId}/gallery`),
    addGalleryImage: (data) => api.post('/admin/gallery', data),
    updateGalleryImage: (id, data) => api.put(`/admin/gallery/${id}`, data),
    deleteGalleryImage: (id) => api.delete(`/admin/gallery/${id}`),
};

// ============ EVENTS ============
export const eventsAPI = {
    getAll: () => api.get('/events'),
    getBySymposium: (symposiumId) => api.get(`/events/symposium/${symposiumId}`),
    getBySlug: (slug) => api.get(`/events/${slug}`),
    create: (data) => api.post('/admin/event', data),
    update: (id, data) => api.put(`/admin/event/${id}`, data),
    delete: (id) => api.delete(`/admin/event/${id}`),
};

// ============ SYMPOSIUM ============
export const symposiumAPI = {
    getAll: () => api.get('/symposium'),
    getActive: () => api.get('/symposium/active'),
    getByYear: (year) => api.get(`/symposium/year/${year}`),
    create: (data) => api.post('/admin/symposium', data),
    update: (id, data) => api.put(`/admin/symposium/${id}`, data),
    setActive: (id) => api.post(`/admin/symposium/${id}/activate`),
};

// ============ TEAM (ClubMember) ============
export const teamAPI = {
    getAll: () => api.get('/team/all'),
    getClubTeam: () => api.get('/team'),
    getBySymposium: (symposiumId) => api.get(`/team/symposium/${symposiumId}`),
    create: (data) => api.post('/admin/member', data),
    update: (id, data) => api.put(`/admin/member/${id}`, data),
    delete: (id) => api.delete(`/admin/member/${id}`),
};

// ============ REGISTRATIONS ============
export const registrationsAPI = {
    getAll: (symposiumId) => api.get('/admin/registrations', {
        params: symposiumId ? { symposiumId } : {}
    }),
    getStats: (symposiumId) => api.get(`/admin/registrations/stats/${symposiumId}`),
};

// ============ SPONSORS ============
export const sponsorsAPI = {
    create: (data) => api.post('/admin/sponsor', data),
    update: (id, data) => api.put(`/admin/sponsor/${id}`, data),
    delete: (id) => api.delete(`/admin/sponsor/${id}`),
};

// ============ SITE ASSETS ============
export const assetsAPI = {
    getAll: () => api.get('/assets'),
    getByKey: (key) => api.get(`/assets/${key}`),
    getByCategory: (category) => api.get(`/assets/category/${category}`),
    create: (data) => api.post('/assets', data),
    update: (id, data) => api.put(`/assets/${id}`, data),
    delete: (id) => api.delete(`/assets/${id}`),
    getPublic: (key, transformations) => api.get(`/assets/public/${key}`, { params: transformations }),
};

export default api;

