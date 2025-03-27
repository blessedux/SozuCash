console.log('Sozu Wallet content script loaded');

import TwitterIntegration from './TwitterIntegration';

// Check if we're on Twitter/X
const isTwitter = window.location.hostname.includes('twitter.com') || 
                  window.location.hostname.includes('x.com');

// Only initialize our integration if we're on Twitter/X
if (isTwitter) {
  // Wait for the page to fully load
  window.addEventListener('load', () => {
    // Initialize Twitter integration
    new TwitterIntegration();
  });
}

// Main configuration
const SOZU_APP_CONFIG = {
  appName: 'Sozu Wallet',
  supportedNetworks: ['Ethereum', 'Solana'],
  defaultNetwork: 'Ethereum',
  theme: {
    primary: '#7C3AED',
    secondary: '#3B82F6',
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: 'rgba(16, 185, 129, 0.9)',
    error: 'rgba(239, 68, 68, 0.9)',
  }
};

class SozuTwitterApp {
  private appContainer: HTMLElement | null = null;
  private isAppOpen: boolean = false;
  private currentSection: string = 'wallet';
  private walletBalance: string = '1,280.42';
  private usdBalance: string = '$2,304.76';

  constructor() {
    // Initialize the app
    this.init();
  }

  init() {
    // Wait for Twitter to fully load before injecting our app
    this.waitForTwitterToLoad()
      .then(() => {
        this.injectAppButton();
        this.createAppContainer();
        this.setupListeners();
      })
      .catch(error => console.error('Error initializing Sozu App:', error));
  }

  waitForTwitterToLoad(): Promise<void> {
    return new Promise((resolve) => {
      // Check if the sidebar where we'll inject our button is present
      const checkForSidebar = () => {
        const sidebarExists = document.querySelector('[data-testid="sidebarColumn"]');
        if (sidebarExists) {
          resolve();
        } else {
          setTimeout(checkForSidebar, 500);
        }
      };
      
      checkForSidebar();
    });
  }

  injectAppButton() {
    // Find the sidebar
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    if (!sidebar) return;

    // Create the button
    const sozuButton = document.createElement('div');
    sozuButton.className = 'sozu-launcher-button';
    sozuButton.innerHTML = `
      <button>
        <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="Sozu Wallet" />
        <span>Sozu Wallet</span>
      </button>
    `;

    // Style the button
    const style = document.createElement('style');
    style.textContent = `
      .sozu-launcher-button {
        margin: 12px 0;
        padding: 0 16px;
      }
      
      .sozu-launcher-button button {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px 16px;
        background: rgba(124, 58, 237, 0.1);
        border: 1px solid rgba(124, 58, 237, 0.3);
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .sozu-launcher-button button:hover {
        background: rgba(124, 58, 237, 0.2);
      }
      
      .sozu-launcher-button img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
      
      .sozu-launcher-button span {
        font-weight: 500;
        font-size: 15px;
        color: rgb(124, 58, 237);
      }
    `;
    document.head.appendChild(style);

    // Add it to the sidebar after the explore section
    const exploreSection = sidebar.querySelector('nav');
    if (exploreSection && exploreSection.parentNode) {
      exploreSection.parentNode.insertBefore(sozuButton, exploreSection.nextSibling);
    } else {
      sidebar.prepend(sozuButton);
    }

    // Add click event
    sozuButton.addEventListener('click', () => this.toggleApp());
  }

