import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Button, Avatar, Menu, MenuItem, Divider, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import ParkIcon from '@mui/icons-material/Park';
import { useNavigate } from 'react-router-dom';
import './MocaemtuiHeader.css';

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Movies', path: '/movies' },
  { label: 'Series', path: '/series' },
  { label: 'Anime', path: '/anime' },
  { label: 'TV Shows', path: '/tv-shows' },
  { label: 'Genres', path: '/genres' },
  { label: 'Countries', path: '/countries' },
];

export default function MocaemtuiHeader({ onSearchClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  return (
    <AppBar 
      position="fixed" 
      className={`mocaemtui-header ${scrolled ? 'scrolled' : ''}`}
      elevation={0}
    >
      <Toolbar className="mocaemtui-toolbar">
        {/* Logo */}
        <Box className="mocaemtui-logo" onClick={handleLogoClick}>
          <ParkIcon className="logo-icon" />
          <Typography variant="h4" className="logo-text">
            Mocaemtui
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        <Box className="desktop-navigation">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              className="nav-button"
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Search Input */}
        <Box className="header-search">
          <SearchIcon className="search-icon" />
          <InputBase
            placeholder="Search movies..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                onSearchClick && onSearchClick();
              }
            }}
          />
        </Box>

        {/* Right Actions */}
        <Box className="header-actions">
          <IconButton 
            className="action-button"
            onClick={onSearchClick}
          >
            <SearchIcon />
          </IconButton>
          
          {user && user.username ? (
            <>
              <IconButton className="action-button">
                <NotificationsNoneIcon />
              </IconButton>
              <IconButton onClick={handleUserMenuOpen} className="action-button">
                <Avatar 
                  src={user.avatar}
                  className="user-avatar"
                >
                  {!user.avatar && user.username[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </>
          ) : (
            <Button 
              className="signin-button"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Button */}
          <IconButton 
            className="mobile-menu-button"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        className="mobile-menu"
        PaperProps={{
          sx: {
            bgcolor: '#141414',
            minWidth: 200,
            mt: 1,
          }
        }}
      >
        {navigationItems.map((item) => (
          <MenuItem 
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            sx={{ color: '#ffffff', '&:hover': { bgcolor: '#1f1f1f' } }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        className="user-menu"
        PaperProps={{
          sx: {
            bgcolor: '#141414',
            minWidth: 200,
            mt: 1,
          }
        }}
      >
        <MenuItem sx={{ color: '#ffffff', '&:hover': { bgcolor: '#1f1f1f' } }}>
          My List
        </MenuItem>
        <MenuItem sx={{ color: '#ffffff', '&:hover': { bgcolor: '#1f1f1f' } }}>
          Continue Watching
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        <MenuItem sx={{ color: '#ffffff', '&:hover': { bgcolor: '#1f1f1f' } }}>
          Profile
        </MenuItem>
        <MenuItem sx={{ color: '#ffffff', '&:hover': { bgcolor: '#1f1f1f' } }}>
          Settings
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        <MenuItem 
          sx={{ color: '#2ecc71', '&:hover': { bgcolor: '#1f1f1f' } }}
          onClick={() => {
            localStorage.removeItem('user');
            handleUserMenuClose();
            navigate('/');
          }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
