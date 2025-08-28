import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import { 
  YouTube, 
  Extension,
  MoreVert
} from '@mui/icons-material';

interface HeaderProps {
  enabledFeaturesCount: number;
}

const Header: React.FC<HeaderProps> = ({ enabledFeaturesCount }) => {
  return (
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
  );
};

export default Header;