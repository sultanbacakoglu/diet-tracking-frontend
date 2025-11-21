import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiService = {
    // Kullanıcı / Giriş Servisleri
    getUsers: () => api.get('/users'),
    login: (data) => api.post('/auth/login', data),

    // Danışan Listeleme
    getClients: () => api.get('/clients'),

    // Danışan Oluşturma
    createClient: (data) => api.post('/clients', data),

    // Randevu Servisleri
    getAppointments: () => api.get('/appointments'),
    createAppointment: (data) => api.post('/appointments', data),

    // Detaylı bir GET işlemi için
    getUserById: (id) => api.get(`/users/${id}`),

};

export default apiService;
