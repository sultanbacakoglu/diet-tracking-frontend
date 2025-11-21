import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Alert,
    IconButton,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import apiService from '../services/api';

const PRIMARY_COLOR = '#382aae';

const AddClientModal = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Lütfen zorunlu alanları doldurun.');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,

            username: formData.email,
            passwordHash: "Danisan123!"
        };

        try {
            await apiService.createClient(payload);
            onSuccess();
            handleClose();
        } catch (err) {
            console.error("Ekleme hatası:", err);
            setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '' });
        setError(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 4, padding: 1 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Yeni Danışan Ekle
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ border: 'none' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            autoFocus
                            label="Ad"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Soyad"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                    </Stack>

                    <TextField
                        label="E-posta Adresi"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />

                    <TextField
                        label="Telefon Numarası"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="05XX XXX XX XX"
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleClose}
                    variant="text"
                    sx={{ color: '#64748b', fontWeight: 600, borderRadius: 2 }}
                >
                    İptal
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        bgcolor: PRIMARY_COLOR,
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 4,
                        '&:hover': { bgcolor: '#2c2196' }
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientModal;