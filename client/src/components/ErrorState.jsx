import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import './ErrorState.css';

export default function ErrorState({ message, onRetry }) {
  return (
    <Box className="error-state">
      <Typography variant="h6" className="error-title">
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" className="error-message">
        {message || 'Failed to load content. Please try again.'}
      </Typography>
      {onRetry && (
        <Button 
          variant="contained" 
          className="retry-button"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}
