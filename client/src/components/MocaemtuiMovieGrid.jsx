import React, { useState } from 'react';
import { Box, Typography, Button, Drawer, FormControl, Select, MenuItem, Chip, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import MocaemtuiMovieCard from './MocaemtuiMovieCard';
import './MocaemtuiMovieGrid.css';

const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

const countries = [
  'United States', 'United Kingdom', 'South Korea', 'Japan', 'China',
  'France', 'Germany', 'India', 'Spain', 'Canada', 'Australia'
];

const qualities = ['HD', 'Full HD', '4K'];
const movieTypes = ['Movie', 'Series', 'Anime'];
const statuses = ['Ongoing', 'Completed', 'Upcoming'];
const sortOptions = ['Latest', 'Popular', 'Rating', 'Title'];

export default function MocaemtuiMovieGrid({ movies, onWatch, onAddToList, onMoreInfo }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('Latest');

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  const handleFilterChange = (filter, value) => {
    switch (filter) {
      case 'genre':
        setSelectedGenre(value);
        break;
      case 'country':
        setSelectedCountry(value);
        break;
      case 'year':
        setSelectedYear(value);
        break;
      case 'quality':
        setSelectedQuality(value);
        break;
      case 'type':
        setSelectedType(value);
        break;
      case 'status':
        setSelectedStatus(value);
        break;
      case 'sort':
        setSortBy(value);
        break;
      default:
        break;
    }
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedCountry('');
    setSelectedYear('');
    setSelectedQuality('');
    setSelectedType('');
    setSelectedStatus('');
    setSortBy('Latest');
  };

  const hasActiveFilters = selectedGenre || selectedCountry || selectedYear || 
                          selectedQuality || selectedType || selectedStatus;

  const filterDrawerContent = (
    <Box className="filter-drawer-content">
      <Box className="filter-header">
        <Typography variant="h6" className="filter-title">Filters</Typography>
        <IconButton onClick={() => setFiltersOpen(false)} className="close-filter-btn">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className="filter-section">
        <Typography variant="subtitle2" className="filter-label">Genre</Typography>
        <FormControl fullWidth className="filter-control">
          <Select
            value={selectedGenre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            displayEmpty
            className="filter-select"
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>{genre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="filter-section">
        <Typography variant="subtitle2" className="filter-label">Country</Typography>
        <FormControl fullWidth className="filter-control">
          <Select
            value={selectedCountry}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            displayEmpty
            className="filter-select"
          >
            <MenuItem value="">All Countries</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>{country}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="filter-section">
        <Typography variant="subtitle2" className="filter-label">Release Year</Typography>
        <FormControl fullWidth className="filter-control">
          <Select
            value={selectedYear}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            displayEmpty
            className="filter-select"
          >
            <MenuItem value="">All Years</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="filter-section">
        <Typography variant="subtitle2" className="filter-label">Quality</Typography>
        <FormControl fullWidth className="filter-control">
          <Select
            value={selectedQuality}
            onChange={(e) => handleFilterChange('quality', e.target.value)}
            displayEmpty
            className="filter-select"
          >
            <MenuItem value="">All Qualities</MenuItem>
            {qualities.map((quality) => (
              <MenuItem key={quality} value={quality}>{quality}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="filter-section">
        <Typography variant="subtitle2" className="filter-label">Type</Typography>
        <FormControl fullWidth className="filter-control">
          <Select
            value={selectedType}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            displayEmpty
            className="filter-select"
          >
            <MenuItem value="">All Types</MenuItem>
            {movieTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="filter-section">
        <Typography variant="subtitle2" className="filter-label">Status</Typography>
        <FormControl fullWidth className="filter-control">
          <Select
            value={selectedStatus}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            displayEmpty
            className="filter-select"
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="filter-section">
        <Typography variant="subtitle2" className="filter-label">Sort By</Typography>
        <FormControl fullWidth className="filter-control">
          <Select
            value={sortBy}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="filter-select"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {hasActiveFilters && (
        <Button 
          className="clear-filters-btn"
          onClick={clearFilters}
          fullWidth
        >
          Clear All Filters
        </Button>
      )}
    </Box>
  );

  return (
    <Box className="mocaemtui-movie-grid">
      <Box className="grid-header">
        <Typography variant="h4" className="grid-title">All Movies</Typography>
        <Button 
          className="filter-toggle-btn"
          startIcon={<FilterListIcon />}
          onClick={() => setFiltersOpen(true)}
        >
          Filters
          {hasActiveFilters && <Chip label="Active" size="small" className="active-filter-chip" />}
        </Button>
      </Box>

      <Box className="grid-layout">
        {/* Desktop Sidebar */}
        <Box className="grid-sidebar desktop-sidebar">
          <Box className="sidebar-filters">
            <Box className="filter-section">
              <Typography variant="subtitle2" className="filter-label">Genre</Typography>
              <FormControl fullWidth className="filter-control">
                <Select
                  value={selectedGenre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  displayEmpty
                  className="filter-select"
                >
                  <MenuItem value="">All Genres</MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="filter-section">
              <Typography variant="subtitle2" className="filter-label">Country</Typography>
              <FormControl fullWidth className="filter-control">
                <Select
                  value={selectedCountry}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  displayEmpty
                  className="filter-select"
                >
                  <MenuItem value="">All Countries</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="filter-section">
              <Typography variant="subtitle2" className="filter-label">Release Year</Typography>
              <FormControl fullWidth className="filter-control">
                <Select
                  value={selectedYear}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  displayEmpty
                  className="filter-select"
                >
                  <MenuItem value="">All Years</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="filter-section">
              <Typography variant="subtitle2" className="filter-label">Quality</Typography>
              <FormControl fullWidth className="filter-control">
                <Select
                  value={selectedQuality}
                  onChange={(e) => handleFilterChange('quality', e.target.value)}
                  displayEmpty
                  className="filter-select"
                >
                  <MenuItem value="">All Qualities</MenuItem>
                  {qualities.map((quality) => (
                    <MenuItem key={quality} value={quality}>{quality}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="filter-section">
              <Typography variant="subtitle2" className="filter-label">Type</Typography>
              <FormControl fullWidth className="filter-control">
                <Select
                  value={selectedType}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  displayEmpty
                  className="filter-select"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {movieTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="filter-section">
              <Typography variant="subtitle2" className="filter-label">Status</Typography>
              <FormControl fullWidth className="filter-control">
                <Select
                  value={selectedStatus}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  displayEmpty
                  className="filter-select"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="filter-section">
              <Typography variant="subtitle2" className="filter-label">Sort By</Typography>
              <FormControl fullWidth className="filter-control">
                <Select
                  value={sortBy}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="filter-select"
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {hasActiveFilters && (
              <Button 
                className="clear-filters-btn"
                onClick={clearFilters}
                fullWidth
              >
                Clear All Filters
              </Button>
            )}
          </Box>
        </Box>

        {/* Movie Grid */}
        <Box className="grid-content">
          <Box className="movie-grid">
            {movies && movies.length > 0 ? (
              movies.map((movie, index) => (
                <Box key={movie.id || index} className="grid-card-wrapper">
                  <MocaemtuiMovieCard
                    movie={movie}
                    onWatch={onWatch}
                    onAddToList={onAddToList}
                    onMoreInfo={onMoreInfo}
                  />
                </Box>
              ))
            ) : (
              // Placeholder cards
              [...Array(24)].map((_, index) => (
                <Box key={index} className="grid-card-wrapper">
                  <MocaemtuiMovieCard />
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        className="mobile-filter-drawer"
        PaperProps={{
          sx: {
            width: 320,
            bgcolor: '#141414',
            borderRight: '1px solid rgba(255,255,255,0.08)'
          }
        }}
      >
        {filterDrawerContent}
      </Drawer>
    </Box>
  );
}
