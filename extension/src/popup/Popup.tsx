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
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import { 
  YouTube, 
  Settings, 
  PictureInPicture,
  Speed,
  VideoSettings,
  Palette,
  Extension,
  MoreVert
} from '@mui/icons-material';

interface FeatureConfig {
  pipColorToggle: boolean;
}

const FeatureSwitch: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}> = ({ label, description, checked, onChange, icon }) => {
  return (
    <ListItem 
      sx={{ 
        py: 1.5,
        px: 2,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        borderRadius: 1,
      }}
    >
      <Box display="flex" alignItems="center" width="100%">
        {icon && (
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 2,
              bgcolor: '#FF0000',
              color: 'white'
            }}
          >
            {icon}
          </Avatar>
        )}
        <Box flex={1}>
          <Typography 
            variant="body1" 
            fontWeight={500}
            sx={{ 
              color: '#0f0f0f',
              fontSize: '14px',
              lineHeight: '20px'
            }}
          >
            {label}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#606060',
              fontSize: '12px',
              lineHeight: '16px'
            }}
          >
            {description}
          </Typography>
        </Box>
        <Switch
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#FF0000',
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.04)',
              },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#FF0000',
            },
          }}
        />
      </Box>
    </ListItem>
  );
};

const Popup: React.FC = () => {
  const [features, setFeatures] = useState<FeatureConfig>({ 
    pipColorToggle: true,
  });

  useEffect(() => {
    // Simulate chrome.storage.sync.get
    const savedFeatures = localStorage.getItem('features');
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures));
    }
  }, []);

  const handleFeatureToggle = (feature: keyof FeatureConfig, enabled: boolean) => {
    const updatedFeatures = { ...features, [feature]: enabled };
    setFeatures(updatedFeatures);
    // Simulate chrome.storage.sync.set
    localStorage.setItem('features', JSON.stringify(updatedFeatures));
  };

  const enabledFeaturesCount = Object.values(features).filter(Boolean).length;

  return (
    <Box sx={{ 
      width: 380, 
      bgcolor: '#ffffff',
      fontFamily: '"Roboto", "Arial", sans-serif'
    }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5'
        }}
      >
        {/* Header - YouTube Style */}
        <Box 
          sx={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e5e5',
            backgroundColor: '#ffffff'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <YouTube 
                sx={{ 
                  color: '#FF0000', 
                  fontSize: 28,
                  mr: 1.5
                }} 
              />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#0f0f0f',
                    lineHeight: '22px',
                    mb: 0.5
                  }}
                >
                  YouTube Enhancer
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    size="small"
                    label={`${enabledFeaturesCount} tính năng đang bật`}
                    sx={{
                      height: '20px',
                      fontSize: '11px',
                      backgroundColor: '#f2f2f2',
                      color: '#606060',
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                  <Extension sx={{ fontSize: 14, color: '#606060' }} />
                </Box>
              </Box>
            </Box>
            
            <IconButton 
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <MoreVert sx={{ fontSize: 20, color: '#606060' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Features List */}
        <Box sx={{ pb: 1 }}>
          <Typography 
            variant="overline" 
            sx={{
              px: 2,
              pt: 2,
              pb: 1,
              display: 'block',
              fontSize: '11px',
              fontWeight: 500,
              color: '#606060',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}
          >
            Tính năng nâng cao
          </Typography>
          
          <List sx={{ py: 0 }}>
            <FeatureSwitch
              label="Picture-in-Picture Enhanced"
              description="Tùy chỉnh màu sắc và vị trí nút PiP"
              checked={features.pipColorToggle}
              onChange={(checked) => handleFeatureToggle('pipColorToggle', checked)}
              icon={<PictureInPicture sx={{ fontSize: 20 }} />}
            />
          </List>
        </Box>

        {/* Footer Actions */}
        <Box 
          sx={{
            p: 2,
            borderTop: '1px solid #e5e5e5',
            backgroundColor: '#f9f9f9'
          }}
        >
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Settings sx={{ fontSize: 16 }} />}
              sx={{
                flex: 1,
                textTransform: 'none',
                fontSize: '13px',
                borderColor: '#d0d0d0',
                color: '#606060',
                '&:hover': {
                  borderColor: '#909090',
                  backgroundColor: '#f0f0f0'
                }
              }}
            >
              Cài đặt nâng cao
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                flex: 1,
                textTransform: 'none',
                fontSize: '13px',
                backgroundColor: '#FF0000',
                '&:hover': {
                  backgroundColor: '#cc0000',
                }
              }}
            >
              Áp dụng tất cả
            </Button>
          </Box>
          
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 1,
              color: '#909090',
              fontSize: '11px'
            }}
          >
            YouTube Enhancer v2.1.0
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Popup;