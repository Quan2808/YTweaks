import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import Header from './components/Header';
import FeaturesList from './components/FeaturesList';
import Footer from './components/Footer';
import { FeatureConfig, MessageRequest, MessageResponse } from '../shared/types';

const Popup: React.FC = () => {
  const [features, setFeatures] = useState<FeatureConfig>({ 
    pipColorToggle: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Load features from content script on mount
  useEffect(() => {
    loadFeaturesFromContentScript();
  }, []);

  const loadFeaturesFromContentScript = async (): Promise<void> => {
    try {
      setLoading(true);
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tabs[0]?.id) {
        throw new Error('Không tìm thấy tab active');
      }

      // Check if it's a YouTube page
      if (!tabs[0].url?.includes('youtube.com')) {
        throw new Error('Vui lòng mở trang YouTube để sử dụng extension');
      }

      const response = await sendMessageToContentScript(tabs[0].id, { action: 'getFeatures' });
      
      if (response.success && response.features) {
        setFeatures(response.features);
        setSuccess('Đã tải cấu hình thành công');
      } else {
        throw new Error(response.error || 'Không thể tải cấu hình');
      }
    } catch (error) {
      console.error('Failed to load features:', error);
      setError(error instanceof Error ? error.message : 'Lỗi không xác định');
      
      // Fallback to storage if content script fails
      try {
        const result = await chrome.storage.sync.get(['features']);
        const fallbackFeatures = result.features || { pipColorToggle: true };
        setFeatures(fallbackFeatures);
      } catch (storageError) {
        console.error('Storage fallback failed:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToContentScript = (tabId: number, message: MessageRequest): Promise<MessageResponse> => {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(response || { success: false, error: 'No response' });
      });
    });
  };

  const handleFeatureToggle = async (feature: keyof FeatureConfig, enabled: boolean): Promise<void> => {
    try {
      const updatedFeatures = { ...features, [feature]: enabled };
      
      // Update local state immediately for better UX
      setFeatures(updatedFeatures);

      // Get active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]?.id) {
        throw new Error('Không tìm thấy tab active');
      }

      // Send to content script
      const response = await sendMessageToContentScript(tabs[0].id, {
        action: 'updateFeatures',
        features: updatedFeatures
      });

      if (response.success) {
        setSuccess(`Đã ${enabled ? 'bật' : 'tắt'} tính năng`);
        
        // Save to storage as backup
        await chrome.storage.sync.set({ features: updatedFeatures });
      } else {
        throw new Error(response.error || 'Không thể cập nhật tính năng');
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error);
      setError(error instanceof Error ? error.message : 'Không thể cập nhật tính năng');
      
      // Revert local state on error
      loadFeaturesFromContentScript();
    }
  };

  const handleApplyAll = async (): Promise<void> => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]?.id) {
        throw new Error('Không tìm thấy tab active');
      }

      const response = await sendMessageToContentScript(tabs[0].id, {
        action: 'updateFeatures',
        features
      });

      if (response.success) {
        setSuccess('Đã áp dụng tất cả cài đặt');
      } else {
        throw new Error(response.error || 'Không thể áp dụng cài đặt');
      }
    } catch (error) {
      console.error('Failed to apply all settings:', error);
      setError(error instanceof Error ? error.message : 'Không thể áp dụng cài đặt');
    }
  };

  const enabledFeaturesCount = Object.values(features).filter(Boolean).length;

  if (loading) {
    return (
      <Box sx={{ 
        width: 380, 
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#ffffff',
      }}>
        <Box textAlign="center">
          <div>Đang tải...</div>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: 380, 
      bgcolor: '#ffffff',
      fontFamily: '"Roboto", "Arial", sans-serif'
    }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5'
        }}
      >
        <Header enabledFeaturesCount={enabledFeaturesCount} />
        <FeaturesList 
          features={features} 
          onFeatureToggle={handleFeatureToggle} 
        />
        <Footer onApplyAll={handleApplyAll} />
      </Paper>

      {/* Success/Error Notifications */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Popup;