/// <reference types="chrome"/>

/**
 * Twitter UI Injection Script
 * This script injects the SozuCash wallet UI into the Twitter/X.com interface
 */

console.log('SozuCash Twitter injection loaded');

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ParticleBackground } from './components/ParticleBackground';

// Transaction interface
interface Transaction {
  type: string;
  amount: string | number;
  date: string | number;
}

// Mock wallet data for demo purposes
const mockWalletData = {
  success: true,
  balance: '4,560.28',
  address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  transactions: [
    {
      type: 'Received',
      amount: '120.00',
      date: Date.now() - 86400000, // 1 day ago
    },
    {
      type: 'Sent',
      amount: '75.50',
      date: Date.now() - 172800000, // 2 days ago
    },
    {
      type: 'Received',
      amount: '340.00',
      date: Date.now() - 345600000, // 4 days ago
    }
  ]
};

// Helper to wait for an element to appear in the DOM
const waitForElement = (selector: string, timeout = 10000): Promise<Element | null> => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Set a timeout to avoid hanging indefinitely
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
};

// Inject the SozuCash wallet button in the Twitter sidebar
const injectSidebarButton = async () => {
  // Wait for the Twitter sidebar navigation to load
  const sidebarNav = await waitForElement('nav[aria-label="Primary"]');
  
  if (!sidebarNav) {
    console.error('Could not find Twitter sidebar navigation');
    return;
  }
  
  // Create our button element
  const sozuButton = document.createElement('a');
  sozuButton.className = 'sozucash-sidebar-button';
  sozuButton.setAttribute('role', 'link');
  sozuButton.setAttribute('data-testid', 'sozucash-button');
  sozuButton.style.display = 'flex';
  sozuButton.style.alignItems = 'center';
  sozuButton.style.padding = '12px';
  sozuButton.style.borderRadius = '9999px';
  sozuButton.style.margin = '4px 0';
  sozuButton.style.cursor = 'pointer';
  
  sozuButton.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; min-width: 26px; min-height: 26px; margin-right: 12px;">
      <img src="${chrome.runtime.getURL('assets/icons/mantle-mnt-logo.svg')}" alt="SozuCash" width="26" height="26" />
    </div>
    <span style="font-weight: bold; font-size: 20px;">SozuCash</span>
  `;
  
  // Add hover effect
  sozuButton.addEventListener('mouseover', () => {
    sozuButton.style.backgroundColor = 'rgba(29, 161, 242, 0.1)';
  });
  
  sozuButton.addEventListener('mouseout', () => {
    sozuButton.style.backgroundColor = 'transparent';
  });
  
  // Add click event to show wallet UI
  sozuButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWalletUI();
  });
  
  // Find a good place to insert our button (before the last item which is usually Profile)
  const navItems = sidebarNav.querySelectorAll('a[role="link"]');
  if (navItems.length > 0) {
    const lastItem = navItems[navItems.length - 1];
    lastItem.parentNode?.insertBefore(sozuButton, lastItem);
  } else {
    // Fallback - append to the nav
    sidebarNav.appendChild(sozuButton);
  }
};

// Create and toggle the wallet UI panel
const toggleWalletUI = async () => {
  // Remove existing wallet UI if it exists
  const existingUI = document.querySelector('.sozucash-wallet-ui');
  if (existingUI) {
    existingUI.remove();
    return;
  }
  
  // Find the right sidebar to replace
  const rightSidebar = await waitForElement('[data-testid="sidebarColumn"]');
  if (!rightSidebar) {
    console.error('Could not find Twitter right sidebar');
    return;
  }
  
  // Create wallet UI container
  const walletUI = document.createElement('div');
  walletUI.className = 'sozucash-wallet-ui';
  walletUI.style.cssText = `
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 12px;
    max-height: 80vh;
    overflow: auto;
    position: relative;
    color: #333;
    animation: fadeIn 0.3s ease-in-out;
  `;
  
  // Add animation styles
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .sozucash-wallet-ui .token-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: 12px;
      background: #f9f9f9;
      margin-bottom: 8px;
      transition: all 0.2s ease;
    }
    
    .sozucash-wallet-ui .token-item:hover {
      background: #f0f0f0;
      transform: translateY(-2px);
    }
    
    .sozucash-tab-container {
      display: flex;
      border-bottom: 1px solid #eee;
      margin-bottom: 16px;
    }
    
    .sozucash-tab {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      font-weight: 500;
    }
    
    .sozucash-tab.active {
      border-bottom-color: #8A2BE2;
      color: #8A2BE2;
    }
    
    .sozucash-tab-content {
      display: none;
    }
    
    .sozucash-tab-content.active {
      display: block;
      animation: fadeIn 0.3s ease;
    }
  `;
  document.head.appendChild(styleEl);
  
  // Request wallet data from background script (using mock data for now)
  // In production, use: chrome.runtime.sendMessage({ type: 'GET_WALLET_DATA' }, (response) => {
  const renderWalletUI = (response = mockWalletData) => {
    if (response && response.success) {
      // Create the main container
      const container = document.createElement('div');
      container.className = 'sozucash-wallet-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      `;

      // Create the particle background container
      const particleBackground = document.createElement('div');
      particleBackground.id = 'sozucash-particle-background';
      particleBackground.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      `;
      container.appendChild(particleBackground);

      // Mount the React component
      const root = createRoot(particleBackground);
      root.render(React.createElement(ParticleBackground));

      // Create the wallet UI
      const walletUI = document.createElement('div');
      walletUI.className = 'sozucash-wallet-ui';
      walletUI.style.cssText = `
        background-color: white;
        border-radius: 16px;
        padding: 24px;
        width: 400px;
        max-width: 90%;
        position: relative;
        z-index: 1;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;
      
      // Create wallet UI with the data
      walletUI.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 20px; font-weight: bold; margin: 0;">SozuCash Wallet</h2>
          <button id="sozucash-close" style="background: none; border: none; cursor: pointer; font-size: 18px;">✕</button>
        </div>
        
        <div class="sozucash-tab-container">
          <div class="sozucash-tab active" data-tab="wallet">Wallet</div>
          <div class="sozucash-tab" data-tab="activity">Activity</div>
          <div class="sozucash-tab" data-tab="nfts">NFTs</div>
        </div>
        
        <div class="sozucash-tab-content active" data-tab-content="wallet">
          <div style="text-align: center; margin: 24px 0;">
            <div style="font-size: 40px; font-weight: bold; margin-bottom: 8px; background: linear-gradient(135deg, #8A2BE2, #4B0082); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${response.balance} MNT
            </div>
            <div style="font-size: 14px; color: #666; word-break: break-all; margin-bottom: 8px;">
              ${response.address}
            </div>
            <button id="copy-address" style="background: none; border: none; color: #8A2BE2; cursor: pointer; font-size: 14px;">
              Copy Address
            </button>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin: 24px 0;">
            <button id="sozucash-send" style="background-color: #8A2BE2; color: white; border: none; border-radius: 9999px; padding: 10px 0; font-weight: bold; cursor: pointer; flex: 1; margin-right: 8px; transition: all 0.2s ease;">Send</button>
            <button id="sozucash-receive" style="background-color: white; color: #8A2BE2; border: 1px solid #8A2BE2; border-radius: 9999px; padding: 10px 0; font-weight: bold; cursor: pointer; flex: 1; margin-left: 8px; transition: all 0.2s ease;">Receive</button>
          </div>
          
          <div style="margin-top: 24px;">
            <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">Your Tokens</h3>
            <div class="token-list">
              <div class="token-item">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="${chrome.runtime.getURL('assets/icons/mantle-mnt-logo.svg')}" width="32" height="32" />
                  <div>
                    <div style="font-weight: 500;">Mantle</div>
                    <div style="font-size: 12px; color: #666;">MNT</div>
                  </div>
                </div>
                <div style="font-weight: 500;">${response.balance}</div>
              </div>
              <div class="token-item">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 32px; height: 32px; background: #627EEA; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">ETH</div>
                  <div>
                    <div style="font-weight: 500;">Ethereum</div>
                    <div style="font-size: 12px; color: #666;">ETH</div>
                  </div>
                </div>
                <div style="font-weight: 500;">0.25</div>
              </div>
              <div class="token-item">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 32px; height: 32px; background: #8247E5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">MATIC</div>
                  <div>
                    <div style="font-weight: 500;">Polygon</div>
                    <div style="font-size: 12px; color: #666;">MATIC</div>
                  </div>
                </div>
                <div style="font-weight: 500;">345.75</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sozucash-tab-content" data-tab-content="activity">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">Recent Transactions</h3>
          <div>
            ${
              response.transactions && response.transactions.length > 0 
                ? response.transactions.map((tx: Transaction) => `
                    <div style="padding: 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                      <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div style="width: 28px; height: 28px; border-radius: 50%; background: ${tx.type === 'Received' ? '#e6f7ee' : '#ffebee'}; display: flex; align-items: center; justify-content: center;">
                            <span style="color: ${tx.type === 'Received' ? '#0a8a4a' : '#d32f2f'}; font-size: 14px;">
                              ${tx.type === 'Received' ? '↓' : '↑'}
                            </span>
                          </div>
                          <div>
                            <div style="font-weight: 500;">${tx.type}</div>
                            <div style="font-size: 12px; color: #666; margin-top: 4px;">
                              ${new Date(tx.date).toLocaleDateString()} at ${new Date(tx.date).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div style="font-weight: 500; text-align: right;">${tx.amount} MNT</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px; text-align: right;">
                          ~$${(parseFloat(tx.amount as string) * 0.85).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  `).join('')
                : '<div style="text-align: center; color: #666; padding: 32px 0;">No transactions yet</div>'
            }
          </div>
          <div style="margin-top: 24px; text-align: center;">
            <button style="background: none; border: 1px solid #8A2BE2; color: #8A2BE2; border-radius: 9999px; padding: 10px 24px; font-weight: 500; cursor: pointer;">View all transactions</button>
          </div>
        </div>
        
        <div class="sozucash-tab-content" data-tab-content="nfts">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">Your NFTs</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px;">
            <div style="border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
              <img src="https://via.placeholder.com/150" width="100%" style="display: block;" />
              <div style="padding: 12px;">
                <div style="font-weight: 500;">Mantle Monsters #436</div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">Monster Collection</div>
              </div>
            </div>
            <div style="border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
              <img src="https://via.placeholder.com/150" width="100%" style="display: block;" />
              <div style="padding: 12px;">
                <div style="font-weight: 500;">SozuCash OG Pass</div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">Membership</div>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <button style="background: none; border: 1px solid #8A2BE2; color: #8A2BE2; border-radius: 9999px; padding: 10px 24px; font-weight: 500; cursor: pointer;">Mint an NFT</button>
          </div>
        </div>
      `;
    } else {
      // Show login UI if not connected
      walletUI.innerHTML = `
        <div style="text-align: center; padding: 32px 0;">
          <img src="${chrome.runtime.getURL('assets/icons/mantle-mnt-logo.svg')}" alt="SozuCash" width="64" height="64" style="margin-bottom: 16px;" />
          <h2 style="font-size: 22px; font-weight: bold; margin-bottom: 16px;">Connect your wallet</h2>
          <p style="color: #666; margin-bottom: 24px; line-height: 1.5;">Sign in with your Twitter account to access your SozuCash wallet and manage your crypto assets.</p>
          <button id="sozucash-connect" style="background-color: #8A2BE2; color: white; border: none; border-radius: 9999px; padding: 12px 32px; font-weight: bold; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; margin: 0 auto;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 5.8c-.7.3-1.5.5-2.4.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.8-4.1 4 0 .3 0 .6.1.9-3.4-.2-6.5-1.8-8.5-4.2-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.6 1.8 3.3-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.8-5.1 1.8-.3 0-.7 0-1-.1 1.8 1.2 4 1.8 6.3 1.8 7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" fill="currentColor"/>
            </svg>
            Connect with X
          </button>
        </div>
      `;
    }
    
    // Replace the "What's happening" section with our wallet UI
    const whatshappening = rightSidebar.querySelector('[aria-label="Timeline: Trending now"]');
    if (whatshappening) {
      whatshappening.parentNode?.replaceChild(walletUI, whatshappening);
    } else {
      // Fallback - just append to the sidebar
      rightSidebar.prepend(walletUI);
    }
    
    // Add event listeners
    document.getElementById('sozucash-close')?.addEventListener('click', () => {
      walletUI.remove();
    });
    
    document.getElementById('sozucash-connect')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'CONNECT_TWITTER' });
    });
    
    document.getElementById('sozucash-send')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'OPEN_SEND_DIALOG' });
    });
    
    document.getElementById('sozucash-receive')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'OPEN_RECEIVE_DIALOG' });
    });
    
    document.getElementById('copy-address')?.addEventListener('click', () => {
      navigator.clipboard.writeText(response.address);
      showToast('Address copied to clipboard!');
    });
    
    // Add tab switching functionality
    const tabs = document.querySelectorAll('.sozucash-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Get the tab name
        const tabName = (tab as HTMLElement).dataset.tab;
        
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Hide all tab content
        const tabContents = document.querySelectorAll('.sozucash-tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show selected tab content
        const activeContent = document.querySelector(`.sozucash-tab-content[data-tab-content="${tabName}"]`);
        if (activeContent) activeContent.classList.add('active');
      });
    });
  };
  
  renderWalletUI();
};

// Function to show toast message
const showToast = (message: string) => {
  // Create toast element
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    animation: fadeInOut 3s ease-in-out forwards;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, 20px); }
      15% { opacity: 1; transform: translate(-50%, 0); }
      85% { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, -20px); }
    }
  `;
  document.head.appendChild(style);
  
  // Add to body
  document.body.appendChild(toast);
  
  // Remove after animation
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_TWITTER_INJECTION') {
    sendResponse({ success: true, status: 'Twitter injection is active' });
  }
  return true;
});

// Initialize by injecting the button when the page loads
const init = () => {
  // Only run on Twitter/X domains
  if (window.location.hostname.includes('twitter.com') || window.location.hostname.includes('x.com')) {
    console.log('Initializing SozuCash Twitter injection');
    injectSidebarButton();
  }
};

// Start the injection process
init();

export {}; 