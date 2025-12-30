import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    TextField,
    Button,
    Grid,
    Avatar,
    Stack,
    IconButton,
    InputAdornment,
    Alert,
    Snackbar
} from '@mui/material';

import apiService from '../services/api';

import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PRIMARY_COLOR = '#382aae';

const INITIAL_USER = {
    firstName: "Dr. Expert",
    lastName: "Yılmaz",
    title: "Uzman Diyetisyen",
    email: "dr.expert@nutrivana.com",
    phone: "0555 999 88 77"
};

const SettingsPage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [userData, setUserData] = useState(INITIAL_USER);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        console.log("Profil güncelleniyor:", userData);
        setSnackbar({ open: true, message: 'Profil bilgileri güncellendi!', severity: 'success' });
    };

    const handleSavePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setSnackbar({ open: true, message: 'Lütfen tüm alanları doldurun.', severity: 'warning' });
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setSnackbar({ open: true, message: 'Yeni şifreler birbiriyle uyuşmuyor!', severity: 'error' });
            return;
        }

        try {
            const username = localStorage.getItem('username') || 'expert';

            const payload = {
                username: username,
                currentPassword: passwords.current,
                newPassword: passwords.new
            };

            const response = await apiService.changePassword(payload);

            setSnackbar({
                open: true,
                message: response.data?.message || 'Şifreniz başarıyla değiştirildi!',
                severity: 'success'
            });

            setPasswords({ current: '', new: '', confirm: '' });

        } catch (error) {
            console.error("Şifre değiştirme hatası:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.Message || 'Şifre değiştirilemedi. Mevcut şifrenizi kontrol edin.';

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
                Hesap Ayarları
            </Typography>

            <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#ffffff' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    // Tabs başlığının gri arka planı beyaza çekildi
                    sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#ffffff' }}
                    TabIndicatorProps={{ sx: { bgcolor: PRIMARY_COLOR, height: 3 } }}
                >
                    <Tab icon={<PersonIcon />} iconPosition="start" label="Profil Bilgileri" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 60 }} />
                    <Tab icon={<LockIcon />} iconPosition="start" label="Şifre ve Güvenlik" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 60 }} />
                </Tabs>

                {tabValue === 0 && (
                    <Box sx={{ p: 4 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                    <Avatar
                                        sx={{ width: 120, height: 120, mb: 2, bgcolor: PRIMARY_COLOR, fontSize: 40, mx: 'auto' }}
                                    >
                                        {userData.firstName[0]}
                                    </Avatar>
                                    <IconButton
                                        sx={{
                                            position: 'absolute', bottom: 16, right: 0,
                                            bgcolor: 'white', border: '1px solid #e2e8f0',
                                            '&:hover': { bgcolor: '#f1f5f9' }
                                        }}
                                        component="label"
                                    >
                                        <input hidden accept="image/*" type="file" />
                                        <PhotoCamera color="primary" fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography variant="h6" fontWeight={600}>{userData.firstName} {userData.lastName}</Typography>
                                <Typography variant="body2" color="text.secondary">{userData.title}</Typography>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Stack spacing={3}>
                                    <Alert severity="info" sx={{ py: 0 }}>
                                        Ad ve Soyad bilgileri sistemseldir, değişiklik için yöneticiyle iletişime geçiniz.
                                    </Alert>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            fullWidth label="Ad" name="firstName"
                                            value={userData.firstName}
                                            InputProps={{ readOnly: true }}
                                            variant="filled"
                                        />
                                        <TextField
                                            fullWidth label="Soyad" name="lastName"
                                            value={userData.lastName}
                                            InputProps={{ readOnly: true }}
                                            variant="filled"
                                        />
                                    </Stack>

                                    <TextField
                                        fullWidth label="Unvan" name="title"
                                        value={userData.title} onChange={handleInputChange}
                                    />

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            fullWidth label="E-posta" name="email"
                                            value={userData.email} onChange={handleInputChange}
                                        />
                                        <TextField
                                            fullWidth label="Telefon" name="phone"
                                            value={userData.phone} onChange={handleInputChange}
                                        />
                                    </Stack>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSaveProfile}
                                            sx={{ bgcolor: PRIMARY_COLOR, px: 4, py: 1.5, borderRadius: 2 }}
                                        >
                                            Değişiklikleri Kaydet
                                        </Button>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* --- TAB 2: GÜVENLİK --- */}
                {tabValue === 1 && (
                    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
                        <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
                            Kullanıcı adınız değiştirilemez. Sadece şifrenizi güncelleyebilirsiniz.
                        </Alert>

                        <Stack spacing={3}>
                            <TextField
                                fullWidth type="password"
                                label="Mevcut Şifre"
                                name="current"
                                value={passwords.current}
                                onChange={handlePasswordChange}
                            />
                            <TextField
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                label="Yeni Şifre"
                                name="new"
                                value={passwords.new}
                                onChange={handlePasswordChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                fullWidth type="password"
                                label="Yeni Şifre (Tekrar)"
                                name="confirm"
                                value={passwords.confirm}
                                onChange={handlePasswordChange}
                            />

                            <Box sx={{ pt: 2 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleSavePassword}
                                    sx={{ bgcolor: PRIMARY_COLOR, py: 1.5, borderRadius: 2 }}
                                >
                                    Şifreyi Güncelle
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                )}
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SettingsPage;