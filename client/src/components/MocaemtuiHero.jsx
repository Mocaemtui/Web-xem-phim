import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import './MocaemtuiHero.css';

export default function MocaemtuiHero({ featuredMovie, onWatchClick, onAddToList, onMoreInfo }) {
  const movie = featuredMovie || {
    title: "Featured Movie",
    description: "An epic cinematic experience that will take you on an unforgettable journey through stunning visuals and compelling storytelling.",
    year: 2024,
    ageRating: "16+",
    duration: "2h 15m",
    genre: "Action, Drama, Thriller",
    quality: "4K",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80"
  };

  return (
    <Box className="mocaemtui-hero">
      <Box 
        className="hero-backdrop"
        sx={{ backgroundImage: `url(${movie.backdrop})` }}
      >
        <Box className="hero-gradient" />
      </Box>
      
      <Box className="hero-content">
        <Box className="hero-badges">
          <Chip 
            label="FEATURED" 
            size="small" 
            className="featured-badge"
          />
          <Chip 
            label={movie.quality} 
            size="small" 
            className="quality-badge"
          />
        </Box>
        
        <Typography variant="h1" className="hero-title">
          {movie.title}
        </Typography>
        
        <Typography variant="body1" className="hero-description">
          {movie.description}
        </Typography>
        
        <Box className="hero-metadata">
          <span className="metadata-item">{movie.year}</span>
          <span className="metadata-divider">•</span>
          <span className="metadata-item age-rating">{movie.ageRating}</span>
          <span className="metadata-divider">•</span>
          <span className="metadata-item">{movie.duration}</span>
          <span className="metadata-divider">•</span>
          <span className="metadata-item">{movie.genre}</span>
        </Box>
        
        <Box className="hero-actions">
          <Button 
            variant="contained"
            className="hero-btn-primary"
            startIcon={<PlayArrowIcon />}
            onClick={() => onWatchClick && onWatchClick(movie)}
          >
            Watch Now
          </Button>
          <Button 
            variant="contained"
            className="hero-btn-secondary"
            startIcon={<AddIcon />}
            onClick={() => onAddToList && onAddToList(movie)}
          >
            Add to List
          </Button>
          <Button 
            variant="contained"
            className="hero-btn-tertiary"
            startIcon={<InfoIcon />}
            onClick={() => onMoreInfo && onMoreInfo(movie)}
          >
            More Info
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
