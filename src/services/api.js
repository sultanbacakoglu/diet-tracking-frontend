import axios from 'axios';

// NOT: Backend'inin çalıştığı portu buraya yazmalısın.
// .NET genelde 5000 veya 5169 gibi portlarda çalışır.
// Eğer swagger'ın "http://localhost:5169/swagger" ise burası 5169 olmalı.
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiService = {
    // --- Kullanıcı İşlemleri ---
    getUsers: () => api.get('/users'),
    login: (data) => api.post('/auth/login', data),

    // YENİ EKLENEN: Şifre Değiştirme
    changePassword: (data) => api.put('/users/change-password', data),

    // --- Danışan İşlemleri ---
    getClients: () => api.get('/clients'),
    createClient: (data) => api.post('/clients', data),

    // --- Randevu İşlemleri ---
    getAppointments: () => api.get('/appointments'),
    createAppointment: (data) => api.post('/appointments', data),

    // Detay
    getUserById: (id) => api.get(`/users/${id}`),
};

export default apiService;