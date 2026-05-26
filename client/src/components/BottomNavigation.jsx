import React from 'react';
import { Box, BottomNavigation as MuiBottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

const navigationItems = [
  { label: 'Trang chủ', icon: <HomeIcon />, path: '/' },
  { label: 'Phim', icon: <MovieIcon />, path: '/movies' },
  { label: 'Series', icon: <TvIcon />, path: '/series' },
  { label: 'Tìm kiếm', icon: <SearchIcon />, path: '/search' },
  { label: 'Yêu thích', icon: <FavoriteIcon />, path: '/favorites' },
];

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(navigationItems[newValue].path);
  };

  // Update value based on current location
  React.useEffect(() => {
    const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  return (
    <Box className="bottom-navigation-container">
      <MuiBottomNavigation
        value={value}
        onChange={handleChange}
        className="mocaemtui-bottom-navigation"
      >
        {navigationItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={item.icon}
            className="bottom-nav-action"
          />
        ))}
      </MuiBottomNavigation>
    </Box>
  );
}
