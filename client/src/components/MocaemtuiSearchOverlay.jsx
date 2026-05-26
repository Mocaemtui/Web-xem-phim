import React, { useState, useEffect, useRef } from 'react';
import { Box, Modal, InputBase, IconButton, Typography, Chip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './MocaemtuiSearchOverlay.css';

const popularSearches = [
  'New Anime',
  'Korean Movies',
  'Action Movies',
  'Horror Movies',
  'Dubbed Movies',
  'Completed Series'
];

export default function MocaemtuiSearchOverlay({ open, onClose, onSearch, onWatchMovie }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [open]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      onSearch && onSearch(query);
      setSearchResults([]); // Real search will be handled by parent component
    } else {
      setSearchResults([]);
    }
  };

  const handlePopularSearch = (term) => {
    handleSearch(term);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="search-overlay-backdrop"
    >
      <Box className="search-overlay-container">
        <IconButton className="search-close-btn" onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Box className="search-content">
          {/* Search Input */}
          <Box className="search-input-container">
            <SearchIcon className="search-input-icon" />
            <InputBase
              ref={inputRef}
              placeholder="Search movies, anime, actors, genres..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </Box>

          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <Box className="search-results">
              <Typography variant="h6" className="results-title">
                Search Results
              </Typography>
              <Box className="results-list">
                {searchResults.map((result) => (
                  <Box key={result.id} className="result-item">
                    <Box className="result-poster">
                      <img src={result.poster} alt={result.title} />
                    </Box>
                    <Box className="result-info">
                      <Typography variant="h6" className="result-title">
                        {result.title}
                      </Typography>
                      <Box className="result-metadata">
                        <span className="metadata-item">{result.year}</span>
                        <span className="metadata-divider">•</span>
                        <span className="metadata-item">{result.genre}</span>
                        <span className="metadata-divider">•</span>
                        <Chip 
                          label={result.quality} 
                          size="small" 
                          className="result-quality-chip"
                        />
                      </Box>
                    </Box>
                    <Button
                      className="result-watch-btn"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => onWatchMovie && onWatchMovie(result)}
                    >
                      Watch
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Popular Searches */}
          {!searchQuery && (
            <Box className="popular-searches">
              <Typography variant="h6" className="popular-title">
                Popular Searches
              </Typography>
              <Box className="popular-tags">
                {popularSearches.map((term, index) => (
                  <Chip
                    key={index}
                    label={term}
                    className="popular-tag"
                    onClick={() => handlePopularSearch(term)}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* No Results */}
          {searchQuery && searchResults.length === 0 && (
            <Box className="no-results">
              <Typography variant="h6" className="no-results-title">
                No results found
              </Typography>
              <Typography variant="body2" className="no-results-text">
                Try different keywords or check your spelling
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
