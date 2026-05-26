import React, { useState } from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ForumIcon from '@mui/icons-material/Forum';
import LockIcon from '@mui/icons-material/Lock';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './QuickAccessBar.css';

const quickAccessItems = [
  { icon: <PsychologyIcon />, label: 'AI Tools', path: '/ai-tools' },
  { icon: <ForumIcon />, label: 'Forum', path: '/forum' },
  { icon: <LockIcon />, label: 'DarkWeb', path: '/darkweb' },
  { icon: <MenuBookIcon />, label: 'Tutorials', path: '/tutorials' },
];

export default function QuickAccessBar() {
  const [hovered, setHovered] = useState(null);

  return (
    <Box className="quick-access-bar">
      {quickAccessItems.map((item, index) => (
        <Tooltip key={index} title={item.label} placement="right">
          <IconButton
            className={`quick-access-icon ${hovered === index ? 'hovered' : ''}`}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}