  createAppContainer() {
    // Create main container for our app
    this.appContainer = document.createElement('div');
    this.appContainer.className = 'sozu-app-container';
    this.appContainer.style.display = 'none'; // Hidden by default

    // Add styles for our app
    const appStyles = document.createElement('style');
    appStyles.textContent = `
      .sozu-app-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 420px;
        height: 100vh;
        background: ${SOZU_APP_CONFIG.theme.background};
        box-shadow: -5px 0 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        color: ${SOZU_APP_CONFIG.theme.text};
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .sozu-app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid ${SOZU_APP_CONFIG.theme.border};
      }
      
      .sozu-app-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 18px;
      }
      
      .sozu-app-title img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
      
      .sozu-app-close {
        background: transparent;
        border: none;
        color: ${SOZU_APP_CONFIG.theme.text};
        cursor: pointer;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .sozu-app-close:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .sozu-app-nav {
        display: flex;
        padding: 0 16px;
        border-bottom: 1px solid ${SOZU_APP_CONFIG.theme.border};
      }
      
      .sozu-nav-item {
        padding: 16px 12px;
        font-weight: 500;
        cursor: pointer;
        position: relative;
        color: ${SOZU_APP_CONFIG.theme.textSecondary};
      }
      
      .sozu-nav-item.active {
        color: ${SOZU_APP_CONFIG.theme.text};
      }
      
      .sozu-nav-item.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: ${SOZU_APP_CONFIG.theme.primary};
        border-radius: 4px 4px 0 0;
      }
      
      .sozu-app-content {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
      }
      
      .sozu-section {
        display: none;
      }
      
      .sozu-section.active {
        display: block;
      }
      
      .sozu-card {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        border: 1px solid ${SOZU_APP_CONFIG.theme.border};
      }
      
      .sozu-balance-card {
        position: relative;
        overflow: hidden;
      }
      
      .sozu-network-select {
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.05);
        padding: 4px 8px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
      }
      
      .sozu-network-select:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .sozu-balance-amount {
        font-size: 36px;
        font-weight: 700;
        margin: 8px 0;
        background: linear-gradient(90deg, ${SOZU_APP_CONFIG.theme.primary}, ${SOZU_APP_CONFIG.theme.secondary});
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .sozu-balance-usd {
        color: ${SOZU_APP_CONFIG.theme.textSecondary};
        font-size: 14px;
      }
      
      .sozu-action-buttons {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }
      
      .sozu-action-btn {
        flex: 1;
        padding: 12px;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        border: none;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      
      .sozu-action-btn.send {
        background: ${SOZU_APP_CONFIG.theme.primary};
        color: white;
      }
      
      .sozu-action-btn.receive {
        background: ${SOZU_APP_CONFIG.theme.secondary};
        color: white;
      }
      
      .sozu-action-btn.tip {
        background: rgba(255, 255, 255, 0.1);
        color: ${SOZU_APP_CONFIG.theme.text};
      }
      
      .sozu-action-btn:hover {
        opacity: 0.9;
      }
      
      .sozu-tokens-header {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
      }
      
      .sozu-token-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid ${SOZU_APP_CONFIG.theme.border};
      }
      
      .sozu-token-item:last-child {
        border-bottom: none;
      }
      
      .sozu-token-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .sozu-token-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        font-weight: 600;
      }
      
      .sozu-token-details {
        display: flex;
        flex-direction: column;
      }
      
      .sozu-token-name {
        font-weight: 500;
      }
      
      .sozu-token-ticker {
        font-size: 12px;
        color: ${SOZU_APP_CONFIG.theme.textSecondary};
      }
      
      .sozu-token-value {
        font-weight: 500;
        text-align: right;
      }
      
      .sozu-token-price {
        font-size: 12px;
        color: ${SOZU_APP_CONFIG.theme.textSecondary};
      }
      
      .sozu-nft-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      
      .sozu-nft-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid ${SOZU_APP_CONFIG.theme.border};
      }
      
      .sozu-nft-image {
        aspect-ratio: 1;
        width: 100%;
        object-fit: cover;
      }
      
      .sozu-nft-details {
        padding: 12px;
      }
      
      .sozu-nft-name {
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .sozu-nft-collection {
        font-size: 12px;
        color: ${SOZU_APP_CONFIG.theme.textSecondary};
      }
      
      .sozu-tip-section {
        padding: 16px;
      }
      
      .sozu-tip-header {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 16px;
        text-align: center;
      }
      
      .sozu-tip-input {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }
      
      .sozu-tip-input span {
        font-size: 20px;
        font-weight: 500;
        margin-right: 8px;
      }
      
      .sozu-tip-input input {
        background: transparent;
        border: none;
        color: ${SOZU_APP_CONFIG.theme.text};
        font-size: 20px;
        width: 100%;
        outline: none;
      }
      
      .sozu-tip-btn {
        width: 100%;
        padding: 14px;
        background: ${SOZU_APP_CONFIG.theme.primary};
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
      }
      
      .sozu-tip-btn:hover {
        background: ${SOZU_APP_CONFIG.theme.primary}e0;
      }
      
      /* Twitter integration overlay styles */
      .sozu-twitter-overlay {
        position: relative;
      }
      
      .sozu-tip-author-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(124, 58, 237, 0.1);
        color: rgb(124, 58, 237);
        padding: 6px 12px;
        border-radius: 9999px;
        font-weight: 500;
        font-size: 13px;
        cursor: pointer;
        margin-top: 8px;
        border: none;
      }
      
      .sozu-tip-author-btn:hover {
        background: rgba(124, 58, 237, 0.2);
      }
    `;
    document.head.appendChild(appStyles);

    // Set the initial content
    this.renderAppContent();

    // Add to body
    document.body.appendChild(this.appContainer);
  }

