console.log('Popup script loaded')

// Screen management
type Screen = 'login' | 'home' | 'settings' | 'send' | 'receive' | 'nfts' | 'poaps';

class WalletApp {
  private currentScreen: Screen = 'login';
  private mainContent: HTMLElement;
  private header: HTMLElement;

  constructor() {
    console.log('WalletApp initialized');
    this.mainContent = document.getElementById('mainContent')!;
    this.header = document.querySelector('.header')!;
    
    if (!this.mainContent) {
      console.error('Could not find mainContent element!');
      return;
    }
    
    this.initializeEventListeners();
    this.renderScreen('login');
  }

  private initializeEventListeners() {
    // Settings button
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
      this.renderScreen('settings');
    });
  }

  private renderScreen(screen: Screen) {
    this.currentScreen = screen;
    this.updateNavigationDots();
    
    // Show/hide header based on screen
    if (screen === 'login') {
      this.header.classList.remove('visible');
    } else {
      this.header.classList.add('visible');
    }
    
    switch (screen) {
      case 'login':
        this.renderLogin();
        break;
      case 'home':
        this.renderHome();
        break;
      case 'settings':
        this.renderSettings();
        break;
      case 'send':
        this.renderSend();
        break;
      case 'receive':
        this.renderReceive();
        break;
      case 'nfts':
        this.renderNFTs();
        break;
      case 'poaps':
        this.renderPOAPs();
        break;
    }
  }

  private updateNavigationDots() {
    const dotsContainer = document.getElementById('navigationDots');
    if (!dotsContainer) return;

    const screens = ['home', 'nfts', 'poaps'];
    const currentIndex = screens.indexOf(this.currentScreen);
    
    dotsContainer.innerHTML = screens
      .map((_, index) => `
        <div class="nav-dot ${index === currentIndex ? 'active' : ''}"></div>
      `)
      .join('');
  }

  private renderLogin() {
    this.mainContent.innerHTML = `
      <div class="login-container">
        <div class="spline-background">
          <iframe 
            src='https://my.spline.design/animatedshapeblend-44b4174e2919277ccdb7a032cc53f2c1/' 
            frameborder='0' 
            width='100%' 
            height='100%'
          ></iframe>
        </div>

        <div class="brand-container">
          <div class="brand-title">SOZU</div>
          <div class="brand-title">CASH</div>
        </div>

        <div class="content-section">
          <div class="hero-text">
            <div class="hero-title">Jump start your crypto portfolio</div>
            <div class="hero-subtitle">Take your investment portfolio to next level</div>
          </div>

          <button class="auth0-button" onclick="window.app.handleAuth0Login()">
            <div class="auth0-button-content">
              <img src="auth0-logo.svg" alt="Auth0" class="auth0-logo" />
              <span>Continue with Auth0</span>
            </div>
          </button>
        </div>
      </div>
    `;
  }

  private renderHome() {
    this.mainContent.innerHTML = `
      <div class="home-container">
        <div class="balance-section">
          <p class="balance-label">Your Balance</p>
          <h1 class="balance-amount">0 SOL</h1>
        </div>
        
        <div class="main-actions">
          <button onclick="window.app.renderScreen('send')">Send</button>
          <button onclick="window.app.renderScreen('receive')">Receive</button>
        </div>

        <div class="bottom-nav">
          <button onclick="window.app.renderScreen('home')" class="active">Wallet</button>
          <button onclick="window.app.renderScreen('nfts')">NFTs</button>
          <button onclick="window.app.renderScreen('poaps')">POAPs</button>
        </div>

        <div id="navigationDots" class="navigation-dots"></div>
      </div>
    `;
    this.updateNavigationDots();
  }

  private renderSettings() {
    this.mainContent.innerHTML = `
      <div>
        <h3>Settings</h3>
        <button onclick="window.app.renderScreen('home')">Back to Home</button>
        <div style="margin-top: 20px;">
          <p>Network: Devnet</p>
          <p>Version: 1.0.0</p>
        </div>
      </div>
    `;
  }

  private renderSend() {
    this.mainContent.innerHTML = `
      <div>
        <h3>Send</h3>
        <button onclick="window.app.renderScreen('home')">Back</button>
        <div style="margin-top: 20px;">
          <input type="text" placeholder="Recipient address" style="width: 100%; margin-bottom: 10px; padding: 8px;">
          <input type="number" placeholder="Amount" style="width: 100%; margin-bottom: 10px; padding: 8px;">
          <button style="width: 100%;">Send</button>
        </div>
      </div>
    `;
  }

  private renderReceive() {
    this.mainContent.innerHTML = `
      <div>
        <h3>Receive</h3>
        <button onclick="window.app.renderScreen('home')">Back</button>
        <div style="margin-top: 20px; text-align: center;">
          <div style="background: #333; padding: 20px; margin: 10px 0;">
            Your wallet address will appear here
          </div>
        </div>
      </div>
    `;
  }

  private async handleAuth0Login() {
    try {
      // This will be implemented with Auth0 SDK
      console.log('Initiating Auth0 login...');
      // TODO: Add Auth0 authentication flow
      const backendUrl = 'https://your-okto-backend.com/auth';
      // Will implement actual auth flow
    } catch (error) {
      console.error('Auth0 login failed:', error);
    }
  }

  private handleExistingWallet() {
    console.log('Connect existing wallet clicked');
    // TODO: Implement wallet connection
  }
}

// Make the app instance available globally for button callbacks
declare global {
  interface Window {
    app: WalletApp;
  }
}

window.app = new WalletApp(); 