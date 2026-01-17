import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

import DashboardLayout from './components/DashboardLayout';
import ClientPage from './pages/ClientPage';
import AppointmentPage from './pages/AppointmentPage';
import SettingsPage from './pages/SettingsPage';
import LoginForm from './components/LoginForm';

import DietWritePage from './pages/DietWritePage';
// YENİ EKLENEN IMPORT:
import DietListsPage from './pages/DietListsPage';

const MockPage = ({ title }) => (
    <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#382aae', mb: 2 }}>{title}</Typography>
        <Typography>Bu sayfa yapım aşamasındadır.</Typography>
    </Box>
);

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        console.log("Giriş Sinyali Alındı -> Yönlendiriliyor...");
        navigate('/clients');
    };

    return (
        <Box>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </Box>
    );
};

function App() {

    const handleLogout = () => {
        // Çıkış yapıldığında LocalStorage temizleniyor
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        console.log("Kullanıcı çıkış yaptı.");
    };

    return (
        <Router>
            <Routes>
                {/* Giriş Sayfaları */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* --- ANA SAYFALAR --- */}

                <Route path="/clients" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <ClientPage />
                    </DashboardLayout>
                } />

                <Route path="/appointments" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <AppointmentPage />
                    </DashboardLayout>
                } />

                <Route path="/diet-write" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <DietWritePage />
                    </DashboardLayout>
                } />

                {/* YENİ EKLENEN ROTA: Diyet Listeleri Tablosu */}
                <Route path="/diet-lists" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <DietListsPage />
                    </DashboardLayout>
                } />

                <Route path="/settings" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <SettingsPage />
                    </DashboardLayout>
                } />

                {/* --- YAPIM AŞAMASINDAKİ SAYFALAR (Mock) --- */}

                <Route path="/clients/add" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <MockPage title="Hasta Ekleme Ekranı" />
                    </DashboardLayout>
                } />

                <Route path="/reports" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <MockPage title="Raporlar" />
                    </DashboardLayout>
                } />

                <Route path="/contact" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <MockPage title="İletişim" />
                    </DashboardLayout>
                } />

                {/* Hatalı URL girilirse Login'e at */}
                <Route path="*" element={<LoginPage />} />

            </Routes>
        </Router>
    );
}

export default App;