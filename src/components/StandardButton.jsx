import React from 'react';
import { Button } from '@mui/material';

const StandardButton = ({ children, variant = 'contained', color = 'primary', ...props }) => {
    return (
        <Button

            variant={variant}
            color={color}
            {...props}
        >
            {children}
        </Button>
    );
};

export default StandardButton;