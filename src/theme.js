import { createTheme } from '@mui/material/styles';
import { blue, deepOrange } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: blue[700],
        },
        secondary: {
            main: deepOrange[500],
        },
        background: {
            default: '#ffffff',
            paper: '#f4f6f8',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
        ].join(','),
        h3: {
            fontWeight: 600,
        }
    },
    components: {
        MuiTextField: {
            defaultProps: {
                size: 'small',
                variant: 'outlined',
            },
        },
    },
});

export default theme;