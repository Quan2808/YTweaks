// YouTube Audio Enhancer Content Script
class YouTubeAudioEnhancer {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.isInitialized = false;
    this.settings = { enabled: true, volume: 1.0 };
    this.observer = null;
    
    this.CONFIG = {
      maxGain: 3.0,
      minGain: 0.1,
      defaultGain: 1.0,
      presetLevels: [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0],
      presetLabels: ['25%', '50%', '75%', 'Normal', '125%', '150%', '175%', '200%', '250%', '300%']
    };

    this.initialize();
    this.setupMessageListener();
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['audioEnhancerEnabled', 'audioEnhancerVolume']);
      this.settings = {
        enabled: result.audioEnhancerEnabled ?? true,
        volume: result.audioEnhancerVolume ?? 1.0
      };
      
      if (this.settings.enabled) {
        this.initializeAudioContext();
      }
    } catch (error) {
      console.warn('Failed to load audio enhancer settings:', error);
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateSettings') {
        this.updateSettings(message.settings);
        sendResponse({ success: true });
      }
      return true;
    });
  }

  updateSettings(newSettings) {
    const wasEnabled = this.settings.enabled;
    this.settings = newSettings;

    if (this.settings.enabled) {
      if (!wasEnabled || !this.isInitialized) {
        this.initializeAudioContext();
      } else {
        this.setVolumeGain(this.settings.volume);
      }
    } else {
      this.cleanup();
    }
  }

  initializeAudioContext() {
    if (!this.settings.enabled) return false;
    if (this.isInitialized) {
      this.setVolumeGain(this.settings.volume);
      return true;
    }

    try {
      const video = document.querySelector('video');
      if (!video) return false;

      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.settings.volume;

      // Create media element source
      const source = this.audioContext.createMediaElementSource(video);

      // Connect: source -> gain -> destination
      source.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      this.isInitialized = true;
      console.log('YouTube Audio Enhancer: Audio context initialized');
      return true;
    } catch (error) {
      console.error('YouTube Audio Enhancer: Failed to initialize audio context:', error);
      return false;
    }
  }

  setVolumeGain(gain) {
    if (!this.settings.enabled) return;
    
    const clampedGain = Math.max(this.CONFIG.minGain, Math.min(this.CONFIG.maxGain, gain));
    this.settings.volume = clampedGain;

    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(clampedGain, this.audioContext.currentTime);
    }
  }

  cleanup() {
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (error) {
        console.warn('Failed to close audio context:', error);
      }
    }
    
    this.audioContext = null;
    this.gainNode = null;
    this.isInitialized = false;
  }

  initialize() {
    // Initialize immediately if video is present
    if (document.querySelector('video')) {
      setTimeout(() => {
        if (this.settings.enabled) {
          this.initializeAudioContext();
        }
      }, 1000);
    }

    // Set up mutation observer for dynamic content
    this.observer = new MutationObserver((mutations) => {
      let videoAdded = false;
      
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (element.tagName === 'VIDEO' || element.querySelector('video')) {
              videoAdded = true;
            }
          }
        });
      });

      if (videoAdded && this.settings.enabled && !this.isInitialized) {
        setTimeout(() => {
          this.initializeAudioContext();
        }, 500);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Handle page navigation (YouTube SPA)
    let lastUrl = location.href;
    const navigationObserver = new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.cleanup();
        
        if (this.settings.enabled) {
          setTimeout(() => {
            this.initializeAudioContext();
          }, 1000);
        }
      }
    });

    navigationObserver.observe(document, { 
      subtree: true, 
      childList: true 
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.settings.enabled && !this.isInitialized) {
        setTimeout(() => {
          this.initializeAudioContext();
        }, 500);
      }
    });

    // Listen for video events
    document.addEventListener('play', (event) => {
      if (event.target instanceof HTMLVideoElement && this.settings.enabled) {
        if (!this.isInitialized) {
          setTimeout(() => {
            this.initializeAudioContext();
          }, 100);
        }
      }
    }, true);
  }

  destroy() {
    this.cleanup();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new YouTubeAudioEnhancer();
  });
} else {
  new YouTubeAudioEnhancer();
}

// Export for potential cleanup
window.youtubeAudioEnhancer = YouTubeAudioEnhancer;