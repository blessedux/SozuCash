import { walletIconPath } from '../styles/styles';

/**
 * Creates a wallet button element for the Twitter sidebar
 * @returns HTMLElement for the wallet button
 */
export function createWalletButton(): HTMLElement {
  const button = document.createElement('a');
  button.className = 'sozu-wallet-button';
  button.href = '#';
  button.setAttribute('aria-label', 'SozuCash Wallet');
  
  const iconContainer = document.createElement('div');
  iconContainer.className = 'sozu-wallet-icon';
  
  // Create SVG icon
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', walletIconPath);
  svg.appendChild(path);
  
  iconContainer.appendChild(svg);
  button.appendChild(iconContainer);
  
  // Add text label
  const textSpan = document.createElement('span');
  textSpan.className = 'sozu-wallet-text';
  textSpan.textContent = 'Wallet';
  button.appendChild(textSpan);
  
  return button;
}

/**
 * Handle the wallet button click event
 * @param toggleWalletUI - Function to toggle the wallet UI visibility
 * @returns Event handler function
 */
export function createWalletButtonHandler(toggleWalletUI: () => void): (event: Event) => void {
  return (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Toggle active state
    const button = event.currentTarget as HTMLElement;
    button.classList.toggle('active');
    
    // Toggle wallet UI
    toggleWalletUI();
  };
} 