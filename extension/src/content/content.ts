import { FeatureConfig, MessageRequest, MessageResponse } from '../shared/types';
import { StorageManager } from '../shared/storageManager';
import { FeatureManager } from './features/featureManager';

class YouTubeEnhancer {
  private featureManager: FeatureManager;
  private isInitialized = false;

  constructor() {
    this.featureManager = new FeatureManager();
    this.init();
  }

  private async init(): Promise<void> {
    try {
      console.log('YouTube Enhancer: Initializing...');
      
      // Load initial features from storage
      const features = await StorageManager.getFeatures();
      await this.featureManager.initialize(features);
      
      // Listen for storage changes from popup
      StorageManager.onFeaturesChanged((newFeatures) => {
        console.log('YouTube Enhancer: Features changed:', newFeatures);
        this.featureManager.updateFeatures(newFeatures);
      });

      // Setup message listener for popup communication
      this.setupMessageListener();
      
      this.isInitialized = true;
      console.log('YouTube Enhancer: Initialized successfully');
    } catch (error) {
      console.error('YouTube Enhancer: Failed to initialize:', error);
    }
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener(
      (request: MessageRequest, sender, sendResponse: (response: MessageResponse) => void) => {
        this.handleMessage(request)
          .then(response => sendResponse(response))
          .catch(error => {
            console.error('YouTube Enhancer: Message handling error:', error);
            sendResponse({ success: false, error: error.message });
          });
        
        // Return true to indicate we will respond asynchronously
        return true;
      }
    );
  }

  private async handleMessage(request: MessageRequest): Promise<MessageResponse> {
    switch (request.action) {
      case 'getFeatures':
        const currentFeatures = this.featureManager.getFeatures();
        return { success: true, features: currentFeatures };

      case 'updateFeatures':
        if (!request.features) {
          throw new Error('Features not provided');
        }
        await StorageManager.setFeatures(request.features);
        await this.featureManager.updateFeatures(request.features);
        return { success: true, features: request.features };

      case 'toggleFeature':
        if (!request.featureName) {
          throw new Error('Feature name not provided');
        }
        const updatedFeatures = await StorageManager.toggleFeature(request.featureName);
        await this.featureManager.updateFeatures(updatedFeatures);
        return { success: true, features: updatedFeatures };

      default:
        throw new Error(`Unknown action: ${request.action}`);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new YouTubeEnhancer());
} else {
  new YouTubeEnhancer();
}

// Also initialize on navigation for SPAs
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log('YouTube Enhancer: Page navigation detected');
    // Re-initialize on navigation
    setTimeout(() => new YouTubeEnhancer(), 1000);
  }
}).observe(document, { subtree: true, childList: true });