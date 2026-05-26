import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MocaemtuiHeader from '../components/MocaemtuiHeader';
import MocaemtuiHero from '../components/MocaemtuiHero';
import MocaemtuiMovieRow from '../components/MocaemtuiMovieRow';
import MocaemtuiMovieGrid from '../components/MocaemtuiMovieGrid';
import MocaemtuiMovieModal from '../components/MocaemtuiMovieModal';
import MocaemtuiSearchOverlay from '../components/MocaemtuiSearchOverlay';
import { getHomeRows } from '../services/sourceManager';
import './MocaemtuiHome.css';

export default function MocaemtuiHome() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [moviesByCategory, setMoviesByCategory] = useState({});
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch movies from source providers
        const homeRows = await getHomeRows();
        
        // Flatten all movies from all rows
        const allMovies = [];
        homeRows.forEach(row => {
          if (row.items && Array.isArray(row.items)) {
            row.items.forEach(movie => {
              allMovies.push({
                ...movie,
                poster: movie.posterUrl || movie.poster_url,
                backdrop: movie.bg_url || movie.backdropUrl || movie.poster,
                originalTitle: movie.original_title || movie.title || movie.originalTitle,
                slug: movie.slug || movie.sourceSlug || movie.title_url || movie.id,
              });
            });
          }
        });
        
        setMovies(allMovies);
        console.log('Loaded movies:', allMovies.length);

        // Set featured movie (first movie)
        if (allMovies.length > 0) {
          const genreNames = allMovies[0].genres?.map(g => typeof g === 'string' ? g : (g?.name || String(g))).join(', ') || "Drama";
          setFeaturedMovie({
            title: allMovies[0].title,
            description: allMovies[0].description || "Không có mô tả",
            year: allMovies[0].release_year || allMovies[0].year || 2024,
            ageRating: allMovies[0].age_limit || "13+",
            duration: allMovies[0].duration || "2h",
            genre: genreNames,
            quality: allMovies[0].quality || "HD",
            backdrop: allMovies[0].backdrop,
            poster: allMovies[0].poster,
            slug: allMovies[0].slug
          });
        }

        // Create categories from home rows
        const movieCategories = homeRows.map(row => ({
          id: row.title.toLowerCase().replace(/\s+/g, '-'),
          name: row.title,
          movies: row.items?.map(movie => ({
            ...movie,
            poster: movie.posterUrl || movie.poster_url,
            backdrop: movie.bg_url || movie.backdropUrl || movie.poster,
            originalTitle: movie.original_title || movie.title || movie.originalTitle,
            slug: movie.slug || movie.sourceSlug || movie.title_url || movie.id,
          })) || []
        }));
        
        setCategories(movieCategories);
        
        // Set movies by category
        const moviesByCategoryMap = {};
        movieCategories.forEach(cat => {
          moviesByCategoryMap[cat.id] = cat.movies;
        });
        setMoviesByCategory(moviesByCategoryMap);
        
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Create movie categories from real data
  const movieCategories = [
    { title: "Phim mới cập nhật", movies: movies.slice(0, 20) },
    { title: "Phim đang hot", movies: movies.slice(20, 38) },
    { title: "Top phim bộ", movies: movies.filter(m => m.type === 'phim-bo' || m.type === 'series').slice(0, 18) },
    ...categories.map(cat => ({
      title: cat.name,
      movies: (moviesByCategory[cat.id] || []).slice(0, 20)
    }))
  ].filter(cat => cat.movies && cat.movies.length > 0);

  const allMovies = movies;

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleWatch = (movie) => {
    console.log('Watch:', movie);
    const movieRoute = movie.slug || movie.sourceSlug || movie.title_url || movie.id;
    navigate(`/watch/${movieRoute}`);
  };

  const handleAddToList = (movie) => {
    console.log('Add to list:', movie);
    // Add to user's list
  };

  const handleMoreInfo = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSearch = (query) => {
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    handleSearchClose();
  };

  const handleWatchMovie = (movie) => {
    handleSearchClose();
    handleWatch(movie);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#050505', flexDirection: 'column', gap: 2 }}>
        <CircularProgress sx={{ color: '#FFD600' }} />
        <Typography sx={{ color: '#fff' }}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  if (!featuredMovie || movies.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#050505', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: '#fff' }}>Không thể tải dữ liệu phim</Typography>
        <Button variant="outlined" onClick={() => window.location.reload()} sx={{ color: '#fff', borderColor: '#fff' }}>
          Tải lại trang
        </Button>
      </Box>
    );
  }

  return (
    <Box className="mocaemtui-home">
      <MocaemtuiHeader onSearchClick={handleSearchClick} />
      
      <Box className="home-content">
        <MocaemtuiHero 
          featuredMovie={featuredMovie}
          onWatchClick={handleWatch}
          onAddToList={handleAddToList}
          onMoreInfo={handleMoreInfo}
        />

        <Box className="movie-rows-container">
          {movieCategories.map((category, index) => (
            <MocaemtuiMovieRow
              key={index}
              title={category.title}
              movies={category.movies}
              onWatch={handleWatch}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
            />
          ))}
        </Box>

        <MocaemtuiMovieGrid
          movies={allMovies}
          onWatch={handleWatch}
          onAddToList={handleAddToList}
          onMoreInfo={handleMoreInfo}
        />
      </Box>

      <MocaemtuiMovieModal
        open={modalOpen}
        onClose={handleModalClose}
        movie={selectedMovie}
        onWatch={handleWatch}
        onAddToList={handleAddToList}
      />

      <MocaemtuiSearchOverlay
        open={searchOpen}
        onClose={handleSearchClose}
        onSearch={handleSearch}
        onWatchMovie={handleWatchMovie}
      />
    </Box>
  );
}
