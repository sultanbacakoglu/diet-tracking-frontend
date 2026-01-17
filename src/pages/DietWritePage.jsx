import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Grid, MenuItem,
    IconButton, Stack, Alert, Snackbar, InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

import apiService from '../services/api';

const PRIMARY_COLOR = '#382aae';

const MEAL_TYPES = ["Kahvaltı", "Kuşluk", "Öğle", "İkindi", "Akşam", "Gece Ara Öğünü"];

const DietWritePage = () => {
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [rows, setRows] = useState([
        { day: 'Pazartesi', meal: 'Kahvaltı', content: '' }
    ]);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await apiService.getClients();
                setClients(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Danışanlar yüklenemedi", error);
            }
        };
        fetchClients();
    }, []);

    const handleAddRow = () => {
        const lastDay = rows.length > 0 ? rows[rows.length - 1].day : 'Pazartesi';
        setRows([...rows, { day: lastDay, meal: 'Öğle', content: '' }]);
    };

    const handleRemoveRow = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    const handleRowChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const handleSubmit = async () => {
        if (!selectedClientId || !title) {
            setSnackbar({ open: true, message: 'Lütfen danışan seçin ve liste başlığı girin.', severity: 'warning' });
            return;
        }

        const payload = {
            clientId: selectedClientId,
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            details: rows
        };

        try {
            await apiService.createDietList(payload);
            setSnackbar({ open: true, message: 'Diyet listesi başarıyla kaydedildi!', severity: 'success' });
            setTitle('');
            setDescription('');
            setRows([{ day: 'Pazartesi', meal: 'Kahvaltı', content: '' }]);
        } catch (error) {
            console.error("Kayıt hatası", error);
            setSnackbar({ open: true, message: 'Kaydedilirken bir hata oluştu.', severity: 'error' });
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Diyet Listesi Oluştur
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    sx={{ bgcolor: PRIMARY_COLOR, px: 4, py: 1.5, borderRadius: 2 }}
                >
                    Listeyi Kaydet
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {/* SOL TARAF: GENEL BİLGİLER */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                        <Stack spacing={3}>
                            <Typography variant="h6" fontWeight={600} color={PRIMARY_COLOR}>
                                Liste Bilgileri
                            </Typography>

                            <TextField
                                select
                                label="Danışan Seç"
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                fullWidth
                                sx={{ bgcolor: '#ffffff' }}
                            >
                                {clients.map((client) => (
                                    <MenuItem key={client.userId} value={client.clientId || client.userId}>
                                        {client.fullName || client.username}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Liste Başlığı"
                                placeholder="Örn: 1. Hafta Detoks"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                sx={{ bgcolor: '#ffffff' }}
                            />

                            <Stack direction="row" spacing={2}>
                                <TextField
                                    type="date"
                                    label="Başlangıç"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    sx={{ bgcolor: '#ffffff' }}
                                />
                                <TextField
                                    type="date"
                                    label="Bitiş"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    sx={{ bgcolor: '#ffffff' }}
                                />
                            </Stack>

                            <TextField
                                label="Genel Notlar"
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Danışan için özel notlar..."
                                fullWidth
                                sx={{ bgcolor: '#ffffff' }}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                {/* SAĞ TARAF: DİYET İÇERİĞİ (GÜNCELLENDİ) */}
                <Grid item xs={12} md={8}>
                    {/* Ana Kutu Arka Planı #ffffff yapıldı */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', minHeight: 500, bgcolor: '#ffffff' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="h6" fontWeight={600} color={PRIMARY_COLOR}>
                                Öğün Planı
                            </Typography>
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleAddRow}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Satır Ekle
                            </Button>
                        </Stack>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {rows.map((row, index) => (
                                <Paper
                                    key={index}
                                    elevation={0}
                                    // Satırların arka planı da #ffffff (beyaz) yapıldı
                                    sx={{
                                        p: 2,
                                        bgcolor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 2,
                                        display: 'flex',
                                        gap: 2,
                                        alignItems: 'start'
                                    }}
                                >
                                    <TextField
                                        label="Gün"
                                        value={row.day}
                                        onChange={(e) => handleRowChange(index, 'day', e.target.value)}
                                        sx={{ width: 150, bgcolor: '#ffffff' }}
                                        placeholder="Pazartesi"
                                    />
                                    <TextField
                                        select
                                        label="Öğün"
                                        value={row.meal}
                                        onChange={(e) => handleRowChange(index, 'meal', e.target.value)}
                                        sx={{ width: 150, bgcolor: '#ffffff' }}
                                    >
                                        {MEAL_TYPES.map(type => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        label="İçerik"
                                        value={row.content}
                                        onChange={(e) => handleRowChange(index, 'content', e.target.value)}
                                        fullWidth
                                        multiline
                                        placeholder="2 yumurta..."
                                        sx={{ bgcolor: '#ffffff' }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <RestaurantMenuIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleRemoveRow(index)}
                                        color="error"
                                        sx={{ mt: 1 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Paper>
                            ))}
                        </Box>

                        {rows.length === 0 && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Henüz hiç öğün eklenmedi. "Satır Ekle" butonunu kullanarak başlayın.
                            </Alert>
                        )}

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleAddRow}
                            sx={{ mt: 3, borderStyle: 'dashed', py: 2, bgcolor: '#ffffff' }}
                        >
                            Yeni Öğün Ekle
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DietWritePage;