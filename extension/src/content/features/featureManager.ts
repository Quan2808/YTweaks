
import { FeatureConfig } from '../../shared/types';
import { initPipButton, destroyPipButton } from './pipButton';

export class FeatureManager {
  private currentFeatures: FeatureConfig = { pipColorToggle: false };
  private initialized = false;

  async initialize(features: FeatureConfig): Promise<void> {
    this.currentFeatures = { ...features };
    
    if (!this.initialized) {
      this.applyFeatures();
      this.initialized = true;
    }
  }

  async updateFeatures(newFeatures: FeatureConfig): Promise<void> {
    const previousFeatures = { ...this.currentFeatures };
    this.currentFeatures = { ...newFeatures };

    // So sánh và chỉ cập nhật những tính năng thay đổi
    if (previousFeatures.pipColorToggle !== newFeatures.pipColorToggle) {
      this.handlePipButtonToggle(newFeatures.pipColorToggle);
    }

    // Thêm logic cho các tính năng khác ở đây
  }

  private applyFeatures(): void {
    // Áp dụng tất cả tính năng dựa trên config hiện tại
    if (this.currentFeatures.pipColorToggle) {
      initPipButton();
    }
    
    // Thêm logic khởi tạo các tính năng khác
  }

  private handlePipButtonToggle(enabled: boolean): void {
    if (enabled) {
      initPipButton();
    } else {
      destroyPipButton();
    }
  }

  getFeatures(): FeatureConfig {
    return { ...this.currentFeatures };
  }
}