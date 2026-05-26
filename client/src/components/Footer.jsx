import { Box, Typography, Link, Stack, IconButton, Divider, Grid, Container } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import XIcon from '@mui/icons-material/X';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    main: [
      { label: 'Home', href: '/' },
      { label: 'AI Tools', href: '/ai-tools' },
      { label: 'Forum', href: '/forum' },
      { label: 'Tutorials', href: '/tutorials' },
    ],
    about: [
      { label: 'About Mocaemtui', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
    social: [
      { label: 'Discord', href: 'https://discord.gg/mocaemtui' },
      { label: 'Twitter', href: 'https://twitter.com/mocaemtui' },
      { label: 'GitHub', href: 'https://github.com/mocaemtui' },
    ]
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#0D0D0D', color: '#AAAAAA', pt: 6, pb: 4, mt: 'auto' }} component="footer">
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* About Mocaemtui */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <PlayCircleIcon sx={{ fontSize: 40, color: '#6E6EFF' }} />
                <Box
                  component={RouterLink}
                  to="/"
                  onClick={handleLogoClick}
                  sx={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  <Typography variant="h4" fontWeight={700} color="#6E6EFF" sx={{ textShadow: '0 0 10px rgba(110, 110, 255, 0.5)' }}>Mocaemtui</Typography>
                </Box>
              </Stack>
              <Typography variant="body2" color="#AAAAAA" lineHeight={1.6}>
                Mocaemtui - Nền tảng tập trung vào nội dung Internet, công nghệ, AI, DeepWeb và Forum underground. Khám phá kiến thức công nghệ mới và kết nối với cộng đồng.
              </Typography>
            </Stack>
          </Grid>

          {/* Links */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" fontWeight={600} mb={2} color="#6E6EFF">Quick Links</Typography>
            <Stack spacing={1.5}>
              {footerLinks.main.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="#AAAAAA"
                  underline="none"
                  sx={{
                    fontSize: 14,
                    '&:hover': { color: '#6E6EFF', textDecoration: 'none', textShadow: '0 0 8px rgba(110, 110, 255, 0.3)' }
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Divider sx={{ my: 1, borderColor: '#333' }} />
              {footerLinks.about.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="#AAAAAA"
                  underline="none"
                  sx={{
                    fontSize: 14,
                    '&:hover': { color: '#6E6EFF', textDecoration: 'none', textShadow: '0 0 8px rgba(110, 110, 255, 0.3)' }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact & Socials */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" fontWeight={600} mb={2} color="#A855F7">Contact & Socials</Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <EmailIcon sx={{ color: '#6E6EFF', fontSize: 20 }} />
                <Typography variant="body2" color="#AAAAAA">contact@mocaemtui.com</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                {footerLinks.social.map((link) => (
                  <IconButton
                    key={link.label}
                    sx={{
                      bgcolor: '#1A1A1A',
                      color: '#AAAAAA',
                      border: '1px solid #333',
                      '&:hover': {
                        bgcolor: '#6E6EFF',
                        color: '#121212',
                        borderColor: '#6E6EFF',
                        boxShadow: '0 0 12px rgba(110, 110, 255, 0.4)'
                      }
                    }}
                  >
                    {link.label === 'Discord' && <span style={{ fontSize: 18 }}>💬</span>}
                    {link.label === 'Twitter' && <XIcon />}
                    {link.label === 'GitHub' && <span style={{ fontSize: 18 }}>🐙</span>}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#333' }} />

        {/* Disclaimer */}
        <Typography variant="body2" color="#777" sx={{ textAlign: 'center', fontSize: 12, lineHeight: 1.6 }}>
          Disclaimer: Nội dung trên Mocaemtui bao gồm AI tools, thông tin DarkWeb và nội dung underground chỉ mang tính chất tham khảo. 
          Người dùng chịu trách nhiệm cho việc sử dụng thông tin từ nền tảng này.
        </Typography>

        <Divider sx={{ my: 3, borderColor: '#333' }} />

        {/* Copyright */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="#777">
            © {new Date().getFullYear()} Mocaemtui. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="#777">
              Version 1.0
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}