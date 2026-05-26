import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#16A34A' },
    secondary: { main: '#22C55E' },
    background: {
      default: '#050A06',
      paper: '#0E1C12',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#A7B3AA',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleSearchClick = (query) => {
    if (query && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        bgcolor: '#050A06',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {!isAdminPage && <Navbar onSearchClick={handleSearchClick} />}
        {!isAdminPage && <Box sx={{ height: { xs: 70, md: 80 } }} />}
        <Box component="main" sx={{ flex: 1, width: '100%' }}>
          <Outlet />
        </Box>
        {!isAdminPage && <BottomNavigation />}
      </Box>
      <ScrollToTop />
    </ThemeProvider>
  );
}

export default App;
