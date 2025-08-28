import React from 'react';
import {
  Box,
  Typography,
  List,
} from '@mui/material';
import { PictureInPicture } from '@mui/icons-material';
import FeatureSwitch from './FeatureSwitch';
import { FeatureConfig } from '../../shared/types';

interface FeaturesListProps {
  features: FeatureConfig;
  onFeatureToggle: (feature: keyof FeatureConfig, enabled: boolean) => void;
}

const FeaturesList: React.FC<FeaturesListProps> = ({ features, onFeatureToggle }) => {
  return (
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
          onChange={(checked) => onFeatureToggle('pipColorToggle', checked)}
          icon={<PictureInPicture sx={{ fontSize: 20 }} />}
        />
      </List>
    </Box>
  );
};

export default FeaturesList;