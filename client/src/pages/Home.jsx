import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useHomeMovies } from '../hooks/useHomeMovies';
import HeroSection from '../components/HeroSection';
import MocaemtuiMovieRow from '../components/MocaemtuiMovieRow';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { rows, status, error, reload } = useHomeMovies();

  const handleWatchClick = (movie) => {
    const slug = movie.slug || movie.id;
    navigate(`/watch/${slug}`);
  };

  const handleAddToList = (movie) => {
    console.log('Add to list:', movie);
    // TODO: Implement add to list functionality
  };

  const handleMoreInfo = (movie) => {
    const slug = movie.slug || movie.id;
    navigate(`/movies/${slug}`);
  };

  if (status === 'loading') {
    return (
      <Box className="home-container">
        <LoadingSkeleton type="hero" />
        <LoadingSkeleton type="row" count={8} />
        <LoadingSkeleton type="row" count={8} />
        <LoadingSkeleton type="row" count={8} />
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box className="home-container">
        <ErrorState 
          message={error} 
          onRetry={reload} 
        />
      </Box>
    );
  }

  const heroMovie = rows.length > 0 && rows[0].items.length > 0 ? rows[0].items[0] : null;

  return (
    <Box className="home-container">
      {/* Hero Section with latest movie */}
      {heroMovie && (
        <HeroSection 
          movie={heroMovie}
          onWatchClick={handleWatchClick}
          onAddToList={handleAddToList}
          onMoreInfo={handleMoreInfo}
        />
      )}

      {/* Movie Rows */}
      {rows.map((row) => (
        <MocaemtuiMovieRow
          key={`${row.source}-${row.title}`}
          title={row.title}
          movies={row.items}
          loading={status === 'loading'}
          error={error}
          onWatch={handleWatchClick}
          onAddToList={handleAddToList}
          onMoreInfo={handleMoreInfo}
        />
      ))}
    </Box>
  );
} 