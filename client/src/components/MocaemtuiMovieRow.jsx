import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MocaemtuiMovieCard from './MocaemtuiMovieCard';
import LoadingSkeleton from './LoadingSkeleton';
import './MocaemtuiMovieRow.css';

export default function MocaemtuiMovieRow({ title, movies, loading, error, onWatch, onAddToList, onMoreInfo, onViewAll, onRetry }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const cardWidth = 200;
  const gap = 16;
  const scrollAmount = cardWidth + gap;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && movies) {
      setCanScrollRight(container.scrollWidth > container.clientWidth);
    }
  }, [movies]);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  const handleScrollChange = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setScrollPosition(container.scrollLeft);
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
  };

  // Don't render row if no movies and not loading
  if (!loading && (!movies || movies.length === 0) && !error) {
    return null;
  }

  return (
    <Box className="mocaemtui-movie-row">
      <Box className="row-header">
        <Typography variant="h5" className="row-title">
          {title}
        </Typography>
        {onViewAll && movies && movies.length > 0 && (
          <button className="view-all-btn" onClick={onViewAll}>
            Xem tất cả
            <ArrowForwardIosIcon className="view-all-icon" />
          </button>
        )}
      </Box>

      {loading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : error ? (
        <Box className="row-error">
          <Typography variant="body2" className="error-text">
            {error}
          </Typography>
          {onRetry && (
            <IconButton onClick={onRetry} className="retry-icon">
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      ) : (
        <Box className="row-container">
          {canScrollLeft && (
            <IconButton 
              className="scroll-button scroll-left"
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          <Box 
            ref={scrollContainerRef}
            className="row-scroll-container"
            onScroll={handleScrollChange}
          >
            <Box className="row-cards">
              {movies && movies.length > 0 ? (
                movies.map((movie) => (
                  <Box key={movie.id} className="row-card-wrapper">
                    <MocaemtuiMovieCard
                      movie={movie}
                      onWatch={onWatch}
                      onAddToList={onAddToList}
                      onMoreInfo={onMoreInfo}
                    />
                  </Box>
                ))
              ) : null}
            </Box>
          </Box>

          {canScrollRight && (
            <IconButton 
              className="scroll-button scroll-right"
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
}
