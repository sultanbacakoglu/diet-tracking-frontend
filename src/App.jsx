import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; 
import { Typography, Box } from '@mui/material';

import DashboardLayout from './components/DashboardLayout';
import ClientPage from './pages/ClientPage';
import LoginForm from './components/LoginForm';

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
        localStorage.removeItem('userToken');
        console.log("Kullanıcı çıkış yaptı.");
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/clients" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <ClientPage />
                    </DashboardLayout>
                } />

                <Route path="/appointments" element={
                    <DashboardLayout expertName="Dr. Expert" onLogout={handleLogout}>
                        <MockPage title="Randevular" />
                    </DashboardLayout>
                } />

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
                
                <Route path="*" element={<LoginPage />} />

            </Routes>
        </Router>
    );
}

export default App;