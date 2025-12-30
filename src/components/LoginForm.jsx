import React, { useState } from 'react';
import {
    Box,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// ÖNEMLİ: apiService dosyasının yolu doğru olmalı.
// Dosya yapına göre '../services/apiService' veya './apiService' olabilir.
import apiService from '../services/api';

import StandardTextField from "./StandardTextField.jsx";
import StandardButton from "./StandardButton.jsx";

const initialFormState = {
    username: '',
    password: '',
};

const LoginForm = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setLoginError(null);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // --- GERÇEK GİRİŞ İŞLEMİ ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Basit Boş Alan Kontrolü
        if (!formData.username || !formData.password) {
            setLoginError("Lütfen kullanıcı adı ve şifreyi giriniz.");
            return;
        }

        setLoading(true);
        setLoginError(null);

        try {
            // 2. Backend'e İstek Gönder
            const response = await apiService.login({
                username: formData.username,
                password: formData.password
            });

            // 3. Başarılıysa
            // Backend'den dönen veriyi al (response.data içinde: { Message, Username, Role, UserId ... })
            const data = response.data;
            console.log("Giriş Başarılı:", data);

            // Kullanıcı bilgilerini tarayıcıya kaydet (Ayarlar sayfasında kullanmak için)
            localStorage.setItem('username', data.username || formData.username);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);

            // Ana sayfaya yönlendir (App.js'deki fonksiyonu tetikle)
            onLoginSuccess(data.username);

        } catch (error) {
            console.error("Giriş Hatası:", error);
            // Backend'den gelen hata mesajını göster
            // Backend "Unauthorized" dönerse error.response.data.message içinde mesaj olur.
            const errorMessage = error.response?.data?.message || error.response?.data?.Message || "Giriş başarısız. Bilgilerinizi kontrol edin.";
            setLoginError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }
            }}
        >
            {/* Sol Bölüm: Tanıtım ve Bilgi */}
            <Box
                sx={{
                    flex: 1,
                    p: { xs: 5, md: 8 },
                    bgcolor: '#4338ca',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    color: 'white',
                    minHeight: { xs: 300, md: '100vh' }
                }}
            >
                <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Diyet Takip Sistemi
                    </Typography>
                    <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                        Klinik Yönetim Sistemi
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        Bu sistem, diyetisyenlerin günlük çalışma rutinlerini hızlandırmak ve danışan yönetimini profesyonel bir seviyeye taşımak için geliştirilmiştir.
                    </Typography>

                    <Box sx={{ mt: 5, textAlign: 'center' }}>
                        <PersonOutlineIcon sx={{ fontSize: 80, color: 'rgba(255,255,255, 0.5)' }} />
                    </Box>
                </Box>
            </Box>

            {/* Sağ Bölüm: Giriş Formu */}
            <Box
                sx={{
                    flex: 1,
                    p: { xs: 4, md: 6 },
                    bgcolor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: { xs: 'auto', md: '100vh' }
                }}
            >
                <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 600 }}>
                    Giriş Yap
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Devam etmek için hesabınıza giriş yapın.
                </Typography>

                {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <StandardTextField
                        label="Kullanıcı Adı"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={loading} // Yüklenirken engelle
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>),
                        }}
                    />

                    <StandardTextField
                        label="Parola"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading} // Yüklenirken engelle
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <StandardButton
                        type="submit"
                        fullWidth
                        sx={{ py: 1.5, mt: 2, bgcolor: '#4338ca', '&:hover': { bgcolor: '#382aae' }, color: '#ffffff' }}
                        color="inherit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Giriş Yap"}
                    </StandardButton>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="caption" color="text.secondary" align="center">
                    Giriş bilgilerinizi unuttuysanız sistem yöneticisine başvurunuz.
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginForm;