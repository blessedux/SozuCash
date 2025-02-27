console.log('Popup script loaded')

// Screen management
type Screen = 'login' | 'home' | 'settings' | 'send' | 'receive' | 'nfts' | 'poaps';

class WalletApp {
  constructor() {
    console.log('WalletApp initialized');
    this.checkAuthStatus();
  }

  private async checkAuthStatus() {
    const isAuthenticated = await this.getAuthStatus();
    if (isAuthenticated) {
      this.showWallet();
    }
  }

  async handleTwitterLogin() {
    try {
      const response = await chrome.runtime.sendMessage({ 
        type: 'AUTH0_LOGIN',
        connection: 'twitter'
      });

      if (response.success) {
        this.showWallet();
      } else {
        throw new Error('Twitter login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: Show error to user
    }
  }

  async handleImportWallet() {
    // Will implement wallet import later
    console.log('Import wallet clicked');
  }

  private showWallet() {
    // Will implement wallet UI later
    console.log('Showing wallet');
  }

  private async getAuthStatus(): Promise<boolean> {
    const data = await chrome.storage.local.get('isAuthenticated');
    return data.isAuthenticated || false;
  }
}

// Make the app instance available globally for button callbacks
declare global {
  interface Window {
    app: WalletApp;
  }
}

window.app = new WalletApp(); 