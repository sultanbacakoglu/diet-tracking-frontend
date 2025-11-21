import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Stack,
    Button,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import apiService from '../services/api';

import AddClientModal from '../components/AddClientModal';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const PRIMARY_COLOR = '#382aae';
const BG_COLOR = '#f9fafb';

const columns = [
    {
        field: 'fullName',
        headerName: 'Hasta Adı',
        minWidth: 250,
        flex: 1,
        renderCell: (params) => {
            const name = params.value || 'İsimsiz';

            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
                        {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.row.username || ''}
                    </Typography>
                </Box>
            );
        }
    },
    { field: 'email', headerName: 'E-posta', width: 220 },
    { field: 'phoneNumber', headerName: 'Telefon', width: 150 },
    {
        field: 'lastAppointmentDate',
        headerName: 'Son Randevu',
        width: 180,
        renderCell: (params) => {
            const rawValue = params.value;
            const hasDate = rawValue && rawValue !== 'N/A';
            let displayDate = 'Randevu Yok';

            if (hasDate) {
                try {
                    displayDate = rawValue.includes('T') ? rawValue.split('T')[0] : rawValue;
                } catch (e) {
                    displayDate = rawValue;
                }
            }

            return (
                <Chip
                    label={displayDate}
                    size="small"
                    sx={{
                        bgcolor: hasDate ? PRIMARY_COLOR + '20' : '#f3f4f6',
                        color: hasDate ? PRIMARY_COLOR : '#64748b',
                        fontWeight: 600,
                        border: hasDate ? 'none' : '1px solid #e2e8f0'
                    }}
                />
            );
        }
    },
    {
        field: 'actions',
        headerName: 'İşlemler',
        width: 120,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => (
            <Stack direction="row" spacing={1}>
                <Tooltip title="Düzenle">
                    <IconButton size="small" sx={{ color: '#64748b' }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Detay">
                    <IconButton
                        size="small"
                        onClick={() => console.log('Detay:', params.row.clientId)}
                        sx={{ color: PRIMARY_COLOR }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>
        ),
    },
];

const ClientList = () => {
    const [clientData, setClientData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await apiService.getClients();
            const dataArray = Array.isArray(response.data) ? response.data : [];

            const rowsWithId = dataArray.map(client => ({
                ...client,
                id: client.clientId || Math.random(),
            }));

            setClientData(rowsWithId);
        } catch (err) {
            console.error("Client verisi çekilemedi:", err);
            setError('Danışan listesi yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Arama Filtresi
    const filteredData = clientData.filter((client) => {
        const name = client.fullName ? client.fullName.toLowerCase() : '';
        const email = client.email ? client.email.toLowerCase() : '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || email.includes(search);
    });

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress sx={{ color: PRIMARY_COLOR }} /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>;
    }

    return (
        <Box sx={{ bgcolor: BG_COLOR, minHeight: '100vh', p: 3 }}>

            {/* ÜST BAŞLIK VE BUTON */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Danışan Listesi
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Toplam {clientData.length} kayıtlı hasta.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateModalOpen(true)}
                    sx={{
                        bgcolor: PRIMARY_COLOR,
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 12px rgba(56, 42, 174, 0.2)',
                        '&:hover': { bgcolor: '#2c2196' }
                    }}
                >
                    Yeni Hasta Ekle
                </Button>
            </Stack>

            {/* ARAMA KARTI */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: 'white'
                }}
            >
                <TextField
                    placeholder="İsim veya e-posta ile ara..."
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            '& fieldset': { borderColor: '#e2e8f0' },
                            '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        height: 40,
                        px: 3
                    }}
                >
                    Filtrele
                </Button>
            </Paper>

            {/* TABLO (DATAGRID) */}
            <Paper
                elevation={0}
                sx={{
                    height: 650,
                    width: '100%',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    bgcolor: 'white'
                }}
            >
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    rowHeight={72}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 10 } }
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'white',
                            color: '#475569',
                            fontWeight: 700,
                            borderBottom: '1px solid #e2e8f0',
                        },
                        '& .MuiDataGrid-row': {
                            bgcolor: 'white',
                            '&:hover': { backgroundColor: '#f1f5f9' },
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                        },
                        '& .MuiCheckbox-root': {
                            color: '#cbd5e1',
                            '&.Mui-checked': { color: PRIMARY_COLOR },
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid #e2e8f0',
                            backgroundColor: '#fff',
                        }
                    }}
                />
            </Paper>

            {/* MODAL BİLEŞENİ */}
            <AddClientModal
                open={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={() => {
                    fetchClients(); // Ekleme başarılı olursa listeyi yenile
                }}
            />
        </Box>
    );
}

export default ClientList;