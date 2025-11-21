import React, { useState } from 'react';
import {
    Box,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// import apiService from "../services/api.js"; // API'ye gerek kalmadı
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

    // 🚨 DEĞİŞİKLİK BURADA: KONTROLSÜZ GİRİŞ
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Hiçbir API isteği atmadan, direkt başarılı sayıyoruz.
        console.log("Giriş Bypass Edildi. İçeri alınıyor...");
        
        // "expert" adında bir kullanıcı girmiş gibi davran
        onLoginSuccess("expert"); 
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
                </Typography>

                {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <StandardTextField
                        label="Kullanıcı Adı"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
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
                        // required
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
                        Giriş Yap 
                    </StandardButton>
                </Box>

                <Divider sx={{ my: 3 }} />
            </Box>
        </Box>
    );
};

export default LoginForm;