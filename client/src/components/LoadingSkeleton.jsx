import React from 'react';
import { Box, Skeleton } from '@mui/material';
import './LoadingSkeleton.css';

export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  if (type === 'hero') {
    return (
      <Box className="skeleton-hero">
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={500} 
          sx={{ bgcolor: '#0E1C12' }}
        />
      </Box>
    );
  }

  if (type === 'row') {
    return (
      <Box className="skeleton-row">
        <Skeleton 
          variant="text" 
          width={200} 
          height={40} 
          sx={{ bgcolor: '#0E1C12', mb: 3 }}
        />
        <Box sx={{ display: 'flex', gap: 3 }}>
          {[...Array(count)].map((_, i) => (
            <Box key={i} sx={{ flex: '0 0 200px' }}>
              <Skeleton 
                variant="rectangular" 
                width={200} 
                height={300} 
                sx={{ bgcolor: '#0E1C12' }}
              />
              <Skeleton 
                variant="text" 
                width={180} 
                height={24} 
                sx={{ bgcolor: '#0E1C12', mt: 1 }}
              />
              <Skeleton 
                variant="text" 
                width={120} 
                height={20} 
                sx={{ bgcolor: '#0E1C12' }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // Default card skeleton
  return (
    <Box className="skeleton-card">
      <Skeleton 
        variant="rectangular" 
        width={200} 
        height={300} 
        sx={{ bgcolor: '#0E1C12' }}
      />
      <Skeleton 
        variant="text" 
        width={180} 
        height={24} 
        sx={{ bgcolor: '#0E1C12', mt: 1 }}
      />
      <Skeleton 
        variant="text" 
        width={120} 
        height={20} 
        sx={{ bgcolor: '#0E1C12' }}
      />
    </Box>
  );
}
