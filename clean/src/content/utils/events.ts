import { updateWalletPosition } from '../components/WalletUI';

// Timeout IDs for debouncing
let resizeTimeoutId: number | null = null;
let scrollTimeoutId: number | null = null;

/**
 * Handles window resize events with debouncing
 */
export function handleResize() {
  // Clear any existing timeout
  if (resizeTimeoutId !== null) {
    window.clearTimeout(resizeTimeoutId);
  }
  
  // Debounce resize event (150ms)
  resizeTimeoutId = window.setTimeout(() => {
    updateWalletPosition(true);
    resizeTimeoutId = null;
  }, 150);
}

/**
 * Handles window scroll events with debouncing
 */
export function handleScroll() {
  // Clear any existing timeout
  if (scrollTimeoutId !== null) {
    window.clearTimeout(scrollTimeoutId);
  }
  
  // Debounce scroll event (50ms)
  scrollTimeoutId = window.setTimeout(() => {
    updateWalletPosition(false);
    scrollTimeoutId = null;
  }, 50);
}

/**
 * Handles OAuth message events from the wallet iframe
 * @param event - The message event
 */
export function handleOAuthMessage(event: MessageEvent) {
  // Verify the event origin is from our extension
  if (!event.origin.startsWith('chrome-extension://')) {
    return;
  }
  
  // Handle different message types
  if (event.data && typeof event.data === 'object') {
    if (event.data.type === 'OAUTH_START') {
      // Initiate OAuth flow
      console.log('Sozu: OAuth flow initiated');
      chrome.runtime.sendMessage({ type: 'TWITTER_OAUTH_START' });
    } else if (event.data.type === 'CLOSE_WALLET') {
      // Close wallet UI
      console.log('Sozu: Close wallet requested');
      // You would call removeWalletUI() or hideWalletUI() here
    }
  }
}

/**
 * Sets up all event listeners
 * @param setupFn - Optional callback after setup is complete
 */
export function setupEventListeners(setupFn?: () => void): void {
  // Window resize event
  window.addEventListener('resize', handleResize);
  
  // Window scroll event
  window.addEventListener('scroll', handleScroll);
  
  // Message event for communication with iframe
  window.addEventListener('message', handleOAuthMessage);
  
  if (setupFn) {
    setupFn();
  }
}

/**
 * Removes all event listeners
 */
export function removeEventListeners(): void {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('message', handleOAuthMessage);
} 