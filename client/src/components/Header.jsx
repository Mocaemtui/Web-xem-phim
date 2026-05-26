import { AppBar, Toolbar, Typography, InputBase, Box, IconButton, Menu, MenuItem, Avatar, Button, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import React, { useState, useEffect } from 'react';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'AI Tools', path: '/ai-tools' },
  { label: 'Tech Library', path: '/tech-library' },
  { label: 'Cybersecurity', path: '/cybersecurity' },
  { label: 'Forum', path: '/forum' },
  { label: 'Tutorials', path: '/tutorials' },
  { label: 'Research', path: '/research' },
];

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenu, setUserMenu] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notificationTab, setNotificationTab] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState(() => localStorage.getItem('searchInputValue') || "");

  // Lưu giá trị input vào localStorage mỗi khi thay đổi
  useEffect(() => {
    // Nếu không phải trang /search thì lưu, còn /search thì không lưu
    if (!location.pathname.startsWith('/search')) {
      localStorage.setItem('searchInputValue', searchValue);
    }
  }, [searchValue, location.pathname]);

  // Khi chuyển sang /search thì reset input và xóa localStorage
  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
      setSearchValue("");
      localStorage.removeItem('searchInputValue');
    }
  }, [location.pathname]);

  // Xử lý scroll để thay đổi background header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleUserMenu = (event) => setUserMenu(event.currentTarget);
  const handleUserClose = () => setUserMenu(null);
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };
  const handleNotificationTab = (event, newValue) => {
    setNotificationTab(newValue);
  };

  // Thêm hàm xử lý Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    handleUserClose();
  };

  return (
    <AppBar position="fixed" color="default" className={`header-appbar ${scrolled ? 'scrolled' : ''}`}>
      <Toolbar disableGutters className="header-toolbar">
        {/* Cụm trái: Logo + Search */}
        <Box className="header-left">
          {/* <MovieIcon style={{ marginRight: 8 }} /> */}
          <PlayCircleIcon sx={{ fontSize: 40, color: '#FFD600' }} />
          <Typography
            variant="h6"
            className="header-logo"
            component={RouterLink}
            to="/"
            onClick={handleLogoClick}
            sx={{
              color: '#ff2b3a',
              fontWeight: 700,
              fontSize: '1.5rem',
              '&:hover': {
                color: '#ffffff',
              }
            }}
          >
            Mocaemtui
          </Typography>
          <Box className="header-search">
            <SearchIcon className="header-search-icon" />
            <InputBase
              id="search-input"
              name="search"
              placeholder="Tìm kiếm phim, diễn viên"
              className="header-search-input"
              inputProps={{ className: "header-search-input-real" }}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </Box>
        </Box>
        {/* Cụm phải: Menu + Thành viên */}
        <Box className="header-right">
          <Box className="header-menu">
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  className="header-menu-btn"
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: '#b3b3b3',
                    '&:hover': {
                      color: '#ffffff',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            {/* Menu mobile */}
            <Box className="header-menu-mobile">
              <IconButton color="inherit" onClick={handleMenu}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    onClick={handleClose}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
          <Box className="header-user">
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {user && user.username ? (
                <>
                  <IconButton
                    className="header-notification-btn"
                    onClick={handleNotificationClick}
                  >
                    <NotificationsNoneIcon />
                  </IconButton>
                  <IconButton onClick={handleUserMenu} className="header-avatar-btn">
                    <Avatar
                      src={user.avatar || undefined}
                      className="header-avatar"
                    >
                      {!user.avatar && (user.username ? user.username[0].toUpperCase() : <PersonIcon />)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={userMenu}
                    open={Boolean(userMenu)}
                    onClose={handleUserClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      sx: {
                        bgcolor: '#232a3b',
                        color: '#fff',
                        minWidth: 200,
                        borderRadius: 3,
                        mt: 1.5,
                        boxShadow: 3,
                        p: 0,
                        overflow: 'visible',
                      }
                    }}
                  >
                    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                      <Typography variant="body2" color="#aaa">Chào,</Typography>
                      <Typography variant="body1" fontWeight={700} color="#FFD600">{user.username}</Typography>
                    </Box>
                    <Divider sx={{ bgcolor: '#333' }} />
                    <MenuItem sx={{ py: 1.2 }}><FavoriteBorderIcon sx={{ mr: 1 }} /> Yêu thích</MenuItem>
                    <MenuItem sx={{ py: 1.2 }}><AddIcon sx={{ mr: 1 }} /> Danh sách</MenuItem>
                    <MenuItem sx={{ py: 1.2 }}><HistoryIcon sx={{ mr: 1 }} /> Xem tiếp</MenuItem>
                    <MenuItem sx={{ py: 1.2 }} onClick={() => navigate('/user/profile')}>
                      <AccountCircleIcon sx={{ mr: 1, color: '#fff' }} /> Tài khoản
                    </MenuItem>
                    {Boolean(user.is_admin) && (
                      <>
                        <Divider sx={{ bgcolor: '#333' }} />
                        <MenuItem sx={{ py: 1.2 }} onClick={() => { navigate('/admin'); handleUserClose(); }}>
                          <BarChartIcon sx={{ mr: 1, color: '#fff' }} /> Admin Dashboard
                        </MenuItem>
                      </>
                    )}
                    <Divider sx={{ bgcolor: '#333' }} />
                    <MenuItem sx={{ py: 1.2, color: '#fff', transition: 'color 0.18s', '&:hover': { color: '#FFD600', bgcolor: 'transparent' } }} onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1, color: '#fff' }} /> Thoát
                    </MenuItem>
                  </Menu>
                  <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleNotificationClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      sx: {
                        bgcolor: '#232a3b',
                        color: '#fff',
                        minWidth: 340,
                        maxWidth: 360,
                        borderRadius: 3,
                        mt: 1.5,
                        boxShadow: 6,
                        p: 0,
                        overflow: 'visible',
                      }
                    }}
                  >
                    <Box sx={{ px: 2, pt: 2, pb: 0 }}>
                      <Tabs
                        value={notificationTab}
                        onChange={handleNotificationTab}
                        textColor="inherit"
                        TabIndicatorProps={{ sx: { bgcolor: '#FFD600', height: 3, borderRadius: 2 } }}
                        sx={{ minHeight: 36, mb: 1 }}
                      >
                        <Tab label="Phim" sx={{ color: notificationTab === 0 ? '#FFD600' : '#fff', fontWeight: 600, minWidth: 80 }} />
                        <Tab label="Cộng đồng" sx={{ color: notificationTab === 1 ? '#FFD600' : '#fff', fontWeight: 600, minWidth: 110 }} />
                        <Tab label="Đã đọc" sx={{ color: notificationTab === 2 ? '#FFD600' : '#fff', fontWeight: 600, minWidth: 90 }} />
                      </Tabs>
                    </Box>
                    <Divider sx={{ bgcolor: '#333', mb: 0.5 }} />
                    <Box sx={{ px: 2, py: 3, textAlign: 'center', color: '#bdbdbd', fontSize: 16, minHeight: 60 }}>
                      Không có thông báo nào
                    </Box>
                    <Divider sx={{ bgcolor: '#333', mt: 0.5 }} />
                    <Box sx={{ py: 1.5, textAlign: 'center', cursor: 'pointer', color: '#FFD600', fontWeight: 600, fontSize: 16, borderRadius: 0, transition: 'background 0.2s', '&:hover': { bgcolor: '#23242a' } }}>
                      Xem toàn bộ
                    </Box>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setOpenLogin(true)}
                  startIcon={<PersonIcon />}
                  className="header-member-btn"
                >
                  Thành viên
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Toolbar>
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} onRegister={() => { setOpenLogin(false); setOpenRegister(true); }} onForgot={() => { setOpenLogin(false); setOpenForgot(true); }} />
      <RegisterDialog open={openRegister} onClose={() => setOpenRegister(false)} onLogin={() => { setOpenRegister(false); setOpenLogin(true); }} />
      <ForgotPasswordDialog open={openForgot} onClose={() => setOpenForgot(false)} onLogin={() => { setOpenForgot(false); setOpenLogin(true); }} />
    </AppBar>
  );
} 