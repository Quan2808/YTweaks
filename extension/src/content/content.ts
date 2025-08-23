import { initPipButton } from './features/pipButton';

interface FeatureConfig {
  pipColorToggle: boolean;
}

function loadFeatures() {
  chrome.storage.sync.get(['features'], (data) => {
    const features: FeatureConfig = data.features || { pipColorToggle: true };

    if (features.pipColorToggle) {
      initPipButton();
    }
    // Thêm các tính năng khác ở đây khi được triển khai
  });
}

loadFeatures();