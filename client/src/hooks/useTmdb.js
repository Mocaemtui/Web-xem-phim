import { useState, useEffect, useCallback } from 'react';
import { tmdbApi, getHomepageData, normalizeMovie } from '../tmdb';

// Custom hook for fetching TMDB data with loading and error states
export function useTmdbData(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred');
          console.error('TMDB API error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

// Hook for homepage data
export function useHomepageData() {
  return useTmdbData(getHomepageData, []);
}

// Hook for trending movies
export function useTrendingMovies(timeWindow = 'week') {
  const fetchFunction = useCallback(() => {
    if (timeWindow === 'day') {
      return tmdbApi.getTrendingToday();
    }
    return tmdbApi.getTrendingWeek();
  }, [timeWindow]);

  const { data, loading, error } = useTmdbData(fetchFunction, [timeWindow]);
  
  const movies = data?.results?.map(normalizeMovie) || [];
  
  return { movies, loading, error };
}

// Hook for popular movies
export function usePopularMovies(page = 1) {
  const fetchFunction = useCallback(() => tmdbApi.getPopular(page), [page]);
  const { data, loading, error } = useTmdbData(fetchFunction, [page]);
  
  const movies = data?.results?.map(normalizeMovie) || [];
  
  return { movies, loading, error, totalPages: data?.total_pages || 1 };
}

// Hook for top rated movies
export function useTopRatedMovies(page = 1) {
  const fetchFunction = useCallback(() => tmdbApi.getTopRated(page), [page]);
  const { data, loading, error } = useTmdbData(fetchFunction, [page]);
  
  const movies = data?.results?.map(normalizeMovie) || [];
  
  return { movies, loading, error, totalPages: data?.total_pages || 1 };
}

// Hook for now playing movies
export function useNowPlayingMovies(page = 1) {
  const fetchFunction = useCallback(() => tmdbApi.getNowPlaying(page), [page]);
  const { data, loading, error } = useTmdbData(fetchFunction, [page]);
  
  const movies = data?.results?.map(normalizeMovie) || [];
  
  return { movies, loading, error, totalPages: data?.total_pages || 1 };
}

// Hook for search movies with debounce
export function useSearchMovies() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const searchMovies = async () => {
      if (!query.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await tmdbApi.searchMovies(query);
        if (isMounted) {
          const movies = data.results?.map(normalizeMovie) || [];
          setResults(movies);
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
      searchMovies();
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      isMounted = false;
    };
  }, [query]);

  return { query, setQuery, results, loading, error, hasSearched };
}

// Hook for movie details
export function useMovieDetails(movieId) {
  const fetchFunction = useCallback(() => tmdbApi.getMovieDetails(movieId), [movieId]);
  const { data, loading, error } = useTmdbData(fetchFunction, [movieId]);
  
  const movie = data ? normalizeMovie(data) : null;
  
  return { movie, loading, error };
}
