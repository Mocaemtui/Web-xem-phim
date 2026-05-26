// TMDB API Service with caching
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Normalize movie data from TMDB to our format
export function normalizeMovie(movie) {
  if (!movie) return null;
  
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  
  return {
    id: movie.id,
    title: movie.title || movie.name || 'Unknown',
    originalTitle: movie.original_title || movie.original_name || movie.title || movie.name,
    overview: movie.overview || '',
    posterUrl: movie.poster_path 
      ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
      : null,
    backdropUrl: movie.backdrop_path
      ? `${TMDB_IMAGE_BASE_URL}/w1280${movie.backdrop_path}`
      : null,
    rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0,
    year: year,
    releaseDate: movie.release_date || movie.first_air_date || '',
    genreIds: movie.genre_ids || [],
    voteCount: movie.vote_count || 0,
    popularity: movie.popularity || 0,
    adult: movie.adult || false,
    poster: movie.poster_path 
      ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
      : null,
    backdrop: movie.backdrop_path
      ? `${TMDB_IMAGE_BASE_URL}/w1280${movie.backdrop_path}`
      : null,
  };
}

// Fetch with AbortController and error handling
async function fetchTMDB(endpoint, options = {}) {
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  
  if (!token || token === 'your_actual_tmdb_read_access_token_here' || token === 'your_tmdb_read_access_token_here') {
    throw new Error('VITE_TMDB_ACCESS_TOKEN is not set in .env.local. Please add your TMDB Read Access Token from https://www.themoviedb.org/settings/api');
  }

  const url = `${TMDB_BASE_URL}${endpoint}`;
  const cacheKey = url;

  // Check cache first
  const cached = getCached(cacheKey);
  if (cached && !options.skipCache) {
    return cached;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache the response
    setCached(cacheKey, data);
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// TMDB API endpoints
export const tmdbApi = {
  // Hero featured movie: trending today
  getTrendingToday: () => fetchTMDB('/trending/movie/day?language=vi-VN'),
  
  // Trending this week
  getTrendingWeek: () => fetchTMDB('/trending/movie/week?language=vi-VN'),
  
  // Popular movies
  getPopular: (page = 1) => fetchTMDB(`/movie/popular?language=vi-VN&page=${page}`),
  
  // Top rated
  getTopRated: (page = 1) => fetchTMDB(`/movie/top_rated?language=vi-VN&page=${page}`),
  
  // Now playing
  getNowPlaying: (page = 1) => fetchTMDB(`/movie/now_playing?language=vi-VN&page=${page}`),
  
  // Search keywords for Christmas
  searchKeyword: (query) => fetchTMDB(`/search/keyword?query=${encodeURIComponent(query)}&page=1`),
  
  // Discover movies by keyword
  discoverByKeyword: (keywordId, page = 1) => 
    fetchTMDB(`/discover/movie?with_keywords=${keywordId}&language=vi-VN&page=${page}`),
  
  // Search movies
  searchMovies: (query, page = 1) => 
    fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}&language=vi-VN&page=${page}`),
  
  // Get movie details
  getMovieDetails: (movieId) => 
    fetchTMDB(`/movie/${movieId}?language=vi-VN`),
  
  // Get movie genres
  getGenres: () => fetchTMDB('/genre/movie/list?language=vi-VN'),
};

// Helper function to get Christmas collection movies
export async function getChristmasCollection() {
  try {
    // First try to find Christmas keyword
    const keywordData = await tmdbApi.searchKeyword('christmas');
    const christmasKeyword = keywordData.results?.find(k => 
      k.name.toLowerCase().includes('christmas') || 
      k.name.toLowerCase().includes('noel')
    );
    
    if (christmasKeyword) {
      const discoverData = await tmdbApi.discoverByKeyword(christmasKeyword.id);
      return discoverData.results?.map(normalizeMovie) || [];
    }
  } catch (error) {
    console.warn('Failed to get Christmas collection via keyword, falling back to search:', error);
  }
  
  // Fallback to search
  try {
    const searchData = await tmdbApi.searchMovies('christmas');
    return searchData.results?.map(normalizeMovie) || [];
  } catch (error) {
    console.error('Failed to get Christmas collection:', error);
    return [];
  }
}

// Helper function to get all homepage data
export async function getHomepageData() {
  try {
    const [trendingToday, trendingWeek, popular, topRated, nowPlaying, christmas] = await Promise.all([
      tmdbApi.getTrendingToday(),
      tmdbApi.getTrendingWeek(),
      tmdbApi.getPopular(),
      tmdbApi.getTopRated(),
      tmdbApi.getNowPlaying(),
      getChristmasCollection(),
    ]);

    return {
      heroMovie: trendingToday.results?.[0] ? normalizeMovie(trendingToday.results[0]) : null,
      trending: trendingWeek.results?.map(normalizeMovie) || [],
      popular: popular.results?.map(normalizeMovie) || [],
      topRated: topRated.results?.map(normalizeMovie) || [],
      nowPlaying: nowPlaying.results?.map(normalizeMovie) || [],
      christmas: christmas || [],
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
}
