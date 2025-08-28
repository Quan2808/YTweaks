export interface FeatureConfig {
  pipColorToggle: boolean;
}

export interface MessageRequest {
  action: 'updateFeatures' | 'getFeatures' | 'toggleFeature';
  features?: FeatureConfig;
  featureName?: keyof FeatureConfig;
  enabled?: boolean;
}

export interface MessageResponse {
  success: boolean;
  features?: FeatureConfig;
  error?: string;
}