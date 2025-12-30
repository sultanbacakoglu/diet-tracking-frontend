import React, { useState, useEffect } from 'react';
import {
    Box, Typography, IconButton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Stack, Tooltip, Divider, useTheme, alpha
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CircleIcon from '@mui/icons-material/Circle';

import apiService from '../services/api';

// --- SABİTLER ---
const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const PRIMARY_COLOR = '#382aae';

// 🎨 GÜZEL GÖRÜNEN RENK PALETİ
const COLOR_PALETTE = [
    '#382aae', // Mor (Primary)
    '#10b981', // Yeşil
    '#f59e0b', // Turuncu
    '#ef4444', // Kırmızı
    '#06b6d4', // Camgöbeği
    '#8b5cf6', // Menekşe
    '#ec4899', // Pembe
];

const AppointmentCalendar = () => {
    const theme = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    // Form State
    const [newAppt, setNewAppt] = useState({
        title: '',
        typeId: 1,
        date: '',
        time: '',
        notes: ''
    });

    // --- 🔥 RASTGELE RENK MANTIĞI ---
    // Randevu ID'sine göre mod alarak listeden renk seçer.
    // Böylece aynı randevu hep aynı renkte kalır ama hepsi farklı görünür.
    const getAppointmentColor = (id) => {
        if (!id) return COLOR_PALETTE[0];
        return COLOR_PALETTE[id % COLOR_PALETTE.length];
    };

    // --- 1. VERİLERİ ÇEKME (GET) ---
    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const response = await apiService.getAppointments();

            const formattedData = response.data.map(item => ({
                id: item.appointmentId,
                title: item.title,
                date: new Date(item.startDate),
                type: item.typeDescription || "Genel",
                notes: item.notes
            }));

            setAppointments(formattedData);
        } catch (error) {
            console.error("Randevular yüklenemedi:", error);
        }
    };

    // --- TAKVİM TARİH MANTIĞI ---
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => {
        let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1;
    };
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    // --- 2. YENİ RANDEVU EKLEME (POST) ---
    const handleAddSubmit = async () => {
        if (!newAppt.title || !newAppt.date || !newAppt.time) {
            alert("Lütfen gerekli alanları doldurunuz.");
            return;
        }

        const startDateTime = new Date(`${newAppt.date}T${newAppt.time}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        const payload = {
            title: newAppt.title,
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            notes: newAppt.notes || "",
            clientId: 6, // Sabit test ID
            appointmentStatusId: 1,
            appointmentTypeId: parseInt(newAppt.typeId)
        };

        try {
            await apiService.createAppointment(payload);
            setOpenModal(false);
            setNewAppt({ title: '', typeId: 1, date: '', time: '', notes: '' });
            loadAppointments();
        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert("Hata oluştu.");
        }
    };

    // --- RENDER FONKSİYONLARI ---
    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const startDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const cellBorderColor = alpha(theme.palette.divider, 0.5);

        for (let i = 0; i < startDay; i++) {
            days.push(<Box key={`empty-${i}`} sx={{ minHeight: 120, borderRight: `1px solid ${cellBorderColor}`, borderBottom: `1px solid ${cellBorderColor}`, bgcolor: '#ffffff' }} />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const isToday = new Date().toDateString() === currentDayDate.toDateString();

            const dayAppointments = appointments.filter(app =>
                app.date.getDate() === i &&
                app.date.getMonth() === currentDate.getMonth() &&
                app.date.getFullYear() === currentDate.getFullYear()
            );

            days.push(
                <Box key={i} sx={{ minHeight: 120, borderRight: `1px solid ${cellBorderColor}`, borderBottom: `1px solid ${cellBorderColor}`, bgcolor: '#ffffff', p: 1, '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.04) } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : '500', color: isToday ? 'primary.contrastText' : 'text.secondary', bgcolor: isToday ? 'primary.main' : 'transparent', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                            {i}
                        </Typography>
                    </Box>
                    <Stack spacing={0.5} sx={{ overflowY: 'auto', maxHeight: '85px' }}>
                        {dayAppointments.map((app) => {
                            // 🔥 RENK SEÇİMİ: ID'ye göre listeden seç
                            const appColor = getAppointmentColor(app.id);

                            return (
                                <Tooltip key={app.id} title={`${app.title} - ${app.type}`} placement="top" arrow>
                                    <Box sx={{
                                        p: '3px 8px',
                                        borderRadius: 1,
                                        bgcolor: alpha(appColor, 0.1),
                                        borderLeft: `4px solid ${appColor}`,
                                        cursor: 'pointer',
                                        transition: '0.2s',
                                        '&:hover': { bgcolor: alpha(appColor, 0.2) }
                                    }}>
                                        <Typography noWrap variant="caption" sx={{ fontWeight: 700, color: '#1e293b', display: 'block', fontSize: '0.75rem' }}>
                                            {app.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTimeIcon sx={{ fontSize: 10, color: appColor }} />
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>
                                                {app.date.getHours()}:{app.date.getMinutes().toString().padStart(2, '0')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </Stack>
                </Box>
            );
        }
        return days;
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* HEADER */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <IconButton onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton>
                        <Button onClick={handleToday} sx={{ color: 'text.primary', px: 2, minWidth: 'auto', borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider', borderRadius: 0 }}>Bugün</Button>
                        <IconButton onClick={handleNextMonth}><ChevronRightIcon /></IconButton>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)} sx={{ borderRadius: 2, bgcolor: PRIMARY_COLOR, textTransform: 'none', boxShadow: 'none' }}>Randevu Ekle</Button>
                </Stack>
            </Box>

            {/* TAKVİM GRID */}
            <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#ffffff' }}>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
                        {WEEKDAYS.map(day => (
                            <Box key={day} sx={{ py: 1.5, borderRight: '1px solid', borderColor: 'divider', '&:last-child': { borderRight: 'none' } }}>
                                <Typography align="center" variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{day}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', bgcolor: '#ffffff' }}>
                        {renderCalendarDays()}
                    </Box>
                </Box>
            </Box>

            {/* MODAL */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Randevu Ekle</DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Danışan Adı Soyadı"
                            fullWidth
                            size="small"
                            value={newAppt.title}
                            onChange={(e) => setNewAppt({...newAppt, title: e.target.value})}
                            InputProps={{ startAdornment: <PersonIcon color="action" sx={{ mr: 1, fontSize: 20 }} /> }}
                        />

                        <TextField
                            select
                            label="Randevu Tipi"
                            fullWidth
                            size="small"
                            value={newAppt.typeId}
                            onChange={(e) => setNewAppt({...newAppt, typeId: e.target.value})}
                        >
                            <MenuItem value={1}>Online Diyet</MenuItem>
                            <MenuItem value={2}>Yüz Yüze</MenuItem>
                            <MenuItem value={3}>Kontrol</MenuItem>
                        </TextField>

                        <TextField label="Notlar" fullWidth multiline rows={2} size="small" value={newAppt.notes} onChange={(e) => setNewAppt({...newAppt, notes: e.target.value})} />

                        <Stack direction="row" spacing={2}>
                            <TextField type="date" label="Tarih" fullWidth size="small" InputLabelProps={{ shrink: true }} value={newAppt.date} onChange={(e) => setNewAppt({...newAppt, date: e.target.value})} />
                            <TextField type="time" label="Saat" fullWidth size="small" InputLabelProps={{ shrink: true }} value={newAppt.time} onChange={(e) => setNewAppt({...newAppt, time: e.target.value})} />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenModal(false)} color="inherit">Vazgeç</Button>
                    <Button onClick={handleAddSubmit} variant="contained" disableElevation sx={{ bgcolor: PRIMARY_COLOR }}>Kaydet</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AppointmentCalendar;