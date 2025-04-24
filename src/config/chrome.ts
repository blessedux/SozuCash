/// <reference types="chrome"/>

// Simplified Chrome extension config
export const ChromeConfig = {
  name: 'SozuCash Wallet',
  version: '1.0.0',
  description: 'SozuCash Wallet Chrome Extension',
  action: {
    default_popup: 'popup.html'
  },
  permissions: ['storage', 'identity'],
  web_accessible_resources: [
    'popup.html', 
    'oauth-callback.html'
  ]
};

export default ChromeConfig; 