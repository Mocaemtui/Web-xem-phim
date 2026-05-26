import React, { useState } from 'react';
import { Box, CardMedia, Typography, Chip, Button, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import './MocaemtuiMovieCard.css';

export default function MocaemtuiMovieCard({ movie, onWatch, onAddToList, onMoreInfo }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (!movie) {
    return null;
  }

  const posterUrl = movie.posterUrl || movie.poster;
  const backdropUrl = movie.backdropUrl || movie.backdrop;
  const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
  const year = movie.year || 'N/A';

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback card for when poster fails to load
  if (imageError || !posterUrl) {
    return (
      <Box 
        className={`mocaemtui-movie-card fallback-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onMoreInfo && onMoreInfo(movie)}
      >
        <Box className="fallback-poster">
          <Typography variant="h6" className="fallback-title">
            {movie.title}
          </Typography>
          <Typography variant="body2" className="fallback-year">
            {year}
          </Typography>
          <Chip 
            label={`⭐ ${rating}`}
            size="small"
            className="fallback-rating"
          />
        </Box>
        <Box className="card-info">
          <Typography variant="subtitle1" className="card-title">
            {movie.title}
          </Typography>
          <Box className="card-metadata">
            <span className="card-year">{year}</span>
            <span className="metadata-divider">•</span>
            <Chip 
              label={`⭐ ${rating}`}
              size="small"
              className="card-quality-chip"
            />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      className={`mocaemtui-movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onMoreInfo && onMoreInfo(movie)}
    >
      <Box className="card-image-container">
        <CardMedia
          component="img"
          image={posterUrl}
          alt={movie.title}
          className="card-poster"
          loading="lazy"
          onError={handleImageError}
        />
        
        {/* Rating Badge */}
        <Chip 
          label={`⭐ ${rating}`}
          size="small"
          className="rating-badge"
        />
        
        {/* Hover Overlay */}
        <Box className="card-hover-overlay">
          {backdropUrl ? (
            <CardMedia
              component="img"
              image={backdropUrl}
              alt={movie.title}
              className="card-backdrop"
            />
          ) : (
            <Box className="card-backdrop-fallback" />
          )}
          <Box className="card-hover-content">
            <Typography variant="h6" className="card-hover-title">
              {movie.title}
            </Typography>
            
            {movie.overview && (
              <Typography variant="body2" className="card-hover-description">
                {movie.overview.substring(0, 150)}...
              </Typography>
            )}
            
            <Box className="card-hover-metadata">
              <span className="metadata-item">{year}</span>
              <span className="metadata-divider">•</span>
              <span className="metadata-item rating">{rating}/10</span>
              {movie.voteCount > 0 && (
                <>
                  <span className="metadata-divider">•</span>
                  <span className="metadata-item">{movie.voteCount.toLocaleString()} votes</span>
                </>
              )}
            </Box>
            
            <Box className="card-hover-actions">
              <Button
                className="hover-watch-btn"
                startIcon={<PlayArrowIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onWatch && onWatch(movie);
                }}
              >
                Xem
              </Button>
              <IconButton
                className="hover-add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToList && onAddToList(movie);
                }}
                aria-label="Add to list"
              >
                <AddIcon />
              </IconButton>
              <IconButton
                className="hover-info-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreInfo && onMoreInfo(movie);
                }}
                aria-label="More info"
              >
                <InfoIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Card Info (visible when not hovered) */}
      <Box className="card-info">
        <Typography variant="subtitle1" className="card-title">
          {movie.title}
        </Typography>
        <Box className="card-metadata">
          <span className="card-year">{year}</span>
          <span className="metadata-divider">•</span>
          <Chip 
            label={`⭐ ${rating}`}
            size="small"
            className="card-quality-chip"
          />
        </Box>
      </Box>
    </Box>
  );
}
