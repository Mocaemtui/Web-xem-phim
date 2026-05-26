import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Pagination, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../services/sourceManager';
import MocaemtuiMovieCard from '../components/MocaemtuiMovieCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import './Search.css';

const PAGE_SIZE = 16;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const [page, setPage] = useState(1);
  const query = useQuery();
  const searchTerm = query.get('q')?.trim() || "";
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const searchMoviesAsync = async () => {
      if (!searchTerm) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await searchMovies(searchTerm, page);
        if (isMounted) {
          setResults(data.items || []);
          setHasSearched(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Search failed');
          setResults([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce search
    timeoutId = setTimeout(() => {
      searchMoviesAsync();
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      isMounted = false;
    };
  }, [searchTerm, page]);

  const handleWatchClick = (movie) => {
    console.log('Watch:', movie);
    // TODO: Implement watch functionality
  };

  const handleAddToList = (movie) => {
    console.log('Add to list:', movie);
    // TODO: Implement add to list functionality
  };

  const handleMoreInfo = (movie) => {
    console.log('More info:', movie);
    // TODO: Implement more info functionality
  };

  const pagedMovies = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(results.length / PAGE_SIZE);

  return (
    <Box className="search-container">
      <Box className="search-content">
        <Box className="search-wrapper">
          <Typography variant="h4" className="search-title">
            {searchTerm ? `Kết quả tìm kiếm "${searchTerm}"` : 'Tìm kiếm phim'}
          </Typography>
          
          {loading && (
            <LoadingSkeleton type="row" count={8} />
          )}
          
          {error && (
            <ErrorState 
              message={error} 
              onRetry={() => searchMovies(searchTerm, page)} 
            />
          )}
          
          {!loading && !error && hasSearched && results.length === 0 && (
            <Typography className="search-empty">
              Không tìm thấy kết quả nào cho "{searchTerm}"
            </Typography>
          )}
          
          {!loading && !error && results.length > 0 && (
            <>
              <Grid container spacing={3} className="search-grid">
                {pagedMovies.map((movie) => (
                  <Grid
                    size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 2 }}
                    key={movie.id}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <MocaemtuiMovieCard
                      movie={movie}
                      onWatch={handleWatchClick}
                      onAddToList={handleAddToList}
                      onMoreInfo={handleMoreInfo}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {totalPages > 1 && (
                <Stack alignItems="center" className="search-pagination">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </Stack>
              )}
            </>
          )}
          
          {!loading && !error && !hasSearched && !searchTerm && (
            <Typography className="search-hint">
              Nhập từ khóa để tìm kiếm phim
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
} 