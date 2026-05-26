import React, { useState } from 'react';
import { 
  Box, Modal, Typography, Button, IconButton, Chip, Tabs, Tab, 
  CardMedia, Divider, Avatar, Rating
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import './MocaemtuiMovieModal.css';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} className="tab-panel">
      {value === index && <Box className="tab-content">{children}</Box>}
    </div>
  );
}

export default function MocaemtuiMovieModal({ open, onClose, movie, onWatch, onAddToList }) {
  const [tabValue, setTabValue] = useState(0);

  const movieData = movie || {
    id: 1,
    title: "Featured Movie Title",
    originalTitle: "Original Movie Title",
    description: "An epic cinematic experience that will take you on an unforgettable journey through stunning visuals and compelling storytelling. This masterpiece combines groundbreaking visual effects with a powerful narrative that explores the depths of human emotion and the triumph of the human spirit.",
    year: 2024,
    ageRating: "16+",
    duration: "2h 15m",
    genre: ["Action", "Drama", "Thriller"],
    quality: "4K",
    country: "United States",
    director: "Director Name",
    cast: ["Actor One", "Actor Two", "Actor Three"],
    rating: 8.5,
    language: "English",
    status: "Completed",
    episodes: 12,
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    type: "Movie"
  };

  // Ensure genre is always an array of strings
  const safeGenres = Array.isArray(movieData.genre)
    ? movieData.genre.map(g => typeof g === 'string' ? g : (g?.name || String(g)))
    : [];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const episodes = movieData.type === 'Series' 
    ? [...Array(movieData.episodes || 12)].map((_, i) => ({
        episode: i + 1,
        title: `Episode ${i + 1}`,
        duration: "45m",
        thumbnail: movieData.backdrop
      }))
    : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="movie-modal-backdrop"
    >
      <Box className="movie-modal-container">
        <IconButton className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </IconButton>

        {/* Banner */}
        <Box className="modal-banner">
          <CardMedia
            component="img"
            image={movieData.backdrop}
            alt={movieData.title}
            className="modal-banner-image"
          />
          <Box className="modal-banner-gradient" />
        </Box>

        {/* Content */}
        <Box className="modal-content">
          {/* Header */}
          <Box className="modal-header">
            <Box className="modal-poster-container">
              <CardMedia
                component="img"
                image={movieData.poster}
                alt={movieData.title}
                className="modal-poster"
              />
            </Box>
            
            <Box className="modal-info">
              <Typography variant="h3" className="modal-title">
                {movieData.title}
              </Typography>
              <Typography variant="subtitle1" className="modal-original-title">
                {movieData.originalTitle}
              </Typography>
              
              <Box className="modal-metadata">
                <span className="metadata-item">{movieData.year}</span>
                <span className="metadata-divider">•</span>
                <span className="metadata-item age-rating">{movieData.ageRating}</span>
                <span className="metadata-divider">•</span>
                <span className="metadata-item">{movieData.duration}</span>
                <span className="metadata-divider">•</span>
                <span className="metadata-item">{movieData.quality}</span>
                <span className="metadata-divider">•</span>
                <span className="metadata-item rating">{movieData.rating}</span>
              </Box>

              <Box className="modal-genres">
                {safeGenres.map((g, i) => (
                  <Chip key={i} label={g} size="small" className="genre-chip" />
                ))}
              </Box>

              <Box className="modal-actions">
                <Button
                  className="modal-watch-btn"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => onWatch && onWatch(movieData)}
                >
                  Watch Now
                </Button>
                <Button
                  className="modal-add-btn"
                  startIcon={<AddIcon />}
                  onClick={() => onAddToList && onAddToList(movieData)}
                >
                  Add to List
                </Button>
                <Button
                  className="modal-share-btn"
                  startIcon={<ShareIcon />}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </Box>

          <Divider className="modal-divider" />

          {/* Tabs */}
          <Box className="modal-tabs">
            <Tabs value={tabValue} onChange={handleTabChange} className="custom-tabs">
              <Tab label="Overview" />
              <Tab label="Episodes" disabled={movieData.type !== 'Series'} />
              <Tab label="Trailer" />
              <Tab label="Comments" />
              <Tab label="Related" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box className="modal-tab-content">
            <TabPanel value={tabValue} index={0}>
              <Box className="overview-section">
                <Typography variant="h6" className="section-title">Synopsis</Typography>
                <Typography variant="body1" className="overview-description">
                  {movieData.description}
                </Typography>

                <Box className="info-grid">
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Original Title</Typography>
                    <Typography variant="body2" className="info-value">{movieData.originalTitle}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Release Year</Typography>
                    <Typography variant="body2" className="info-value">{movieData.year}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Country</Typography>
                    <Typography variant="body2" className="info-value">{movieData.country}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Director</Typography>
                    <Typography variant="body2" className="info-value">{movieData.director}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Duration</Typography>
                    <Typography variant="body2" className="info-value">{movieData.duration}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Episodes</Typography>
                    <Typography variant="body2" className="info-value">{movieData.episodes || 'N/A'}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Quality</Typography>
                    <Typography variant="body2" className="info-value">{movieData.quality}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Language</Typography>
                    <Typography variant="body2" className="info-value">{movieData.language}</Typography>
                  </Box>
                  <Box className="info-item">
                    <Typography variant="subtitle2" className="info-label">Status</Typography>
                    <Typography variant="body2" className="info-value">{movieData.status}</Typography>
                  </Box>
                </Box>

                <Typography variant="h6" className="section-title">Cast</Typography>
                <Box className="cast-list">
                  {movieData.cast && movieData.cast.map((actor, i) => (
                    <Box key={i} className="cast-item">
                      <Avatar className="cast-avatar">{actor[0]}</Avatar>
                      <Typography variant="body2" className="cast-name">{actor}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box className="episodes-section">
                {episodes.map((ep) => (
                  <Box key={ep.episode} className="episode-item">
                    <CardMedia
                      component="img"
                      image={ep.thumbnail}
                      alt={ep.title}
                      className="episode-thumbnail"
                    />
                    <Box className="episode-info">
                      <Typography variant="subtitle1" className="episode-title">
                        {ep.title}
                      </Typography>
                      <Typography variant="body2" className="episode-duration">
                        {ep.duration}
                      </Typography>
                    </Box>
                    <Button
                      className="episode-watch-btn"
                      startIcon={<PlayArrowIcon />}
                      size="small"
                    >
                      Watch
                    </Button>
                  </Box>
                ))}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box className="trailer-section">
                <Box className="trailer-placeholder">
                  <PlayArrowIcon className="trailer-play-icon" />
                  <Typography variant="h6">Trailer Coming Soon</Typography>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box className="comments-section">
                <Typography variant="h6" className="section-title">Comments</Typography>
                <Typography variant="body2" className="no-comments">
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <Box className="related-section">
                <Typography variant="h6" className="section-title">Related Movies</Typography>
                <Typography variant="body2" className="no-related">
                  No related movies found.
                </Typography>
              </Box>
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
