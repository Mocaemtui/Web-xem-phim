import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MovieSlider from './MovieSlider';
import './ContentRow.css';

const contentRows = [
  { title: 'Continue Learning', id: 'continue-learning' },
  { title: 'Trending in AI', id: 'trending-ai' },
  { title: 'Latest Cybersecurity Research', id: 'cybersecurity' },
  { title: 'Developer Tools', id: 'developer-tools' },
  { title: 'Deep Web Intelligence', id: 'deep-web' },
  { title: 'Forum Hot Threads', id: 'forum-hot' },
  { title: 'Beginner Friendly', id: 'beginner' },
  { title: 'Advanced WhiteHat Labs', id: 'advanced' },
  { title: 'Saved for Later', id: 'saved' },
];

export default function ContentRow({ title, movies, categoryId, categoryName }) {
  return (
    <Box className="content-row">
      <Box className="content-row-header">
        <Typography variant="h4" className="content-row-title">{title}</Typography>
        <Box className="content-row-arrows">
          <IconButton className="arrow-btn arrow-left">
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton className="arrow-btn arrow-right">
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <MovieSlider movies={movies} title={title} categoryId={categoryId} categoryName={categoryName} />
    </Box>
  );
}

export { contentRows };
