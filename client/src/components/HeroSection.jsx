import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import './HeroSection.css';

export default function HeroSection({ movie, onWatchClick, onAddToList, onMoreInfo }) {
  if (!movie) {
    return null;
  }

  const backdropStyle = movie.backdropUrl 
    ? { backgroundImage: `url(${movie.backdropUrl})` }
    : { background: 'linear-gradient(135deg, #050A06 0%, #0E1C12 50%, #16A34A 100%)' };

  const overview = movie.overview || 'Hiện chưa có mô tả tiếng Việt cho phim này.';
  const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
  const year = movie.year || 'N/A';

  return (
    <Box className="hero-section">
      <Box 
        className="hero-background"
        style={backdropStyle}
      >
        <Box className="hero-gradient" />
      </Box>
      
      <Box className="hero-content">
        <Box className="hero-badge">
          <Chip label="ĐANG THỊNH HÀNH HÔM NAY" size="small" className="featured-chip" />
          {movie.rating && (
            <Chip label={`⭐ ${rating}`} size="small" className="rating-chip" />
          )}
        </Box>
        
        <Typography variant="h1" className="hero-title">
          {movie.title}
        </Typography>
        
        <Typography variant="body1" className="hero-description">
          {overview}
        </Typography>
        
        <Box className="hero-metadata">
          <span className="metadata-item">{year}</span>
          <span className="metadata-divider">•</span>
          <span className="metadata-item rating">{rating}/10</span>
          {movie.voteCount > 0 && (
            <>
              <span className="metadata-divider">•</span>
              <span className="metadata-item">{movie.voteCount.toLocaleString()} đánh giá</span>
            </>
          )}
        </Box>
        
        <Box className="hero-actions">
          <Button 
            variant="contained" 
            className="hero-btn-primary"
            startIcon={<PlayArrowIcon />}
            onClick={() => onWatchClick && onWatchClick(movie)}
          >
            ▶ Xem ngay
          </Button>
          <Button 
            variant="contained" 
            className="hero-btn-secondary"
            startIcon={<AddIcon />}
            onClick={() => onAddToList && onAddToList(movie)}
          >
            Thêm vào danh sách
          </Button>
          <Button 
            variant="contained" 
            className="hero-btn-tertiary"
            startIcon={<InfoIcon />}
            onClick={() => onMoreInfo && onMoreInfo(movie)}
          >
            Thông tin thêm
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
