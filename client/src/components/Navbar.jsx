import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, IconButton, Button, Avatar, Menu, MenuItem, Divider, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './Navbar.css';

const navigationItems = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Phim', path: '/movies' },
  { label: 'Series', path: '/series' },
  { label: 'Noel Collection', path: '/noel' },
  { label: 'Mới & Hot', path: '/trending' },
  { label: 'Danh sách của tôi', path: '/mylist' },
];

export default function Navbar({ onSearchClick }) {
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
      className={`mocaemtui-navbar ${scrolled ? 'scrolled' : ''}`}
      elevation={0}
    >
      <Toolbar className="navbar-toolbar">
        {/* Logo */}
        <Logo onClick={handleLogoClick} size="medium" />

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
        <Box className="navbar-search">
          <SearchIcon className="search-icon" />
          <InputBase
            placeholder="Tìm kiếm phim..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                onSearchClick && onSearchClick(searchQuery);
              }
            }}
          />
        </Box>

        {/* Right Actions */}
        <Box className="navbar-actions">
          <IconButton 
            className="action-button"
            onClick={() => onSearchClick && onSearchClick(searchQuery)}
            aria-label="Search"
          >
            <SearchIcon />
          </IconButton>
          
          {user && user.username ? (
            <>
              <IconButton 
                className="action-button"
                aria-label="Notifications"
              >
                <NotificationsNoneIcon />
              </IconButton>
              <IconButton 
                onClick={handleUserMenuOpen} 
                className="action-button"
                aria-label="User menu"
              >
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
              Đăng nhập
            </Button>
          )}

          {/* Mobile Menu Button */}
          <IconButton 
            className="mobile-menu-button"
            onClick={handleMobileMenuOpen}
            aria-label="Menu"
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
            bgcolor: '#0E1C12',
            minWidth: 200,
            mt: 1,
          }
        }}
      >
        {navigationItems.map((item) => (
          <MenuItem 
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            sx={{ color: '#F8FAFC', '&:hover': { bgcolor: '#16A34A' } }}
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
            bgcolor: '#0E1C12',
            minWidth: 200,
            mt: 1,
          }
        }}
      >
        <MenuItem sx={{ color: '#F8FAFC', '&:hover': { bgcolor: '#16A34A' } }}>
          Danh sách của tôi
        </MenuItem>
        <MenuItem sx={{ color: '#F8FAFC', '&:hover': { bgcolor: '#16A34A' } }}>
          Tiếp tục xem
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(22, 163, 74, 0.2)' }} />
        <MenuItem sx={{ color: '#F8FAFC', '&:hover': { bgcolor: '#16A34A' } }}>
          Hồ sơ
        </MenuItem>
        <MenuItem sx={{ color: '#F8FAFC', '&:hover': { bgcolor: '#16A34A' } }}>
          Cài đặt
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(22, 163, 74, 0.2)' }} />
        <MenuItem 
          sx={{ color: '#16A34A', '&:hover': { bgcolor: '#16A34A' } }}
          onClick={() => {
            localStorage.removeItem('user');
            handleUserMenuClose();
            navigate('/');
          }}
        >
          Đăng xuất
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
