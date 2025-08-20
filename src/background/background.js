// Background script for YouTube Audio Enhancer

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      audioEnhancerEnabled: true,
      audioEnhancerVolume: 1.0
    });
    
    console.log('YouTube Audio Enhancer installed with default settings');
  }
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('youtube.com')) {
    try {
      // Check if content script is already injected
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          return !!window.youtubeAudioEnhancer;
        }
      });

      // If not injected, inject the content script
      if (!results[0]?.result) {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['content.js']
        });
        console.log('Content script injected into YouTube tab');
      }
    } catch (error) {
      console.warn('Failed to inject content script:', error);
    }
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  // Open popup (this is handled automatically by the manifest)
  console.log('Extension icon clicked');
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getSettings':
      chrome.storage.sync.get(['audioEnhancerEnabled', 'audioEnhancerVolume'])
        .then((result) => {
          sendResponse({
            enabled: result.audioEnhancerEnabled ?? true,
            volume: result.audioEnhancerVolume ?? 1.0
          });
        })
        .catch((error) => {
          console.error('Failed to get settings:', error);
          sendResponse({ enabled: true, volume: 1.0 });
        });
      return true;

    case 'updateSettings':
      chrome.storage.sync.set({
        audioEnhancerEnabled: message.settings.enabled,
        audioEnhancerVolume: message.settings.volume
      })
      .then(() => {
        sendResponse({ success: true });
        
        // Notify all YouTube tabs about the setting change
        chrome.tabs.query({ url: '*://www.youtube.com/*' }, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, {
                action: 'updateSettings',
                settings: message.settings
              }).catch(() => {
                // Ignore errors for tabs that don't have the content script
              });
            }
          });
        });
      })
      .catch((error) => {
        console.error('Failed to update settings:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true;

    default:
      console.warn('Unknown message action:', message.action);
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    console.log('Audio enhancer settings changed:', changes);
  }
});

// Keep service worker alive
const keepAlive = () => {
  setTimeout(keepAlive, 20000); // 20 seconds
};
keepAlive();

console.log('YouTube Audio Enhancer background script loaded');