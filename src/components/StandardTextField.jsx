import React from 'react';
import { TextField } from '@mui/material';

const StandardTextField = ({ variant = 'outlined', size = 'small', fullWidth = true, ...props }) => {
    return (
        <TextField
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            {...props}
        />
    );
};

export default StandardTextField;