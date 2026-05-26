import { useState, useEffect } from 'react';
import { Box, Typography, Chip, Paper, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getSourceManager } from '../services/sourceManager';
import './SourceStatusPanel.css';

export default function SourceStatusPanel() {
  const [expanded, setExpanded] = useState(false);
  const [providerStatus, setProviderStatus] = useState({});
  const [lastHealthCheck, setLastHealthCheck] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);

  useEffect(() => {
    const sourceManager = getSourceManager();
    
    const updateStatus = () => {
      setProviderStatus(sourceManager.getProviderStatus());
      setLastHealthCheck(sourceManager.getLastHealthCheck());
      setActiveProvider(sourceManager.getActiveProvider());
    };

    updateStatus();
    
    // Update status every 30 seconds
    const interval = setInterval(updateStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  // Only show in development mode
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <Paper className="source-status-panel" elevation={2}>
      <Box className="source-status-header" onClick={handleToggle}>
        <Typography variant="subtitle2" className="source-status-title">
          Source Status
        </Typography>
        <IconButton 
          size="small" 
          className={`expand-icon ${expanded ? 'expanded' : ''}`}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      
      <Collapse in={expanded}>
        <Box className="source-status-content">
          {activeProvider && (
            <Box className="active-provider-info">
              <Typography variant="caption" className="active-provider-label">
                Active Provider:
              </Typography>
              <Chip 
                label={activeProvider.name} 
                size="small" 
                color="success" 
                variant="outlined"
              />
            </Box>
          )}
          
          {!activeProvider && (
            <Box className="no-provider-warning">
              <Typography variant="caption" color="error">
                No healthy provider available
              </Typography>
            </Box>
          )}
          
          <Box className="provider-list">
            {Object.entries(providerStatus).map(([providerId, status]) => (
              <Box key={providerId} className="provider-item">
                <Box className="provider-info">
                  <Typography variant="caption" className="provider-name">
                    {providerId.toUpperCase()}
                  </Typography>
                  <Chip 
                    label={status.enabled ? 'Enabled' : 'Disabled'}
                    size="small"
                    color={status.enabled ? 'primary' : 'default'}
                    variant="outlined"
                  />
                  <Chip 
                    label={status.healthy ? 'Healthy' : 'Unhealthy'}
                    size="small"
                    color={status.healthy ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
                {status.error && (
                  <Typography variant="caption" className="provider-error">
                    Error: {status.error}
                  </Typography>
                )}
                <Typography variant="caption" className="provider-last-checked">
                  Last checked: {formatTime(status.lastChecked)}
                </Typography>
              </Box>
            ))}
          </Box>
          
          {lastHealthCheck && (
            <Typography variant="caption" className="last-health-check">
              Last health check: {formatTime(lastHealthCheck)}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
