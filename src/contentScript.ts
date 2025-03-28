console.log('Sozu Wallet content script loaded');

// Import the TwitterIntegration class
import TwitterIntegration from './contentScript/TwitterIntegration';

// Check if we're on Twitter/X
const isTwitter = window.location.hostname.includes('twitter.com') || 
                 window.location.hostname.includes('x.com');

// Only initialize our integration if we're on Twitter/X
if (isTwitter) {
  console.log('Sozu Wallet: Twitter/X detected, initializing integration');
  
  // We need to wait for the DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTwitterIntegration);
  } else {
    initTwitterIntegration();
  }
}

// Function to initialize the Twitter integration
function initTwitterIntegration() {
  try {
    // Create new instance of TwitterIntegration
    new TwitterIntegration();
    console.log('Sozu Wallet: Twitter integration initialized successfully');
  } catch (error) {
    console.error('Sozu Wallet: Error initializing Twitter integration', error);
  }
}

export {}; 