  renderAppContent() {
    if (!this.appContainer) return;

    this.appContainer.innerHTML = `
      <div class="sozu-app-header">
        <div class="sozu-app-title">
          <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="Sozu Wallet" />
          <span>Sozu Wallet</span>
        </div>
        <button class="sozu-app-close">✕</button>
      </div>
      
      <div class="sozu-app-nav">
        <div class="sozu-nav-item ${this.currentSection === 'wallet' ? 'active' : ''}" data-section="wallet">Wallet</div>
        <div class="sozu-nav-item ${this.currentSection === 'nfts' ? 'active' : ''}" data-section="nfts">NFTs</div>
        <div class="sozu-nav-item ${this.currentSection === 'activity' ? 'active' : ''}" data-section="activity">Activity</div>
        <div class="sozu-nav-item ${this.currentSection === 'tipping' ? 'active' : ''}" data-section="tipping">Tipping</div>
      </div>
      
      <div class="sozu-app-content">
        <!-- Wallet Section -->
        <div class="sozu-section ${this.currentSection === 'wallet' ? 'active' : ''}" id="wallet-section">
          <div class="sozu-card sozu-balance-card">
            <div class="sozu-network-select">
              <span>Ethereum</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5H7z"></path>
              </svg>
            </div>
            <div>
              <div class="sozu-balance-label">Total Balance</div>
              <div class="sozu-balance-amount">${this.walletBalance} ETH</div>
              <div class="sozu-balance-usd">${this.usdBalance} USD</div>
            </div>
            <div class="sozu-action-buttons">
              <button class="sozu-action-btn send">Send</button>
              <button class="sozu-action-btn receive">Receive</button>
              <button class="sozu-action-btn tip">Tip</button>
            </div>
          </div>
          
          <div class="sozu-card">
            <div class="sozu-tokens-header">Tokens</div>
            <div class="sozu-token-list">
              <div class="sozu-token-item">
                <div class="sozu-token-info">
                  <div class="sozu-token-icon">ETH</div>
                  <div class="sozu-token-details">
                    <div class="sozu-token-name">Ethereum</div>
                    <div class="sozu-token-ticker">ETH</div>
                  </div>
                </div>
                <div class="sozu-token-value">
                  <div>1,280.42 ETH</div>
                  <div class="sozu-token-price">$2,304.76</div>
                </div>
              </div>
              <div class="sozu-token-item">
                <div class="sozu-token-info">
                  <div class="sozu-token-icon">SOL</div>
                  <div class="sozu-token-details">
                    <div class="sozu-token-name">Solana</div>
                    <div class="sozu-token-ticker">SOL</div>
                  </div>
                </div>
                <div class="sozu-token-value">
                  <div>24.5 SOL</div>
                  <div class="sozu-token-price">$613.29</div>
                </div>
              </div>
              <div class="sozu-token-item">
                <div class="sozu-token-info">
                  <div class="sozu-token-icon">MNT</div>
                  <div class="sozu-token-details">
                    <div class="sozu-token-name">Mantle</div>
                    <div class="sozu-token-ticker">MNT</div>
                  </div>
                </div>
                <div class="sozu-token-value">
                  <div>2,500 MNT</div>
                  <div class="sozu-token-price">$183.75</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- NFTs Section -->
        <div class="sozu-section ${this.currentSection === 'nfts' ? 'active' : ''}" id="nfts-section">
          <div class="sozu-nft-grid">
            <div class="sozu-nft-card">
              <img src="https://i.seadn.io/gcs/files/af8fb7f552c263e764c385f83a6a2e46.png?auto=format&w=1000" class="sozu-nft-image" alt="Boys #1234" />
              <div class="sozu-nft-details">
                <div class="sozu-nft-name">Boys #1234</div>
                <div class="sozu-nft-collection">Boys Collection</div>
              </div>
            </div>
            <div class="sozu-nft-card">
              <img src="https://i.seadn.io/gcs/files/5050e1a8ee802ae17cac4bf9fd1ba5d6.png?auto=format&w=1000" class="sozu-nft-image" alt="Boys #2345" />
              <div class="sozu-nft-details">
                <div class="sozu-nft-name">Boys #2345</div>
                <div class="sozu-nft-collection">Boys Collection</div>
              </div>
            </div>
            <div class="sozu-nft-card">
              <img src="https://i.seadn.io/gcs/files/9a3b9ee728b0b8bf11c3573a4eaace08.png?auto=format&w=1000" class="sozu-nft-image" alt="Boys #3456" />
              <div class="sozu-nft-details">
                <div class="sozu-nft-name">Boys #3456</div>
                <div class="sozu-nft-collection">Boys Collection</div>
              </div>
            </div>
            <div class="sozu-nft-card">
              <img src="https://i.seadn.io/gcs/files/ef4d984f87c43e3b9950f13a9f7ce994.png?auto=format&w=1000" class="sozu-nft-image" alt="Boys #4567" />
              <div class="sozu-nft-details">
                <div class="sozu-nft-name">Boys #4567</div>
                <div class="sozu-nft-collection">Boys Collection</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Activity Section -->
        <div class="sozu-section ${this.currentSection === 'activity' ? 'active' : ''}" id="activity-section">
          <div class="sozu-card">
            <div style="text-align: center; padding: 20px 0;">
              <p>Your recent activity will appear here</p>
            </div>
          </div>
        </div>
        
        <!-- Tipping Section -->
        <div class="sozu-section ${this.currentSection === 'tipping' ? 'active' : ''}" id="tipping-section">
          <div class="sozu-card">
            <div class="sozu-tip-header">Tip a tweet author</div>
            <div class="sozu-tip-input">
              <span>ETH</span>
              <input type="number" placeholder="0.01" min="0.001" step="0.001" />
            </div>
            <button class="sozu-tip-btn">Send Tip</button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners to the newly rendered content
    this.setupAppEventListeners();
  }

  setupAppEventListeners() {
    if (!this.appContainer) return;

    // Close button
    const closeButton = this.appContainer.querySelector('.sozu-app-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.toggleApp());
    }

    // Navigation tabs
    const navItems = this.appContainer.querySelectorAll('.sozu-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const section = (e.currentTarget as HTMLElement).getAttribute('data-section');
        if (section) {
          this.switchSection(section);
        }
      });
    });

    // Tip button in wallet
    const tipButton = this.appContainer.querySelector('.sozu-action-btn.tip');
    if (tipButton) {
      tipButton.addEventListener('click', () => this.switchSection('tipping'));
    }
  }

  switchSection(section: string) {
    this.currentSection = section;
    
    // Update the UI to reflect the new section
    if (this.appContainer) {
      // Update navigation
      const navItems = this.appContainer.querySelectorAll('.sozu-nav-item');
      navItems.forEach(item => {
        if (item.getAttribute('data-section') === section) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Update section visibility
      const sections = this.appContainer.querySelectorAll('.sozu-section');
      sections.forEach(sectionEl => {
        if (sectionEl.id === `${section}-section`) {
          sectionEl.classList.add('active');
        } else {
          sectionEl.classList.remove('active');
        }
      });
    }
  }

  toggleApp() {
    if (!this.appContainer) return;
    
    this.isAppOpen = !this.isAppOpen;
    this.appContainer.style.display = this.isAppOpen ? 'flex' : 'none';
  }

  setupListeners() {
    // Listen for tweet loads to inject tipping buttons
    this.observeTweetTimeline();
  }

  observeTweetTimeline() {
    // Use MutationObserver to detect when new tweets are loaded
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check for tweets and add tipping buttons
          this.findAndEnhanceTweets();
        }
      });
    });

    // Start observing the timeline
    const startObserving = () => {
      const timeline = document.querySelector('[data-testid="primaryColumn"]');
      if (timeline) {
        observer.observe(timeline, { childList: true, subtree: true });
        // Also check for existing tweets right away
        this.findAndEnhanceTweets();
      } else {
        setTimeout(startObserving, 1000);
      }
    };

    startObserving();
  }

  findAndEnhanceTweets() {
    // Find all tweet actions that don't have our tip button
    const tweetActions = document.querySelectorAll('[data-testid="tweet"] [role="group"]:not(.sozu-enhanced)');
    
    tweetActions.forEach(actionGroup => {
      // Mark as enhanced to avoid processing it again
      actionGroup.classList.add('sozu-enhanced');
      
      // Create tip button
      const tipButton = document.createElement('div');
      tipButton.className = 'sozu-tip-author-btn';
      tipButton.innerHTML = `
        <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" width="16" height="16" />
        <span>Tip</span>
      `;
      
      // Insert after the last action button
      actionGroup.appendChild(tipButton);
      
      // Add click event to open the app in tipping mode
      tipButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Open app and switch to tipping section
        this.isAppOpen = true;
        if (this.appContainer) {
          this.appContainer.style.display = 'flex';
        }
        this.switchSection('tipping');
        
        // Find the author name from the tweet
        const tweetContainer = (actionGroup as Element).closest('[data-testid="tweet"]');
        if (tweetContainer) {
          const authorElement = tweetContainer.querySelector('[data-testid="User-Name"]');
          if (authorElement) {
            const authorName = authorElement.textContent || 'this author';
            // Update the tipping section with the author name
            const tipHeader = this.appContainer?.querySelector('.sozu-tip-header');
            if (tipHeader) {
              tipHeader.textContent = `Tip ${authorName}`;
            }
          }
        }
      });
    });
  }
}

// Initialize the app
new SozuTwitterApp();

export {}; 