import { INJECTED_CONTAINER_ID, INJECTED_IFRAME_ID } from '../styles/styles';

// Interface for position and size
interface Position {
  top: number;
  left: number;
}

// State for the Wallet UI
interface WalletUIState {
  isInjected: boolean;
  container: HTMLElement | null;
  originalSidebarContent: HTMLElement[];
  hiddenElementsByClass: HTMLElement[];
  overlayElements: HTMLElement[];
  initialPosition: Position | null;
}

// Initial state
const state: WalletUIState = {
  isInjected: false,
  container: null,
  originalSidebarContent: [],
  hiddenElementsByClass: [],
  overlayElements: [],
  initialPosition: null
};

/**
 * Creates the wallet UI container with iframe
 * @returns The created container element
 */
export function createWalletContainer(): HTMLElement {
  const container = document.createElement('div');
  container.id = INJECTED_CONTAINER_ID;
  
  const iframe = document.createElement('iframe');
  iframe.id = INJECTED_IFRAME_ID;
  
  // Get the extension ID for constructing the iframe URL
  const extensionId = chrome.runtime.id;
  iframe.src = `chrome-extension://${extensionId}/src/popup/index.html`;
  
  container.appendChild(iframe);
  return container;
}

/**
 * Injects the wallet UI into the page
 * @returns The injected container or null if injection failed
 */
export function injectWalletUI(): HTMLElement | null {
  // Skip if already injected
  if (state.isInjected && state.container) {
    console.log('Sozu: Wallet UI already injected');
    return state.container;
  }
  
  try {
    // Create and inject the container
    const container = createWalletContainer();
    document.body.appendChild(container);
    
    // Store the container in state
    state.container = container;
    state.isInjected = true;
    
    console.log('Sozu: Wallet UI injected successfully');
    return container;
  } catch (error) {
    console.error('Sozu: Failed to inject wallet UI', error);
    return null;
  }
}

/**
 * Updates the position of the wallet container
 * @param isInitial - Whether this is the initial positioning
 */
export function updateWalletPosition(isInitial: boolean = false): void {
  if (!state.container) {
    return;
  }
  
  // Get the viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate position based on viewport size
  let top = Math.max(70, window.scrollY + 70); // 70px from the top of viewport
  let left = viewportWidth - 365; // 15px margin from right edge
  
  // Store initial position if this is the first positioning
  if (isInitial || !state.initialPosition) {
    state.initialPosition = { top, left };
  } else {
    // Adjust position based on scroll
    top = window.scrollY + state.initialPosition.top - document.documentElement.scrollTop;
  }
  
  // Apply the position
  state.container.style.top = `${top}px`;
  state.container.style.left = `${left}px`;
}

/**
 * Shows the wallet UI with fade-in effect
 */
export function showWalletUI(): void {
  if (!state.container) {
    return;
  }
  
  // Update position before showing
  updateWalletPosition(true);
  
  // Add visible class for fade-in
  setTimeout(() => {
    state.container?.classList.add('visible');
  }, 10);
}

/**
 * Hides the wallet UI with fade-out effect
 */
export function hideWalletUI(): void {
  if (!state.container) {
    return;
  }
  
  // Remove visible class for fade-out
  state.container.classList.remove('visible');
}

/**
 * Removes the wallet UI from the page
 */
export function removeWalletUI(): void {
  // Skip if not injected
  if (!state.isInjected || !state.container) {
    return;
  }
  
  // Remove the container with fade-out
  hideWalletUI();
  
  // After animation completes, remove from DOM
  setTimeout(() => {
    state.container?.remove();
    
    // Reset state
    state.isInjected = false;
    state.container = null;
    state.originalSidebarContent = [];
    state.hiddenElementsByClass = [];
    state.overlayElements = [];
    state.initialPosition = null;
    
    console.log('Sozu: Wallet UI removed');
  }, 500); // Match transition duration
}

/**
 * Toggles the wallet UI visibility
 */
export function toggleWalletUI(): void {
  if (!state.isInjected || !state.container) {
    const container = injectWalletUI();
    if (container) {
      showWalletUI();
    }
  } else {
    if (state.container.classList.contains('visible')) {
      hideWalletUI();
    } else {
      showWalletUI();
    }
  }
} 