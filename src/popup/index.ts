/// <reference types="chrome"/>

console.log('Popup script loaded')

import '../utils/polyfills';
import { AuthState, User, Wallet } from '../types/auth';
import { SessionManager } from '../utils/SessionManager';
import { handleAuthError } from '../utils/errors';
import { AuthError, AuthErrorCode } from '../utils/errors';

// Screen management
type Screen = 'login' | 'home' | 'settings' | 'send' | 'receive' | 'nfts' | 'poaps';

class WalletApp {
  private mainContent: HTMLElement | null = null;
  private assetUrl = (path: string) => `assets/${path}`;

  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.mainContent = document.getElementById('mainContent');
      if (this.mainContent) {
        this.showLoginScreen();
        this.initLoginHandler();
      }
    });
  }

  private showLoginScreen() {
    if (!this.mainContent) return;
    
    this.mainContent.innerHTML = `
      <div class="login-container">
        <div class="brand-section">
          <img 
            src="${this.assetUrl('sozu-logo.png')}" 
            alt="Sozu Cash" 
            class="brand-logo"
          />
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
    console.log('Showing dashboard');
    
    this.mainContent.innerHTML = `
      <div class="dashboard-container">
        <div class="glass-panel">
          <div class="glass-card balance-card">
            <div class="balance-section">
              <div class="balance-header">
                <span class="balance-label">Total Balance</span>
                <div class="network-select">
                  <img src="${this.assetUrl('mnt-logo.png')}" alt="MNT" class="network-icon"/>
                  <span>MNT</span>
                </div>
              </div>
              <h2 class="balance-amount">1,234.56 MNT</h2>
              <span class="balance-usd">≈ $345.67</span>
            </div>
            <div class="action-buttons">
              <button class="action-btn send">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 16V4M10 4L16 10M10 4L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Send
              </button>
              <button class="action-btn deposit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M10 16L16 10M10 16L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Deposit
              </button>
            </div>
          </div>

          <div class="glass-card tokens-card mx-auto max-w-[280px] w-full">
            <h3>Your Tokens</h3>
            <div class="token-list">
              <div class="token-item">
                <div class="token-info">
                  <img src="${this.assetUrl('mnt-logo.png')}" alt="MNT" class="token-icon"/>
                  <div class="token-details">
                    <span class="token-name">Mantle</span>
                    <span class="token-amount">123.45 MNT</span>
                  </div>
                </div>
                <span class="token-value">$345.67</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add click handlers for the buttons
    const sendBtn = this.mainContent.querySelector('.action-btn.send');
    const depositBtn = this.mainContent.querySelector('.action-btn.deposit');
    
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        console.log('Send clicked');
        this.handleSend();
      });
    }
    
    if (depositBtn) {
      depositBtn.addEventListener('click', () => {
        console.log('Deposit clicked');
        this.handleDeposit();
      });
    }
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
    // TODO: Implement send flow
    console.log('Handling send...');
  }

  private handleDeposit() {
    if (!this.mainContent) return;
    // TODO: Implement deposit flow
    console.log('Handling deposit...');
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
}

// Initialize the app
new WalletApp(); 