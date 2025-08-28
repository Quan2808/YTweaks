import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Settings } from '@mui/icons-material';

interface FooterProps {
  onApplyAll?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onApplyAll }) => {
  return (
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
          onClick={onApplyAll}
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
  );
};

export default Footer;