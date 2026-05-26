import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Tabs, Tab, Chip, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import './DetailModal.css';

function TabPanel({ children, value, index }) {
  return value === index ? <Box className="tab-panel">{children}</Box> : null;
}

export default function DetailModal({ open, onClose, content }) {
  const [tabValue, setTabValue] = useState(0);

  if (!open || !content) return null;

  return (
    <Box className="detail-modal-overlay" onClick={onClose}>
      <Box className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <IconButton className="modal-close-btn" onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Box className="modal-banner">
          <Box className="modal-banner-gradient" />
          <Box className="modal-banner-content">
            <Typography variant="h2" className="modal-title">{content.title}</Typography>
            <Typography variant="body1" className="modal-description">{content.description}</Typography>
            
            <Box className="modal-metadata">
              <Chip label={content.category} size="small" className="metadata-chip" />
              <Chip label={content.level} size="small" className="metadata-chip" />
              <span className="metadata-text">{content.duration}</span>
              <span className="metadata-text">{content.year}</span>
            </Box>

            <Box className="modal-actions">
              <Button className="modal-btn-primary" startIcon={<PlayArrowIcon />}>
                Open
              </Button>
              <Button className="modal-btn-secondary" startIcon={<AddIcon />}>
                Save
              </Button>
              <Button className="modal-btn-tertiary" startIcon={<ShareIcon />}>
                Share
              </Button>
            </Box>
          </Box>
        </Box>

        <Box className="modal-body">
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            className="modal-tabs"
            TabIndicatorProps={{ className: 'tab-indicator' }}
          >
            <Tab label="Overview" />
            <Tab label="Chapters" />
            <Tab label="Resources" />
            <Tab label="Discussion" />
            <Tab label="Related" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" className="tab-content">
              {content.fullDescription || content.description}
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box className="chapters-list">
              {content.chapters?.map((chapter, idx) => (
                <Box key={idx} className="chapter-item">
                  <Typography className="chapter-number">{idx + 1}</Typography>
                  <Typography className="chapter-title">{chapter.title}</Typography>
                  <Typography className="chapter-duration">{chapter.duration}</Typography>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1" className="tab-content">
              Resources and downloads will be available here.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="body1" className="tab-content">
              Discussion forum for this content.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="body1" className="tab-content">
              Related content and recommendations.
            </Typography>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}
