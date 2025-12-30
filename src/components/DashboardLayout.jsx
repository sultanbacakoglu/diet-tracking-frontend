import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Badge,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PhoneIcon from '@mui/icons-material/Phone';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BG_COLOR = '#f9fafb';
const PRIMARY_COLOR = '#382aae';
const DRAWER_WIDTH = 240;
const HEADER_HEIGHT = 64;

const DashboardLayout = ({ expertName, onLogout, children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const handleLogoutClick = () => {
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
    };

    const sidebarItems = [
        { text: 'Randevular', icon: <EventNoteIcon />, path: '/appointments' },
        { text: 'Hasta Ekle', icon: <AddCircleOutlineIcon />, path: '/clients/add' },
        { text: 'Hasta Listesi', icon: <PeopleIcon />, path: '/clients' },
        { text: 'Raporlar', icon: <AssessmentIcon />, path: '/reports' },
        { text: 'İletişim', icon: <PhoneIcon />, path: '/contact' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            {/* LOGO ALANI */}
            <Toolbar sx={{
                minHeight: HEADER_HEIGHT,
                height: HEADER_HEIGHT,
                bgcolor: 'white',
                color: 'text.primary',
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                px: 3
            }}>
                <Typography variant="h6" noWrap sx={{ fontWeight: '800', color: PRIMARY_COLOR, lineHeight: 1, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                    nutrivana
                </Typography>
                <Typography variant="caption" noWrap color="text.secondary" sx={{ color: PRIMARY_COLOR, fontSize: '0.65rem', mt: 0.4, opacity: 0.8 }}>
                    klinik yönetim sistemi
                </Typography>
            </Toolbar>

            {/* MENÜ LİSTESİ */}
            <List sx={{ flexGrow: 1, py: 1 }}>
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5, bgcolor: isActive ? '#EDE7F6' : 'inherit', color: isActive ? '#673AB7' : 'text.primary', borderRight: isActive ? '3px solid' : 'none', borderColor: isActive ? '#673AB7' : 'none' }}>
                            <ListItemButton onClick={() => handleMenuItemClick(item.path)} sx={{ py: 1 }}>
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* ALT MENÜ (Ayarlar & Çıkış) */}
            <List sx={{ borderTop: 1, borderColor: 'divider' }}>
                <ListItem disablePadding sx={{ bgcolor: location.pathname === '/settings' ? '#EDE7F6' : 'inherit', color: location.pathname === '/settings' ? '#673AB7' : 'inherit' }}>
                    <ListItemButton onClick={() => handleMenuItemClick('/settings')}>
                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Ayarlar" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: location.pathname === '/settings' ? 600 : 400 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogoutClick}>
                        <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon color="error" /></ListItemIcon>
                        <ListItemText primary="Çıkış Yap" sx={{ color: 'error.main' }} primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* ÜST BAR (AppBar) */}
            <AppBar position="fixed" elevation={0} sx={{ width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { sm: `${DRAWER_WIDTH}px` }, bgcolor: 'white', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar sx={{ minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT }}>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}><MenuIcon /></IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="medium" color="inherit" sx={{ color: '#64748b' }}>
                            <Badge badgeContent={4} color="error"><NotificationsIcon /></Badge>
                        </IconButton>

                        <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 24, alignSelf: 'center' }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <Typography variant="body2" sx={{ mr: 1.5, fontWeight: 600, color: '#334155' }}>{expertName}</Typography>
                            <Box sx={{ bgcolor: PRIMARY_COLOR, color: 'white', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 2px 5px rgba(56, 42, 174, 0.2)' }}>
                                {expertName ? expertName[0].toUpperCase() : <AccountCircleIcon />}
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* SIDEBAR */}
            <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH } }}>{drawer}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: 1, borderColor: 'divider' } }} open>{drawer}</Drawer>
            </Box>

            {/* ANA İÇERİK */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', bgcolor: BG_COLOR }}>
                <Toolbar sx={{ minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT }} />
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;