import React, { useState, useEffect, useRef } from 'react';
import { Box, InputBase, IconButton, Chip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './SearchOverlay.css';

const filterTags = ['AI', 'DarkWeb', 'Forum', 'Tools', 'Tutorials'];

export default function SearchOverlay({ open, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Box className="search-overlay" onClick={onClose}>
      <Box className="search-overlay-content" onClick={(e) => e.stopPropagation()}>
        <Box className="search-header">
          <SearchIcon className="search-icon" />
          <InputBase
            inputRef={inputRef}
            placeholder="Search AI tools, forum posts, tutorials..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <IconButton onClick={onClose} className="close-btn">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box className="search-filters">
          <Typography variant="body2" className="filter-label">Filter by:</Typography>
          <Box className="filter-tags">
            {filterTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`filter-chip ${selectedTag === tag ? 'active' : ''}`}
              />
            ))}
          </Box>
        </Box>

        <Box className="search-shortcuts">
          <Typography variant="caption" className="shortcut-text">
            Press <span className="shortcut-key">Esc</span> to close
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
