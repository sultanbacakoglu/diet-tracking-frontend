import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Tooltip,
    Stack,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';

import apiService from '../services/api';

const PRIMARY_COLOR = '#382aae';

const DietListsPage = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Detay Modalı için State'ler
    const [openModal, setOpenModal] = useState(false);
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // --- Tablo Kolonları ---
    const columns = [
        {
            field: 'clientName',
            headerName: 'Danışan',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={600}>
                    {params.value}
                </Typography>
            )
        },
        { field: 'title', headerName: 'Liste Başlığı', width: 250 },
        {
            field: 'startDate',
            headerName: 'Başlangıç',
            width: 150,
            renderCell: (params) => (
                <Chip
                    icon={<CalendarTodayIcon style={{ fontSize: 14 }} />}
                    label={params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#e2e8f0', bgcolor: 'white' }}
                />
            )
        },
        {
            field: 'endDate',
            headerName: 'Bitiş',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#e2e8f0', bgcolor: 'white' }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Detayları Gör">
                        <IconButton
                            size="small"
                            sx={{ color: PRIMARY_COLOR, bgcolor: '#f8fafc' }}
                            onClick={() => handleViewDetails(params.row.id)}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                        <IconButton size="small" color="error" sx={{ bgcolor: '#fff1f2' }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    // Verileri API'den Çek
    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const response = await apiService.getDietLists();
            const dataWithId = response.data.map(item => ({
                ...item,
                id: item.dietListId
            }));
            setRows(dataWithId);
        } catch (err) {
            console.error("Listeler yüklenemedi", err);
            setError("Diyet listeleri alınırken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Detay Butonuna Tıklanınca
    const handleViewDetails = async (id) => {
        setOpenModal(true);
        setDetailsLoading(true);
        setSelectedDiet(null);
        try {
            const response = await apiService.getDietListById(id);
            setSelectedDiet(response.data);
        } catch (error) {
            console.error("Detay hatası", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 2, color: PRIMARY_COLOR, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <RestaurantMenuIcon />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Diyet Listeleri
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sistemde kayıtlı toplam {rows.length} diyet programı var.
                    </Typography>
                </Box>
            </Stack>

            {/* TABLO */}
            <Paper elevation={0} sx={{ height: 650, width: '100%', bgcolor: '#ffffff', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20]}
                    disableSelectionOnClick
                    sx={{
                        border: 0,
                        backgroundColor: '#ffffff',
                        // Header (Başlık) Ayarları
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#ffffff', // Tamamen Beyaz
                            color: '#1e293b',
                            fontWeight: 700,
                            borderBottom: '1px solid #e2e8f0' // Ayrım için ince çizgi
                        },
                        // Satır Ayarları
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #f1f5f9'
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#f8fafc' // Hover efekti çok açık gri
                        },
                        // Footer (Sayfalama) Ayarları
                        '& .MuiDataGrid-footerContainer': {
                            backgroundColor: '#ffffff',
                            borderTop: '1px solid #e2e8f0'
                        }
                    }}
                />
            </Paper>

            {/* DETAY PENCERESİ (MODAL) */}
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>Diyet Detayları</Typography>
                    <IconButton onClick={() => setOpenModal(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />

                <DialogContent sx={{ minHeight: 200 }}>
                    {detailsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={30} /></Box>
                    ) : selectedDiet ? (
                        <Box>
                            {/* Başlık Bilgileri */}
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Typography variant="h6" color="primary">{selectedDiet.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{selectedDiet.description || "Açıklama yok."}</Typography>
                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <Chip size="small" label={`Başlangıç: ${new Date(selectedDiet.startDate).toLocaleDateString('tr-TR')}`} />
                                    <Chip size="small" label={`Bitiş: ${new Date(selectedDiet.endDate).toLocaleDateString('tr-TR')}`} />
                                </Stack>
                            </Stack>

                            <Divider sx={{ mb: 2 }}>MENÜ</Divider>

                            {/* Yemek Listesi */}
                            <List sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                {selectedDiet.details && selectedDiet.details.length > 0 ? (
                                    selectedDiet.details.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem alignItems="flex-start">
                                                <Box sx={{ minWidth: 80, mr: 2 }}>
                                                    <Typography variant="subtitle2" fontWeight={700} color="#334155">{item.day}</Typography>
                                                    <Typography variant="caption" color="primary" fontWeight={600}>{item.meal}</Typography>
                                                </Box>
                                                <ListItemText
                                                    primary={item.content}
                                                    primaryTypographyProps={{ fontSize: '0.95rem', color: '#1e293b' }}
                                                />
                                            </ListItem>
                                            {index < selectedDiet.details.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>Bu listede detay bulunmuyor.</Box>
                                )}
                            </List>
                        </Box>
                    ) : (
                        <Alert severity="warning">Veri bulunamadı.</Alert>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenModal(false)} variant="outlined" color="inherit">Kapat</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DietListsPage;