import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Material Web Components
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/switch/switch.js';
import '@material/web/slider/slider.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/divider/divider.js';

const PRESET_LEVELS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
const PRESET_LABELS = ['25%', '50%', '75%', 'Normal', '125%', '150%', '175%', '200%', '250%', '300%'];

const Popup = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    volume: 1.0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['audioEnhancerEnabled', 'audioEnhancerVolume'], (result) => {
      setSettings({
        enabled: result.audioEnhancerEnabled ?? true,
        volume: result.audioEnhancerVolume ?? 1.0
      });
      setIsLoading(false);
    });
  }, []);

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // Save to storage
    chrome.storage.sync.set({
      audioEnhancerEnabled: updatedSettings.enabled,
      audioEnhancerVolume: updatedSettings.volume
    });

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSettings',
          settings: updatedSettings
        });
      }
    });
  };

  const handleToggle = () => {
    updateSettings({ enabled: !settings.enabled });
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    updateSettings({ volume: newVolume });
  };

  const handlePresetClick = (level) => {
    updateSettings({ volume: level });
  };

  const getCurrentVolumeLabel = () => {
    const closestIndex = PRESET_LEVELS.reduce((prev, curr, index) => {
      return Math.abs(curr - settings.volume) < Math.abs(PRESET_LEVELS[prev] - settings.volume) ? index : prev;
    }, 0);

    if (Math.abs(PRESET_LEVELS[closestIndex] - settings.volume) < 0.01) {
      return PRESET_LABELS[closestIndex];
    }

    return Math.round(settings.volume * 100) + '%';
  };

  const getVolumeIcon = () => {
    if (!settings.enabled) return 'volume_off';
    if (settings.volume < 0.5) return 'volume_down';
    if (settings.volume > 2.0) return 'volume_up';
    return 'volume_up';
  };

  const getStatusColor = () => {
    if (!settings.enabled) return '#666666';
    if (settings.volume > 2.0) return '#ff6b6b';
    if (settings.volume > 1.5) return '#ffa726';
    return '#4caf50';
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        background: '#0f0f0f',
        color: '#ffffff',
        width: '320px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <md-icon style={{ fontSize: '32px', color: '#cc0000', marginBottom: '12px' }}>
            volume_up
          </md-icon>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '16px', 
      background: '#0f0f0f', 
      color: '#ffffff',
      width: '320px',
      minHeight: '420px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '8px 0'
      }}>
        <md-icon style={{ 
          marginRight: '12px', 
          color: '#cc0000',
          fontSize: '28px'
        }}>
          {getVolumeIcon()}
        </md-icon>
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '500',
            color: '#ffffff'
          }}>
            YouTube Audio Enhancer
          </h2>
          <div style={{ 
            fontSize: '12px', 
            color: getStatusColor(),
            marginTop: '2px',
            fontWeight: '500'
          }}>
            {settings.enabled ? `Active • ${getCurrentVolumeLabel()}` : 'Disabled'}
          </div>
        </div>
      </div>

      {/* Enable/Disable Toggle */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '24px',
        padding: '16px',
        background: '#1a1a1a',
        borderRadius: '12px',
        border: `1px solid ${settings.enabled ? '#cc000040' : '#3f3f3f'}`
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>
            Enable Audio Enhancer
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: settings.enabled ? '#4caf50' : '#999999', 
            marginTop: '4px' 
          }}>
            {settings.enabled ? 'Enhancement active on this tab' : 'Click to enable volume boost'}
          </div>
        </div>
        <md-switch 
          selected={settings.enabled}
          onClick={handleToggle}
          style={{
            '--md-switch-selected-track-color': '#cc0000',
            '--md-switch-selected-handle-color': '#ffffff'
          }}
        />
      </div>

      {settings.enabled && (
        <>
          {/* Volume Control */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Volume Level</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <md-icon style={{ 
                  fontSize: '16px', 
                  color: getStatusColor() 
                }}>
                  {getVolumeIcon()}
                </md-icon>
                <span style={{ 
                  fontSize: '14px', 
                  color: getStatusColor(), 
                  fontWeight: '600',
                  background: settings.volume > 2.0 ? '#ff6b6b20' : '#4caf5020',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${getStatusColor()}40`
                }}>
                  {getCurrentVolumeLabel()}
                </span>
              </div>
            </div>
            
            <md-slider
              min="0.1"
              max="3.0"
              step="0.05"
              value={settings.volume}
              onInput={handleVolumeChange}
              style={{ 
                width: '100%',
                '--md-slider-active-track-color': getStatusColor(),
                '--md-slider-handle-color': getStatusColor(),
                '--md-slider-inactive-track-color': '#3f3f3f'
              }}
            />
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '11px',
              color: '#999999'
            }}>
              <span>🔇 10%</span>
              <span>Normal</span>
              <span>🔊 300%</span>
            </div>

            {/* Warning for high volumes */}
            {settings.volume > 2.0 && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: '#ff6b6b15',
                border: '1px solid #ff6b6b40',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#ff6b6b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <md-icon style={{ fontSize: '16px' }}>warning</md-icon>
                High volume - protect your hearing
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              marginBottom: '12px',
              color: '#ffffff'
            }}>
              Quick Presets
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}>
              {PRESET_LEVELS.slice(0, 8).map((level, index) => {
                const isSelected = Math.abs(level - settings.volume) < 0.01;
                const isNormal = level === 1.0;
                return (
                  <md-outlined-button
                    key={level}
                    onClick={() => handlePresetClick(level)}
                    style={{
                      fontSize: '11px',
                      minWidth: '0',
                      height: '36px',
                      '--md-outlined-button-outline-color': isSelected ? '#cc0000' : (isNormal ? '#4caf50' : '#3f3f3f'),
                      '--md-outlined-button-label-text-color': isSelected ? '#cc0000' : (isNormal ? '#4caf50' : '#ffffff'),
                      background: isSelected ? '#cc000010' : (isNormal ? '#4caf5010' : 'transparent')
                    }}
                  >
                    {PRESET_LABELS[index]}
                  </md-outlined-button>
                );
              })}
            </div>
          </div>

          {/* Extreme Presets */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <md-icon style={{ fontSize: '16px', color: '#ff6b6b' }}>bolt</md-icon>
              <span style={{ color: '#ffffff' }}>Extreme Boost</span>
              <md-icon style={{ fontSize: '14px', color: '#ffa726' }}>warning</md-icon>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {PRESET_LEVELS.slice(8).map((level, index) => {
                const isSelected = Math.abs(level - settings.volume) < 0.01;
                return (
                  <md-outlined-button
                    key={level}
                    onClick={() => handlePresetClick(level)}
                    style={{
                      fontSize: '11px',
                      flex: 1,
                      height: '40px',
                      '--md-outlined-button-outline-color': isSelected ? '#ff6b6b' : '#ff6b6b60',
                      '--md-outlined-button-label-text-color': isSelected ? '#ff6b6b' : '#ff6b6b',
                      background: isSelected ? '#ff6b6b15' : '#ff6b6b08'
                    }}
                  >
                    {PRESET_LABELS[index + 8]}
                  </md-outlined-button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <md-divider style={{ margin: '20px -16px 16px -16px' }} />
      
      <div style={{ 
        textAlign: 'center',
        fontSize: '11px',
        color: '#666666'
      }}>
        <div style={{ marginBottom: '4px' }}>
          <strong style={{ color: '#cc0000' }}>YouTube Audio Enhancer</strong> v1.0.0
        </div>
        <div>
          Professional volume control for YouTube videos
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px' }}>
          🎧 Always use at safe volume levels
        </div>
      </div>
    </div>
  );
};

// Mount the React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}