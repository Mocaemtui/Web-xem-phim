import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import './RightSidebar.css';

const trendingItems = [
  { title: 'GPT-5 Release', category: 'AI Tools', views: '12.5K' },
  { title: 'Dark Web Security Guide', category: 'Cybersecurity', views: '8.2K' },
  { title: 'Neural Network Tutorial', category: 'Tutorials', views: '6.7K' },
  { title: 'Blockchain Privacy', category: 'Privacy', views: '5.4K' },
  { title: 'ML Automation Tools', category: 'AI Tools', views: '4.9K' },
];

const quickLinks = [
  { name: 'Latest AI Tools', path: '/ai-tools/latest' },
  { name: 'Popular Forum Posts', path: '/forum/popular' },
  { name: 'Security Resources', path: '/resources/security' },
  { name: 'Community Guidelines', path: '/guidelines' },
];

export default function RightSidebar() {
  return (
    <Box className="right-sidebar">
      <Box className="sidebar-section">
        <Typography variant="h6" className="sidebar-title">
          <TrendingUpIcon className="trending-icon" />
          Trending Now
        </Typography>
        <List className="trending-list">
          {trendingItems.map((item, index) => (
            <ListItem key={index} className="trending-item">
              <Box className="trending-number">{index + 1}</Box>
              <Box className="trending-content">
                <Typography className="trending-title">{item.title}</Typography>
                <Box className="trending-meta">
                  <Chip label={item.category} size="small" className="trending-chip" />
                  <span className="trending-views">{item.views} views</span>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box className="sidebar-section">
        <Typography variant="h6" className="sidebar-title">Quick Links</Typography>
        <List className="quick-links-list">
          {quickLinks.map((link, index) => (
            <ListItem key={index} className="quick-link-item">
              <ListItemText primary={link.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
