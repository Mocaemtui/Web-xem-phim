import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './LeftSidebar.css';

const categories = [
  { name: 'AI Tools', path: '/ai-tools', icon: '🤖' },
  { name: 'Forum', path: '/forum', icon: '💬' },
  { name: 'DarkWeb Insights', path: '/darkweb', icon: '🔒' },
  { name: 'Tutorials', path: '/tutorials', icon: '📚' },
  { name: 'About', path: '/about', icon: 'ℹ️' },
];

const tags = [
  'Artificial Intelligence',
  'Machine Learning',
  'Cybersecurity',
  'Blockchain',
  'Deep Web',
  'Privacy',
  'Automation',
  'Neural Networks',
];

export default function LeftSidebar() {
  return (
    <Box className="left-sidebar">
      <Box className="sidebar-section">
        <Typography variant="h6" className="sidebar-title">Navigation</Typography>
        <List className="sidebar-nav-list">
          {categories.map((category) => (
            <ListItem
              key={category.name}
              component={RouterLink}
              to={category.path}
              className="sidebar-nav-item"
            >
              <span className="sidebar-nav-icon">{category.icon}</span>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider className="sidebar-divider" />

      <Box className="sidebar-section">
        <Typography variant="h6" className="sidebar-title">Popular Tags</Typography>
        <Box className="sidebar-tags">
          {tags.map((tag) => (
            <span key={tag} className="sidebar-tag">{tag}</span>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
