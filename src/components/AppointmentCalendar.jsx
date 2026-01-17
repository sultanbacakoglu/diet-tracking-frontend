import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, IconButton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Stack, alpha,
    Paper, Tooltip, CircularProgress
} from '@mui/material';
import {
    ChevronLeft, ChevronRight, Add, CalendarMonth,
    AccessTime, Person, Today
} from '@mui/icons-material';

import apiService from '../services/api';

const WEEKDAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

// Geniş ve canlı randevu renk paleti
const APPT_PALETTE = [
    { bg: '#FFEDD5', text: '#9A3412', border: '#FB923C' }, // Turuncu
    { bg: '#DBEAFE', text: '#1E40AF', border: '#60A5FA' }, // Mavi
    { bg: '#D1FAE5', text: '#065F46', border: '#34D399' }, // Yeşil
    { bg: '#F3E8FF', text: '#6B21A8', border: '#A855F7' }, // Mor
    { bg: '#FCE7F3', text: '#9D174D', border: '#F472B6' }, // Pembe
    { bg: '#E0F2FE', text: '#075985', border: '#38BDF8' }, // Açık Mavi
    { bg: '#FEF9C3', text: '#854D0E', border: '#FACC15' }, // Sarı
    { bg: '#F1F5F9', text: '#334155', border: '#94A3B8' }, // Gri/Mavi
    { bg: '#FFCFD2', text: '#9B2226', border: '#EF4444' }, // Kırmızı
    { bg: '#E9EDC9', text: '#31572C', border: '#AACC00' }, // Zeytin
];

const AppointmentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newAppt, setNewAppt] = useState({
        clientId: '', title: '', date: new Date().toISOString().split('T')[0],
        time: '09:00', duration: 60, typeId: 1, notes: ''
    });

    useEffect(() => {
        fetchAppointments();
        fetchClients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await apiService.getAppointments();
            setAppointments(Array.isArray(res.data) ? res.data : []);
        } catch (error) { console.error(error); }
    };

    const fetchClients = async () => {
        try {
            const res = await apiService.getClients();
            setClients(Array.isArray(res.data) ? res.data : []);
        } catch (error) { console.error(error); }
    };

    // Randevu ID'sine göre her seferinde farklı ama o randevu için sabit bir renk döner
    const getRandomColor = (id) => {
        const index = id ? id % APPT_PALETTE.length : Math.floor(Math.random() * APPT_PALETTE.length);
        return APPT_PALETTE[index];
    };

    const days = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Pazartesi başlangıçlı takvim ayarı
        const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const calendarDays = [];

        for (let i = 0; i < startOffset; i++) calendarDays.push(null);
        for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(year, month, i));

        return calendarDays;
    }, [currentDate]);

    return (
        <Box sx={{ p: 4, bgcolor: '#fdfdfd', minHeight: '100vh' }}>
            {/* ÜST PANEL */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <CalendarMonth sx={{ fontSize: 40, color: '#382aae' }} />
                    <Box>
                        <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b', letterSpacing: '-1px' }}>
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Toplam {appointments.length} kayıtlı randevu bulundu.
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', bgcolor: 'white', display: 'flex', overflow: 'hidden' }}>
                        <IconButton onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} sx={{ borderRadius: 0 }}><ChevronLeft /></IconButton>
                        <Button onClick={() => setCurrentDate(new Date())} sx={{ borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderRadius: 0, px: 3, color: '#1e293b', fontWeight: 700 }}>Bugün</Button>
                        <IconButton onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} sx={{ borderRadius: 0 }}><ChevronRight /></IconButton>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenModal(true)}
                        sx={{ bgcolor: '#382aae', px: 3, borderRadius: '12px', fontWeight: 700, textTransform: 'none', boxShadow: '0 10px 15px -3px rgba(56, 42, 174, 0.3)' }}
                    >
                        Yeni Randevu
                    </Button>
                </Stack>
            </Stack>

            {/* TAKVİM IZGARASI (Bütünleşik Yapı) */}
            <Box sx={{
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                bgcolor: 'white',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}>
                {/* Gün İsimleri */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {WEEKDAYS.map(day => (
                        <Box key={day} sx={{ py: 2, textAlign: 'center' }}>
                            <Typography variant="caption" fontWeight={800} sx={{ color: '#64748b', textTransform: 'uppercase' }}>{day}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Gün Hücreleri */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {days.map((date, index) => {
                        const isToday = date && new Date().toDateString() === date.toDateString();
                        const dayAppts = appointments.filter(apt => {
                            const d = new Date(apt.startDate);
                            return date && d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
                        });

                        return (
                            <Box
                                key={index}
                                sx={{
                                    minHeight: 150,
                                    p: 1,
                                    borderRight: (index + 1) % 7 === 0 ? 'none' : '1px solid #e2e8f0',
                                    borderBottom: '1px solid #e2e8f0',
                                    bgcolor: date ? (isToday ? alpha('#382aae', 0.02) : 'white') : '#f1f5f9',
                                    transition: 'background 0.2s',
                                    '&:hover': date ? { bgcolor: '#f8fafc' } : {}
                                }}
                            >
                                {date && (
                                    <>
                                        <Typography
                                            variant="body2"
                                            fontWeight={800}
                                            sx={{
                                                width: 28, height: 28,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: '50%', mb: 1,
                                                color: isToday ? 'white' : '#1e293b',
                                                bgcolor: isToday ? '#382aae' : 'transparent'
                                            }}
                                        >
                                            {date.getDate()}
                                        </Typography>

                                        <Stack spacing={0.5}>
                                            {dayAppts.map(apt => {
                                                const color = getRandomColor(apt.appointmentId);
                                                return (
                                                    <Tooltip key={apt.appointmentId} title={`${apt.title} - ${new Date(apt.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}>
                                                        <Box sx={{
                                                            p: '4px 8px',
                                                            borderRadius: '6px',
                                                            bgcolor: color.bg,
                                                            borderLeft: `3px solid ${color.border}`,
                                                            cursor: 'pointer',
                                                            '&:hover': { opacity: 0.8 }
                                                        }}>
                                                            <Typography variant="caption" noWrap sx={{ color: color.text, fontWeight: 700, fontSize: '0.7rem', display: 'block' }}>
                                                                {new Date(apt.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {apt.title}
                                                            </Typography>
                                                        </Box>
                                                    </Tooltip>
                                                );
                                            })}
                                        </Stack>
                                    </>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* MODAL TASARIMI AYNI KALABİLİR VEYA İHTİYACA GÖRE GÜNCELLENEBİLİR */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '20px' } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Randevu Planla</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField select label="Danışan Seç" fullWidth value={newAppt.clientId} onChange={(e) => setNewAppt({...newAppt, clientId: e.target.value})}>
                            {clients.map(c => <MenuItem key={c.clientId} value={c.clientId}>{c.fullName || c.username}</MenuItem>)}
                        </TextField>
                        <TextField label="Başlık" fullWidth value={newAppt.title} onChange={(e) => setNewAppt({...newAppt, title: e.target.value})} />
                        <Stack direction="row" spacing={2}>
                            <TextField type="date" label="Tarih" fullWidth InputLabelProps={{ shrink: true }} value={newAppt.date} onChange={(e) => setNewAppt({...newAppt, date: e.target.value})} />
                            <TextField type="time" label="Saat" fullWidth InputLabelProps={{ shrink: true }} value={newAppt.time} onChange={(e) => setNewAppt({...newAppt, time: e.target.value})} />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenModal(false)} sx={{ fontWeight: 700, color: '#64748b' }}>İptal</Button>
                    <Button onClick={() => {}} variant="contained" sx={{ bgcolor: '#382aae', fontWeight: 700, px: 4, borderRadius: '10px' }}>Kaydet</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AppointmentCalendar;