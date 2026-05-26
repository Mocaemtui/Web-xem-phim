import { useState, useEffect, useCallback } from 'react';
import { getSourceManager } from '../services/sourceManager';
import { normalizeMovieList } from '../services/movieNormalizer';

export function useSourceData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sourceManager, setSourceManager] = useState(null);

  useEffect(() => {
    const manager = getSourceManager();
    setSourceManager(manager);
    
    const initialize = async () => {
      try {
        await manager.initialize();
      } catch (err) {
        console.error('Failed to initialize source manager:', err);
      }
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (!sourceManager) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const latestResult = await sourceManager.getLatest({ page: 1, limit: 20 });
        const phimLeResult = await sourceManager.getList({ type: 'phim-le', page: 1, limit: 20 });
        const phimBoResult = await sourceManager.getList({ type: 'phim-bo', page: 1, limit: 20 });
        const hoatHinhResult = await sourceManager.getList({ type: 'hoat-hinh', page: 1, limit: 20 });
        const tvShowsResult = await sourceManager.getList({ type: 'tv-shows', page: 1, limit: 20 });

        if (isMounted) {
          const activeProvider = sourceManager.getActiveProvider();
          const providerId = activeProvider ? activeProvider.id : 'unknown';

          setData({
            heroMovie: normalizeMovieList(latestResult.data, providerId)[0] || null,
            latest: normalizeMovieList(latestResult.data, providerId),
            phimLe: normalizeMovieList(phimLeResult.data, providerId),
            phimBo: normalizeMovieList(phimBoResult.data, providerId),
            hoatHinh: normalizeMovieList(hoatHinhResult.data, providerId),
            tvShows: normalizeMovieList(tvShowsResult.data, providerId),
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch data');
          console.error('Source data error:', err);
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
  }, [sourceManager]);

  const retry = useCallback(() => {
    if (sourceManager) {
      sourceManager.initialize().then(() => {
        // Force re-fetch by setting loading to true
        setLoading(true);
      });
    }
  }, [sourceManager]);

  return { data, loading, error, retry };
}

export function useSourceSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [sourceManager, setSourceManager] = useState(null);

  useEffect(() => {
    const manager = getSourceManager();
    setSourceManager(manager);
    
    const initialize = async () => {
      try {
        await manager.initialize();
      } catch (err) {
        console.error('Failed to initialize source manager:', err);
      }
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (!sourceManager) return;

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
        const searchResult = await sourceManager.search({ keyword: query, page: 1, limit: 20 });
        if (isMounted) {
          const activeProvider = sourceManager.getActiveProvider();
          const providerId = activeProvider ? activeProvider.id : 'unknown';
          const movies = normalizeMovieList(searchResult.data, providerId);
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
  }, [query, sourceManager]);

  return { query, setQuery, results, loading, error, hasSearched };
}

export function useSourceDetail(slug) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceManager, setSourceManager] = useState(null);

  useEffect(() => {
    const manager = getSourceManager();
    setSourceManager(manager);
    
    const initialize = async () => {
      try {
        await manager.initialize();
      } catch (err) {
        console.error('Failed to initialize source manager:', err);
      }
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (!sourceManager || !slug) return;

    let isMounted = true;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const detailResult = await sourceManager.getDetail({ slug });
        if (isMounted) {
          const normalized = sourceManager.normalizeDetail(detailResult.data);
          setMovie(normalized);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch detail');
          console.error('Detail error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [slug, sourceManager]);

  return { movie, loading, error };
}
