import React from 'react';
import { Box, Typography } from '@mui/material';
import ParkIcon from '@mui/icons-material/Park';
import './Logo.css';

export default function Logo({ onClick, size = 'medium' }) {
  const sizes = {
    small: { icon: 24, text: 'h6' },
    medium: { icon: 32, text: 'h5' },
    large: { icon: 40, text: 'h4' },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <Box className="mocaemtui-logo" onClick={onClick}>
      <ParkIcon 
        className="logo-icon" 
        sx={{ fontSize: currentSize.icon }}
      />
      <Typography 
        variant={currentSize.text} 
        className="logo-text"
      >
        mocaemtui
      </Typography>
    </Box>
  );
}
