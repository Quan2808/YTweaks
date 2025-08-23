import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { YouTube, Settings } from '@mui/icons-material';
import FeatureSwitch from './components/FeatureSwitch';

interface FeatureConfig {
  pipColorToggle: boolean;
}

const Popup: React.FC = () => {
  const [features, setFeatures] = useState<FeatureConfig>({ pipColorToggle: true });

  useEffect(() => {
    chrome.storage.sync.get(['features'], (data) => {
      setFeatures(data.features || { pipColorToggle: true });
    });
  }, []);

  const handleFeatureToggle = (feature: keyof FeatureConfig, enabled: boolean) => {
    const updatedFeatures = { ...features, [feature]: enabled };
    setFeatures(updatedFeatures);
    chrome.storage.sync.set({ features: updatedFeatures });
  };

  return (
    <Box sx={{ padding: 2, width: 320, bgcolor: 'background.default' }}>
      <Paper
        elevation={4}
        sx={{
          padding: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff, #f9f9f9)',
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" mb={2}>
          <YouTube color="error" fontSize="large" />
          <Box ml={1}>
            <Typography variant="h6" fontWeight="bold">
              YouTube Enhancer
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tùy chỉnh trải nghiệm xem video
            </Typography>
          </Box>
          <Box flexGrow={1} />
          <IconButton size="small">
            <Settings fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Features List */}
        <List dense>
          <ListItem>
            <ListItemText
              primary="PiP Button Color Toggle"
              secondary="Đổi màu nút Picture-in-Picture"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={features.pipColorToggle}
                onChange={(e) => handleFeatureToggle('pipColorToggle', e.target.checked)}
              />
            </ListItemSecondaryAction>
          </ListItem>

          {/* Thêm các FeatureSwitch khác ở đây */}
        </List>
      </Paper>
    </Box>
  );
};

export default Popup;
