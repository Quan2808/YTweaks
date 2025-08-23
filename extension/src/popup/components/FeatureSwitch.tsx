import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

interface FeatureSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FeatureSwitch: React.FC<FeatureSwitchProps> = ({ label, checked, onChange }) => {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={label}
      sx={{ display: 'block', marginBottom: 1 }}
    />
  );
};

export default FeatureSwitch;