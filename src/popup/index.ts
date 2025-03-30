/// <reference types="chrome"/>

console.log('Popup script loaded')

import '../utils/polyfills';
import type { Wallet } from '../types/auth';

// Screen management
type Screen = 'login' | 'home' | 'settings' | 'send' | 'receive' | 'nfts' | 'poaps';

// Define wallet data structure
interface WalletData {
  id: string;
  name: string;
  balance: number;
  usdBalance: string;
  borderColor: string;
  tokens: {
    name: string;
    symbol: string;
    amount: number;
    value: string;
    icon: string;
  }[];
}

class WalletApp {
  private mainContent: HTMLElement | null = null;
  private assetUrl = (path: string) => chrome.runtime.getURL(`assets/${path}`);
  private currentWalletIndex = 0;
  
  // Sample wallet data
  private wallets: WalletData[] = [
    {
      id: 'wallet1',
      name: 'Main Wallet',
      balance: 1234.56,
      usdBalance: '$345.67',
      borderColor: 'rgba(124, 58, 237, 0.5)',  // Purple
      tokens: [
        {
          name: 'Mantle',
          symbol: 'MNT',
          amount: 123.45,
          value: '$345.67',
          icon: 'mnt-logo.svg'
        }
      ]
    },
    {
      id: 'wallet2',
      name: 'DeFi Wallet',
      balance: 567.89,
      usdBalance: '$159.01',
      borderColor: 'rgba(59, 130, 246, 0.5)',  // Blue
      tokens: [
        {
          name: 'Mantle',
          symbol: 'MNT',
          amount: 567.89,
          value: '$159.01',
          icon: 'mnt-logo.svg'
        }
      ]
    },
    {
      id: 'wallet3',
      name: 'NFT Wallet',
      balance: 42.00,
      usdBalance: '$11.76',
      borderColor: 'rgba(236, 72, 153, 0.5)',  // Pink
      tokens: [
        {
          name: 'Mantle',
          symbol: 'MNT',
          amount: 42.00,
          value: '$11.76',
          icon: 'mnt-logo.svg'
        }
      ]
    }
  ];

  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.mainContent = document.getElementById('mainContent');
      if (this.mainContent) {
        this.showLoginScreen();
        this.initLoginHandler();
        this.setupGlobalEventListeners();
      }
    });
  }

  private setupGlobalEventListeners() {
    // Global click event listener for debugging
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      console.log('Clicked element:', target.tagName, target.id, target.className);
    });
    
    // Add touch/swipe event listeners for wallet switching
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, false);
    
    // Add keyboard navigation for testing
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.switchWallet(this.currentWalletIndex - 1);
      } else if (e.key === 'ArrowRight') {
        this.switchWallet(this.currentWalletIndex + 1);
      }
    });
  }
  
  private handleSwipe(startX: number, endX: number) {
    const threshold = 50; // Minimum distance to be considered a swipe
    
    if (endX < startX - threshold) {
      // Swipe left - next wallet
      this.switchWallet(this.currentWalletIndex + 1);
    } else if (endX > startX + threshold) {
      // Swipe right - previous wallet
      this.switchWallet(this.currentWalletIndex - 1);
    }
  }
  
  private switchWallet(index: number) {
    // Ensure index is within bounds (circular)
    if (index < 0) {
      index = this.wallets.length - 1;
    } else if (index >= this.wallets.length) {
      index = 0;
    }
    
    if (index !== this.currentWalletIndex) {
      this.currentWalletIndex = index;
      this.showDashboard();
    }
  }

  private showLoginScreen() {
    if (!this.mainContent) return;
    
    const logoUrl = chrome.runtime.getURL('assets/sozu-logo.svg');
    console.log('Logo URL full path:', logoUrl);
    
    this.mainContent.innerHTML = `
      <div class="login-container">
        <div class="brand-section">
          <!-- Use a div with background image for the logo -->
          <div 
            class="brand-logo"
            style="
              width: 160px; 
              height: 80px; /* Adjust height based on logo aspect ratio */
              margin-bottom: 20px; 
              background-image: url(${logoUrl}); 
              background-size: contain; 
              background-repeat: no-repeat; 
              background-position: center;
              filter: drop-shadow(0 0 20px rgba(138, 43, 226, 0.3));
            "
          ></div>
          
          <!-- REMOVED Fallback text logo -->
          
        </div>
        <button class="twitter-login" id="loginButton">
          <span class="button-text">Connect with X</span>
        </button>
      </div>
    `;
  }

  private initLoginHandler() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        console.log('Login button clicked');
        this.showDashboard();
      });
    }
  }

  private showDashboard() {
    if (!this.mainContent) return;
    console.log('Showing dashboard for wallet:', this.currentWalletIndex);
    
    const currentWallet = this.wallets[this.currentWalletIndex];
    
    this.mainContent.innerHTML = `
      <div class="dashboard-container">
        <div class="glass-panel">
          <!-- Wallet Card with custom border glow -->
          <div class="glass-card balance-card" style="box-shadow: 0 0 15px ${currentWallet.borderColor}; border: 1px solid ${currentWallet.borderColor};">
            <div class="wallet-name" style="text-align: left; font-size: 14px; opacity: 0.7; margin-bottom: 8px;">
              ${currentWallet.name}
            </div>
            <div class="balance-section">
              <div class="balance-header">
                <span class="balance-label">Total Balance</span>
                <div id="networkSelect" class="network-select" style="cursor: pointer;">
                  <img src="${this.assetUrl('mnt-logo.svg')}" alt="MNT" class="network-icon"/>
                  <span>MNT</span>
                </div>
              </div>
              <h2 class="balance-amount" style="color: white; font-size: 42px; -webkit-text-fill-color: white; background: none;">${currentWallet.balance.toFixed(2)}</h2>
              <span class="balance-usd">≈ ${currentWallet.usdBalance}</span>
            </div>
            <div class="action-buttons">
              <button id="sendButton" class="action-btn send" style="background: #121212; color: white; border: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 16V4M10 4L16 10M10 4L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Send
              </button>
              <button id="depositButton" class="action-btn deposit" style="background: #121212; color: white; border: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M10 16L16 10M10 16L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Deposit
              </button>
            </div>
            
            <!-- Wallet indicator dots -->
            <div class="wallet-dots" style="display: flex; justify-content: center; margin-top: 16px; gap: 8px;">
              ${this.wallets.map((_, i) => `
                <div class="wallet-dot" style="
                  width: 8px; 
                  height: 8px; 
                  border-radius: 50%; 
                  background-color: ${i === this.currentWalletIndex ? 'white' : 'rgba(255, 255, 255, 0.3)'};
                  transition: background-color 0.3s;
                "></div>
              `).join('')}
            </div>
          </div>

          <div class="glass-card tokens-card mx-auto max-w-[280px] w-full">
            <h3>Your Tokens</h3>
            <div class="token-list">
              ${currentWallet.tokens.map(token => `
                <div class="token-item">
                  <div class="token-info">
                    <img src="${this.assetUrl(token.icon)}" alt="${token.symbol}" class="token-icon"/>
                    <div class="token-details">
                      <span class="token-name">${token.name}</span>
                      <span class="token-amount">${token.amount.toFixed(2)} ${token.symbol}</span>
                    </div>
                  </div>
                  <span class="token-value">${token.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    console.log('Attaching dashboard event handlers...');
    
    // Add click handlers for the buttons - CRITICAL FIX HERE
    document.getElementById('sendButton')?.addEventListener('click', () => {
      console.log('Send button clicked!');
      this.showSendScreen();
    });
    
    document.getElementById('depositButton')?.addEventListener('click', () => {
      console.log('Deposit button clicked!');
      this.showDepositScreen();
    });
    
    // Network select dropdown
    document.getElementById('networkSelect')?.addEventListener('click', () => {
      console.log('Network selector clicked');
      this.showNetworkDropdown();
    });
    
    // Add click on wallet dots for direct navigation
    const walletDots = document.querySelectorAll('.wallet-dot');
    walletDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.switchWallet(index);
      });
    });
  }

  private showError(message: string) {
    if (!this.mainContent) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const existingError = this.mainContent.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    this.mainContent.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  private showWallet(currentWallet: Wallet) {
    if (!this.mainContent) return;

    this.mainContent.innerHTML = `
      <div class="wallet-container">
        <div class="wallet-header">
          <div class="user-profile">
            <img 
              class="profile-picture" 
              src="${currentWallet.user?.profile_image_url || 'default-avatar.png'}" 
              alt="Profile"
            />
            <span class="username">@${currentWallet.user?.username || 'user'}</span>
          </div>
          <button class="settings-btn" id="settingsBtn">⚙️</button>
        </div>

        <div class="balance-section">
          <h2>Total Balance</h2>
          <div class="balance-amount">${currentWallet.balance} SOL</div>
        </div>

        <div class="action-buttons">
          <button id="sendBtn">Send</button>
          <button id="receiveBtn">Receive</button>
        </div>

        <div class="transactions-list">
          <h3>Recent Transactions</h3>
        </div>
      </div>
    `;

    // Add event listeners after DOM update
    requestAnimationFrame(() => {
      document.getElementById('settingsBtn')?.addEventListener('click', () => {
        this.showSettings();
      });
      document.getElementById('sendBtn')?.addEventListener('click', () => {
        this.handleSend();
      });
      document.getElementById('receiveBtn')?.addEventListener('click', () => {
        this.handleReceive();
      });
    });
  }

  private showSettings() {
    console.log('Settings clicked');
    // TODO: Implement settings
  }

  private handleSend() {
    if (!this.mainContent) return;
    console.log('Handling send...');
    this.showSendScreen();
  }

  private showSendScreen() {
    if (!this.mainContent) return;
    console.log('Showing send screen');
    
    const currentWallet = this.wallets[this.currentWalletIndex];
    
    this.mainContent.innerHTML = `
      <div class="dashboard-container">
        <div class="glass-panel">
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <button id="backButtonSend" class="back-btn" style="background: transparent; border: none; color: white; cursor: pointer;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h2 style="margin: 0; font-size: 24px;">Send MNT</h2>
              <div style="width: 24px;"></div>
            </div>
            
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; color: rgba(255,255,255,0.7);">Recipient Address</label>
              <input type="text" id="recipientAddress" placeholder="0x..." 
                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); 
                border-radius: 8px; color: white; font-size: 14px;">
            </div>
            
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; color: rgba(255,255,255,0.7);">Amount</label>
              <div style="position: relative;">
                <input type="number" id="sendAmount" placeholder="0.00" 
                  style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); 
                  border-radius: 8px; color: white; font-size: 14px;">
                <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.7);">MNT</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                <span style="color: rgba(255,255,255,0.5); font-size: 14px;">Balance: ${currentWallet.balance.toFixed(2)} MNT</span>
                <button id="maxBtn" style="background: transparent; border: none; color: #7C3AED; font-size: 14px; cursor: pointer;">MAX</button>
              </div>
            </div>
            
            <button id="confirmSendBtn" 
              style="width: 100%; padding: 14px; background: #7C3AED; color: white; border: none; 
              border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 16px;">
              Send MNT
            </button>
          </div>
        </div>
      </div>
    `;
    
    // CRITICAL FIX: Directly attach event listeners to elements
    document.getElementById('backButtonSend')?.addEventListener('click', () => {
      console.log('Back button clicked');
      this.showDashboard();
    });
    
    document.getElementById('maxBtn')?.addEventListener('click', () => {
      const amountInput = document.getElementById('sendAmount') as HTMLInputElement;
      if (amountInput) {
        amountInput.value = currentWallet.balance.toString();
      }
    });
    
    document.getElementById('confirmSendBtn')?.addEventListener('click', () => {
      const recipientAddress = (document.getElementById('recipientAddress') as HTMLInputElement)?.value;
      const amount = (document.getElementById('sendAmount') as HTMLInputElement)?.value;
      
      if (!recipientAddress || !amount) {
        console.error('Please fill in all fields');
        return;
      }
      
      console.log('Sending transaction', { recipientAddress, amount });
      this.showTransactionSuccess();
    });
  }

  private showTransactionSuccess() {
    if (!this.mainContent) return;
    
    this.mainContent.innerHTML = `
      <div class="dashboard-container">
        <div class="glass-panel" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <div style="width: 80px; height: 80px; background: rgba(52, 211, 153, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          
          <h2 style="font-size: 24px; margin-bottom: 8px;">Transaction Sent!</h2>
          <p style="color: rgba(255,255,255,0.7); margin-bottom: 24px;">Your MNT has been sent successfully.</p>
          
          <button id="successBackToDashboardBtn" 
            style="padding: 12px 24px; background: #7C3AED; color: white; border: none; 
            border-radius: 8px; font-weight: 600; cursor: pointer;">
            Back to Dashboard
          </button>
        </div>
      </div>
    `;
    
    document.getElementById('successBackToDashboardBtn')?.addEventListener('click', () => {
      console.log('Back to dashboard clicked from success screen');
      this.showDashboard();
    });
  }

  private handleDeposit() {
    if (!this.mainContent) return;
    console.log('Handling deposit...');
    this.showDepositScreen();
  }

  private showDepositScreen() {
    if (!this.mainContent) return;
    console.log('Showing deposit screen');
    
    this.mainContent.innerHTML = `
      <div class="dashboard-container">
        <div class="glass-panel">
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <button id="backButtonDeposit" class="back-btn" style="background: transparent; border: none; color: white; cursor: pointer;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h2 style="margin: 0; font-size: 24px;">Deposit MNT</h2>
              <div style="width: 24px;"></div>
            </div>
            
            <div style="text-align: center; margin-bottom: 24px;">
              <p style="color: rgba(255,255,255,0.7); margin-bottom: 16px;">
                Send MNT to your wallet address:
              </p>
              
              <div style="position: relative; margin: 24px 0;">
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; 
                      border: 1px solid rgba(255,255,255,0.1); font-family: monospace; word-break: break-all;">
                  0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
                </div>
                <button id="copyAddressBtn" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
                        background: rgba(255,255,255,0.1); border: none; border-radius: 4px; padding: 8px; cursor: pointer;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              
              <div style="margin: 32px 0;">
                <div id="qrCode" style="width: 180px; height: 180px; background: white; margin: 0 auto; 
                     display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                  <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
                    <!-- Simple QR placeholder -->
                    <rect width="140" height="140" fill="#000" />
                    <rect x="10" y="10" width="120" height="120" fill="#fff" />
                    <rect x="20" y="20" width="100" height="100" fill="#000" />
                    <rect x="30" y="30" width="80" height="80" fill="#fff" />
                    <rect x="40" y="40" width="60" height="60" fill="#000" />
                    <rect x="50" y="50" width="40" height="40" fill="#fff" />
                  </svg>
                </div>
              </div>
              
              <p style="color: rgba(255,255,255,0.5); font-size: 14px;">
                Only send MNT or tokens on the Mantle network to this address.<br/>
                Sending other tokens may result in permanent loss.
              </p>
            </div>
            
            <button id="backToDashboardBtn" 
              style="width: 100%; padding: 14px; background: #7C3AED; color: white; border: none; 
              border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 16px;">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    `;
    
    console.log('Attaching deposit screen event handlers');
    
    // Add event listeners
    document.getElementById('backButtonDeposit')?.addEventListener('click', () => {
      console.log('Back button clicked from deposit screen');
      this.showDashboard();
    });
    
    document.getElementById('copyAddressBtn')?.addEventListener('click', () => {
      // Copy the address to clipboard
      navigator.clipboard.writeText('0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t')
        .then(() => {
          // Show a temporary "Copied!" tooltip
          const btn = document.getElementById('copyAddressBtn');
          if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<span style="color: #A5F3FC;">Copied!</span>`;
            setTimeout(() => {
              btn.innerHTML = originalHTML;
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    });
    
    document.getElementById('backToDashboardBtn')?.addEventListener('click', () => {
      console.log('Back to dashboard clicked from deposit screen');
      this.showDashboard();
    });
  }

  private handleReceive() {
    console.log('Receive clicked');
    // TODO: Implement receive
  }

  private showLoadingState() {
    if (!this.mainContent) return;
    
    const button = this.mainContent.querySelector('.twitter-login');
    if (button) {
      button.classList.add('loading');
      button.setAttribute('disabled', 'true');
    }
  }

  private hideLoadingState() {
    if (!this.mainContent) return;
    
    const button = this.mainContent.querySelector('.twitter-login');
    if (button) {
      button.classList.remove('loading');
      button.removeAttribute('disabled');
    }
  }

  private showPopupBlockedHelp() {
    this.showError('Popup was blocked. Please allow popups for this site and try again.');
    // Add visual indicator for popup settings
    const helpText = document.createElement('div');
    helpText.className = 'popup-help';
    helpText.innerHTML = `
      <p>To allow popups:</p>
      <ol>
        <li>Click the popup blocked icon in your address bar</li>
        <li>Select "Always allow popups from this site"</li>
        <li>Try logging in again</li>
      </ol>
    `;
    this.mainContent?.appendChild(helpText);
  }

  private showRetryButton() {
    const retryButton = document.createElement('button');
    retryButton.className = 'retry-button';
    retryButton.textContent = 'Retry Login';
    retryButton.onclick = () => this.showLoginScreen();
    this.mainContent?.appendChild(retryButton);
  }

  private debugInteractions() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      console.log('Clicked element:', target.tagName, target.id, target.className);
      
      // Check if we clicked near any of our action buttons
      const sendBtn = document.getElementById('sendButton');
      const depositBtn = document.getElementById('depositButton');
      
      if (sendBtn) {
        const rect = sendBtn.getBoundingClientRect();
        const isNearSend = 
          event.clientX >= rect.left - 10 && 
          event.clientX <= rect.right + 10 && 
          event.clientY >= rect.top - 10 && 
          event.clientY <= rect.bottom + 10;
        
        if (isNearSend) {
          console.log('Click was near the send button!');
        }
      }
    });
  }

  // Add network dropdown functionality
  private showNetworkDropdown() {
    console.log('Showing network dropdown');
    
    // Create dropdown element
    const dropdown = document.createElement('div');
    dropdown.id = 'networkDropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 50px;
      right: 30px;
      background: rgba(30, 30, 30, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 0;
      min-width: 150px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    // Add network options
    const networks = [
      { id: 'mantle', name: 'Mantle', icon: 'mnt-logo.svg' },
      { id: 'ethereum', name: 'Ethereum', icon: 'eth-logo.png' },
      { id: 'base', name: 'Base', icon: 'base-logo.png' }
    ];
    
    networks.forEach(network => {
      const option = document.createElement('div');
      option.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px;
        cursor: pointer;
        transition: background 0.2s;
      `;
      option.innerHTML = `
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #333; display: flex; align-items: center; justify-content: center;">
          ${network.name.charAt(0)}
        </div>
        <span>${network.name}</span>
      `;
      
      option.addEventListener('mouseover', () => {
        option.style.background = 'rgba(255, 255, 255, 0.1)';
      });
      
      option.addEventListener('mouseout', () => {
        option.style.background = 'transparent';
      });
      
      option.addEventListener('click', () => {
        console.log(`Selected network: ${network.name}`);
        this.changeNetwork(network.id);
        dropdown.remove();
      });
      
      dropdown.appendChild(option);
    });
    
    // Add dropdown to the DOM
    document.body.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    const closeDropdown = (e: MouseEvent) => {
      if (!(e.target as Element).closest('#networkDropdown') && 
          !(e.target as Element).closest('#networkSelect')) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeDropdown);
    }, 0);
  }

  private changeNetwork(networkId: string) {
    console.log(`Changing to network: ${networkId}`);
    const networkSelect = document.getElementById('networkSelect');
    if (networkSelect) {
      if (networkId === 'mantle') {
        networkSelect.innerHTML = `
          <img src="${this.assetUrl('mnt-logo.svg')}" alt="MNT" class="network-icon"/>
          <span>MNT</span>
        `;
      } else if (networkId === 'ethereum') {
        networkSelect.innerHTML = `
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #627EEA; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 12px;">E</span>
          </div>
          <span>ETH</span>
        `;
      } else if (networkId === 'base') {
        networkSelect.innerHTML = `
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #0052FF; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 12px;">B</span>
          </div>
          <span>BASE</span>
        `;
      }
    }
  }
}

// Initialize the app
new WalletApp(); 