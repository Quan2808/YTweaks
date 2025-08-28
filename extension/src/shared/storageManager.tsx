import { FeatureConfig } from './types';

export class StorageManager {
  private static readonly STORAGE_KEY = 'features';
  private static readonly DEFAULT_FEATURES: FeatureConfig = {
    pipColorToggle: true,
  };

  static async getFeatures(): Promise<FeatureConfig> {
    try {
      const result = await chrome.storage.sync.get([this.STORAGE_KEY]);
      return result[this.STORAGE_KEY] || this.DEFAULT_FEATURES;
    } catch (error) {
      console.error('Failed to get features from storage:', error);
      return this.DEFAULT_FEATURES;
    }
  }

  static async setFeatures(features: FeatureConfig): Promise<void> {
    try {
      await chrome.storage.sync.set({ [this.STORAGE_KEY]: features });
    } catch (error) {
      console.error('Failed to save features to storage:', error);
      throw error;
    }
  }

  static async toggleFeature(featureName: keyof FeatureConfig): Promise<FeatureConfig> {
    const currentFeatures = await this.getFeatures();
    const updatedFeatures = {
      ...currentFeatures,
      [featureName]: !currentFeatures[featureName]
    };
    await this.setFeatures(updatedFeatures);
    return updatedFeatures;
  }

  static async setFeature(featureName: keyof FeatureConfig, enabled: boolean): Promise<FeatureConfig> {
    const currentFeatures = await this.getFeatures();
    const updatedFeatures = {
      ...currentFeatures,
      [featureName]: enabled
    };
    await this.setFeatures(updatedFeatures);
    return updatedFeatures;
  }

  // Lắng nghe thay đổi storage từ popup
  static onFeaturesChanged(callback: (features: FeatureConfig) => void): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync' && changes[this.STORAGE_KEY]) {
        const newFeatures = changes[this.STORAGE_KEY].newValue || this.DEFAULT_FEATURES;
        callback(newFeatures);
      }
    });
  }
}