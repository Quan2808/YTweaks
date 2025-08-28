import React from 'react';
import {
  Box,
  Typography,
  Switch,
  ListItem,
  Avatar,
} from '@mui/material';

interface FeatureSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

const FeatureSwitch: React.FC<FeatureSwitchProps> = ({ 
  label, 
  description, 
  checked, 
  onChange, 
  icon 
}) => {
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

export default FeatureSwitch;