import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiService = {
    // --- Kullanıcı / Auth İşlemleri ---
    getUsers: () => api.get('/users'),
    login: (data) => api.post('/auth/login', data),
    changePassword: (data) => api.put('/users/change-password', data),
    getUserById: (id) => api.get(`/users/${id}`),

    // --- Danışan (Client) İşlemleri ---
    getClients: () => api.get('/clients'),
    createClient: (data) => api.post('/clients', data),

    // --- Randevu İşlemleri ---
    getAppointments: () => api.get('/appointments'),
    createAppointment: (data) => api.post('/appointments', data),

    // --- Diyet Listesi İşlemleri (YENİ EKLENENLER) ---
    // 1. Yeni liste oluşturma
    createDietList: (data) => api.post('/dietlists', data),

    // 2. Bir danışana ait listeleri getirme
    getDietListsByClient: (clientId) => api.get(`/dietlists/client/${clientId}`),

    // 3. Tek bir listenin detayını getirme (Görüntüleme ekranı için)
    getDietListById: (id) => api.get(`/dietlists/${id}`),

    // 4. (Opsiyonel) Sistemdeki tüm listeleri getirme
    getDietLists: () => api.get('/dietlists'),
};

export default apiService;