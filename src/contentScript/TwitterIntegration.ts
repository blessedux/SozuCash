/**
 * TwitterIntegration.ts
 * Handles Twitter/X specific integration for Sozu Wallet
 * Embeds the wallet directly into Twitter's UI
 */

// Temporarily use string literal instead of importing HTML
const tippingTemplateHtml = `
<div class="sozu-twitter-tipping-overlay">
  <div class="sozu-twitter-tipping-card">
    <div class="sozu-twitter-tipping-header">
      <img src="{{extensionIconUrl}}" alt="Sozu Wallet" class="sozu-twitter-tipping-logo" />
      <div class="sozu-twitter-tipping-title">Tip @{{authorUsername}}</div>
      <button class="sozu-twitter-tipping-close">✕</button>
    </div>
    
    <div class="sozu-twitter-tipping-content">
      <div class="sozu-twitter-tipping-input-group">
        <div class="sozu-twitter-tipping-amount-input">
          <div class="sozu-twitter-tipping-token-select">
            <span class="sozu-twitter-tipping-token-icon">ETH</span>
            <span class="sozu-twitter-tipping-token-caret">▼</span>
          </div>
          <input type="number" class="sozu-twitter-tipping-amount" placeholder="0.01" min="0.001" step="0.001" />
        </div>
        <div class="sozu-twitter-tipping-usd-value">≈ $\{{usdValue}} USD</div>
      </div>
      
      <div class="sozu-twitter-tipping-message">
        <label for="tip-message">Add a message (optional)</label>
        <textarea id="tip-message" class="sozu-twitter-tipping-message-input" placeholder="Great tweet! Sending a tip to support your work."></textarea>
      </div>
      
      <div class="sozu-twitter-tipping-actions">
        <button class="sozu-twitter-tipping-send-btn">Send Tip</button>
      </div>
    </div>
  </div>
</div>
`;

// HTML template for the trending widget injection
const trendingWidgetHtml = `
<div class="sozu-trending-widget">
  <div class="sozu-trending-header">
    <img src="{{extensionIconUrl}}" alt="Sozu Wallet" class="sozu-trending-logo" />
    <div class="sozu-trending-title">Crypto Trends</div>
  </div>
  
  <div class="sozu-trending-content">
    <div class="sozu-trending-item">
      <div class="sozu-trending-token">ETH</div>
      <div class="sozu-trending-price">$1,800.00</div>
      <div class="sozu-trending-change sozu-positive">+2.5%</div>
    </div>
    <div class="sozu-trending-item">
      <div class="sozu-trending-token">BTC</div>
      <div class="sozu-trending-price">$29,850.00</div>
      <div class="sozu-trending-change sozu-positive">+1.2%</div>
    </div>
    <div class="sozu-trending-item">
      <div class="sozu-trending-token">SOL</div>
      <div class="sozu-trending-price">$98.75</div>
      <div class="sozu-trending-change sozu-negative">-0.8%</div>
    </div>
  </div>
  
  <div class="sozu-trending-footer">
    <button class="sozu-trending-view-all">View All Prices</button>
  </div>
</div>
`;

import './twitter-styles.css';

interface Author {
  username: string;
  displayName: string;
  avatarUrl: string;
  tweetId: string;
}

export default class TwitterIntegration {
  private tippingOverlay: HTMLElement | null = null;
  private walletContainer: HTMLElement | null = null;
  private currentSection: string = 'wallet';
  private currentTipAmount: number = 0.01;
  private currentAuthor: Author | null = null;
  private ethPrice: number = 1800; // Default ETH price in USD
  private walletBalance: string = '1,280.42';
  private usdBalance: string = '$2,304.76';
  private sidebarReplaced: boolean = false;
  private trendingInjected: boolean = false;

  constructor() {
    // Initialize integration
    this.init();
  }

  private init(): void {
    // Fetch the current ETH price
    this.fetchEthPrice();
    
    // Start observing Twitter DOM for tweets
    this.observeTweetTimeline();
    
    // Find and replace the sidebar
    this.findAndReplaceSidebar();
    
    // Inject content into the trending section
    this.injectTrendingWidget();
  }

  private fetchEthPrice(): void {
    // In a production app, you would fetch this from a price API
    // For this demo, we'll use a hardcoded value
    // TODO: Implement actual price fetching
    this.ethPrice = 1800;
  }

  private findAndReplaceSidebar(): void {
    // First, find the Twitter right sidebar to replace
    const tryToReplaceSidebar = (attempt = 0) => {
      if (attempt >= 10) {
        console.log('Sozu: Failed to replace sidebar after multiple attempts');
        return;
      }
      
      // Find the right sidebar element
      // This selector targets the right sidebar section
      const rightSidebar = document.querySelector('[data-testid="sidebarColumn"]');
      
      if (!rightSidebar) {
        // If sidebar not found, retry after delay with exponential backoff
        const delay = Math.min(2000, 500 * Math.pow(1.5, attempt));
        console.log(`Sozu: Right sidebar not found, retrying in ${delay}ms`);
        setTimeout(() => tryToReplaceSidebar(attempt + 1), delay);
        return;
      }
      
      // If we've already replaced the sidebar, don't do it again
      if (this.sidebarReplaced) {
        console.log('Sozu: Sidebar already replaced');
        return;
      }
      
      // Create our wallet container
      this.walletContainer = document.createElement('div');
      this.walletContainer.className = 'sozu-wallet-container';
      
      // Render the wallet UI
      this.renderWalletUI();
      
      // Save the original sidebar content for later if needed
      const originalContent = rightSidebar.innerHTML;
      
      // Clear the sidebar and insert our wallet
      rightSidebar.innerHTML = '';
      rightSidebar.appendChild(this.walletContainer);
      
      // Mark as replaced
      this.sidebarReplaced = true;
      
      console.log('Sozu: Sidebar successfully replaced with wallet');
      
      // Also watch for page changes to re-inject if needed
      this.observePageChanges();
    };
    
    // Start the process
    tryToReplaceSidebar();
  }

  private injectTrendingWidget(): void {
    // Find the trending section to inject our widget into
    const tryToInjectTrending = (attempt = 0) => {
      if (attempt >= 10) {
        console.log('Sozu: Failed to inject trending widget after multiple attempts');
        return;
      }
      
      // Target the "What's happening" or "Trending" section
      // This matches the section you provided in your example
      const trendingSection = document.querySelector('.css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x');
      
      if (!trendingSection) {
        // If trending section not found, retry after delay
        const delay = Math.min(2000, 500 * Math.pow(1.5, attempt));
        console.log(`Sozu: Trending section not found, retrying in ${delay}ms`);
        setTimeout(() => tryToInjectTrending(attempt + 1), delay);
        return;
      }
      
      // If we've already injected the trending widget, don't do it again
      if (this.trendingInjected) {
        console.log('Sozu: Trending widget already injected');
        return;
      }
      
      // Create our trending widget container
      const trendingWidget = document.createElement('div');
      trendingWidget.className = 'sozu-trending-widget-container';
      
      // Add the widget content
      let content = trendingWidgetHtml
        .replace('{{extensionIconUrl}}', chrome.runtime.getURL('assets/images/sozu-logo.png'));
      
      trendingWidget.innerHTML = content;
      
      // Find the right position to insert our widget
      // Usually at the beginning of the trending section
      const firstItem = trendingSection.querySelector('div[role="heading"]')?.parentElement?.parentElement;
      
      if (firstItem) {
        // Insert after the header
        firstItem.insertAdjacentElement('afterend', trendingWidget);
        
        // Mark as injected
        this.trendingInjected = true;
        
        console.log('Sozu: Trending widget successfully injected');
        
        // Add event listener for "View All Prices" button
        const viewAllButton = trendingWidget.querySelector('.sozu-trending-view-all');
        if (viewAllButton) {
          viewAllButton.addEventListener('click', () => this.handleViewAllPrices());
        }
      } else {
        // If we couldn't find the right position, retry
        const delay = Math.min(2000, 500 * Math.pow(1.5, attempt));
        console.log(`Sozu: Could not find position for trending widget, retrying in ${delay}ms`);
        setTimeout(() => tryToInjectTrending(attempt + 1), delay);
      }
    };
    
    // Start the process
    tryToInjectTrending();
  }

  private handleViewAllPrices(): void {
    console.log('Sozu: View All Prices clicked');
    // If sidebar is replaced with wallet, switch to tokens section
    if (this.sidebarReplaced && this.walletContainer) {
      this.switchSection('wallet');
      this.showToast('Viewing all token prices in wallet');
    } else {
      // Otherwise show a notification
      this.showToast('To view all prices, check out the Sozu Wallet');
    }
  }

  private observePageChanges(): void {
    // Watch for URL changes (Twitter is a SPA)
    let lastUrl = location.href;
    
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('Sozu: URL changed, checking sidebar');
        
        // Reset the flags so we'll try replacing/injecting again
        this.sidebarReplaced = false;
        this.trendingInjected = false;
        
        // Try replacing the sidebar after a short delay to allow Twitter to render
        setTimeout(() => {
          this.findAndReplaceSidebar();
          this.injectTrendingWidget();
        }, 1000);
      }
    });
    
    observer.observe(document, { subtree: true, childList: true });
  }

  private renderWalletUI(): void {
    if (!this.walletContainer) return;

    this.walletContainer.innerHTML = `
      <div class="sozu-embedded-header">
        <div class="sozu-app-title">
          <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="Sozu Wallet" />
          <span>Sozu Wallet</span>
        </div>
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
                  <div>1,280.42</div>
                  <div class="sozu-token-price">$1,800.00</div>
                </div>
              </div>
              <div class="sozu-token-item">
                <div class="sozu-token-info">
                  <div class="sozu-token-icon">USDC</div>
                  <div class="sozu-token-details">
                    <div class="sozu-token-name">USD Coin</div>
                    <div class="sozu-token-ticker">USDC</div>
                  </div>
                </div>
                <div class="sozu-token-value">
                  <div>2,450.00</div>
                  <div class="sozu-token-price">$2,450.00</div>
                </div>
              </div>
              <div class="sozu-token-item">
                <div class="sozu-token-info">
                  <div class="sozu-token-icon">LINK</div>
                  <div class="sozu-token-details">
                    <div class="sozu-token-name">Chainlink</div>
                    <div class="sozu-token-ticker">LINK</div>
                  </div>
                </div>
                <div class="sozu-token-value">
                  <div>75.00</div>
                  <div class="sozu-token-price">$870.75</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- NFTs Section -->
        <div class="sozu-section ${this.currentSection === 'nfts' ? 'active' : ''}" id="nfts-section">
          <div class="sozu-card">
            <div class="sozu-tokens-header">Your NFTs</div>
            <div class="sozu-nft-grid">
              <div class="sozu-nft-card">
                <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="NFT" class="sozu-nft-image" />
                <div class="sozu-nft-details">
                  <div class="sozu-nft-name">Sozu Token #042</div>
                  <div class="sozu-nft-collection">Sozu Collection</div>
                </div>
              </div>
              <div class="sozu-nft-card">
                <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="NFT" class="sozu-nft-image" />
                <div class="sozu-nft-details">
                  <div class="sozu-nft-name">Sozu Token #156</div>
                  <div class="sozu-nft-collection">Sozu Collection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Activity Section -->
        <div class="sozu-section ${this.currentSection === 'activity' ? 'active' : ''}" id="activity-section">
          <div class="sozu-card">
            <div class="sozu-tokens-header">Recent Activity</div>
            <div class="sozu-activity-list">
              <div class="sozu-activity-item">
                <div class="sozu-activity-icon send"></div>
                <div class="sozu-activity-details">
                  <div class="sozu-activity-title">Sent ETH</div>
                  <div class="sozu-activity-subtitle">To: 0x1234...5678</div>
                  <div class="sozu-activity-date">2 hours ago</div>
                </div>
                <div class="sozu-activity-amount">
                  <div>-0.5 ETH</div>
                  <div class="sozu-activity-price">-$900.00</div>
                </div>
              </div>
              <div class="sozu-activity-item">
                <div class="sozu-activity-icon receive"></div>
                <div class="sozu-activity-details">
                  <div class="sozu-activity-title">Received USDC</div>
                  <div class="sozu-activity-subtitle">From: 0x8765...4321</div>
                  <div class="sozu-activity-date">Yesterday</div>
                </div>
                <div class="sozu-activity-amount">
                  <div>+100 USDC</div>
                  <div class="sozu-activity-price">+$100.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tipping Section -->
        <div class="sozu-section ${this.currentSection === 'tipping' ? 'active' : ''}" id="tipping-section">
          <div class="sozu-card">
            <div class="sozu-tokens-header">Tipping History</div>
            <div class="sozu-tipping-list">
              <div class="sozu-tipping-item">
                <div class="sozu-tipping-user">
                  <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="User" class="sozu-tipping-avatar" />
                  <div class="sozu-tipping-user-details">
                    <div class="sozu-tipping-username">@elonmusk</div>
                    <div class="sozu-tipping-date">3 days ago</div>
                  </div>
                </div>
                <div class="sozu-tipping-amount">
                  <div>0.05 ETH</div>
                  <div class="sozu-tipping-usd">$90.00</div>
                </div>
              </div>
              <div class="sozu-tipping-item">
                <div class="sozu-tipping-user">
                  <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="User" class="sozu-tipping-avatar" />
                  <div class="sozu-tipping-user-details">
                    <div class="sozu-tipping-username">@vitalik</div>
                    <div class="sozu-tipping-date">1 week ago</div>
                  </div>
                </div>
                <div class="sozu-tipping-amount">
                  <div>0.1 ETH</div>
                  <div class="sozu-tipping-usd">$180.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners for tab switching
    const tabs = this.walletContainer.querySelectorAll('.sozu-nav-item');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const section = target.getAttribute('data-section');
        if (section) {
          this.switchSection(section);
        }
      });
    });
    
    // Add event listeners for buttons
    const sendButton = this.walletContainer.querySelector('.sozu-action-btn.send');
    if (sendButton) {
      sendButton.addEventListener('click', () => this.handleSend());
    }
    
    const receiveButton = this.walletContainer.querySelector('.sozu-action-btn.receive');
    if (receiveButton) {
      receiveButton.addEventListener('click', () => this.handleReceive());
    }
    
    const tipButton = this.walletContainer.querySelector('.sozu-action-btn.tip');
    if (tipButton) {
      tipButton.addEventListener('click', () => this.handleTip());
    }
  }

  private switchSection(section: string): void {
    if (!this.walletContainer) return;
    
    this.currentSection = section;
    
    // Update active tab
    const tabs = this.walletContainer.querySelectorAll('.sozu-nav-item');
    tabs.forEach(tab => {
      if (tab.getAttribute('data-section') === section) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update active section
    const sections = this.walletContainer.querySelectorAll('.sozu-section');
    sections.forEach(sectionEl => {
      if (sectionEl.id === `${section}-section`) {
        sectionEl.classList.add('active');
      } else {
        sectionEl.classList.remove('active');
      }
    });
  }

  private handleSend(): void {
    console.log('Sozu: Send button clicked');
    this.showToast('Send feature coming soon!');
  }

  private handleReceive(): void {
    console.log('Sozu: Receive button clicked');
    this.showToast('Receive feature coming soon!');
  }

  private handleTip(): void {
    console.log('Sozu: Tip button clicked');
    this.showToast('Select a tweet to tip the author!');
  }

  private showToast(message: string, isError: boolean = false): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `sozu-toast ${isError ? 'error' : ''}`;
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show the toast (with a slight delay for the animation)
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide and remove after a few seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  private observeTweetTimeline(): void {
    // Watch for tweet additions to the timeline
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Look for newly added tweet articles
          const tweetArticles = document.querySelectorAll('article[data-testid="tweet"]:not(.sozu-processed)');
          
          tweetArticles.forEach(article => {
            // Mark as processed
            article.classList.add('sozu-processed');
            
            // Add tip button to the tweet
            this.addTipButtonToTweet(article as HTMLElement);
          });
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    // Also process any existing tweets
    setTimeout(() => {
      const existingTweets = document.querySelectorAll('article[data-testid="tweet"]:not(.sozu-processed)');
      existingTweets.forEach(tweet => {
        tweet.classList.add('sozu-processed');
        this.addTipButtonToTweet(tweet as HTMLElement);
      });
    }, 2000);
  }

  private addTipButtonToTweet(tweetElement: HTMLElement): void {
    try {
      // Find the tweet actions bar
      const actionsBar = tweetElement.querySelector('[role="group"]');
      if (!actionsBar) return;
      
      // Extract author info
      const author = this.extractAuthorInfo(tweetElement);
      if (!author) return;
      
      // Check if button already exists
      if (actionsBar.querySelector('.sozu-tip-author-btn')) return;
      
      // Create the tip button
      const tipButton = document.createElement('button');
      tipButton.className = 'sozu-tip-author-btn';
      tipButton.innerHTML = `
        <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="Tip" />
        <span>Tip</span>
      `;
      
      // Add event listener
      tipButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openTipOverlay(author);
      });
      
      // Add the button to the actions bar
      actionsBar.appendChild(tipButton);
    } catch (error) {
      console.error('Sozu: Error adding tip button to tweet', error);
    }
  }

  private extractAuthorInfo(tweetElement: HTMLElement): Author | null {
    try {
      // Find the author element
      const authorElement = tweetElement.querySelector('[data-testid="User-Name"]');
      if (!authorElement) return null;
      
      // Get username
      const usernameElement = authorElement.querySelector('a[href*="/"]');
      if (!usernameElement) return null;
      const username = usernameElement.textContent?.trim().replace('@', '') || '';
      
      // Get display name
      const displayNameElement = authorElement.querySelector('a[tabindex="-1"] span');
      const displayName = displayNameElement?.textContent?.trim() || '';
      
      // Get avatar URL
      const avatarElement = tweetElement.querySelector('img[src*="profile_images"]');
      const avatarUrl = avatarElement?.getAttribute('src') || '';
      
      // Get tweet ID from URL or data attribute
      let tweetId = '';
      const tweetLink = tweetElement.querySelector('a[href*="/status/"]');
      if (tweetLink) {
        const href = tweetLink.getAttribute('href') || '';
        const match = href.match(/\/status\/(\d+)/);
        if (match && match[1]) {
          tweetId = match[1];
        }
      }
      
      return {
        username,
        displayName,
        avatarUrl,
        tweetId
      };
    } catch (error) {
      console.error('Sozu: Error extracting author info', error);
      return null;
    }
  }

  private openTipOverlay(author: Author): void {
    // Create the overlay if it doesn't exist
    if (!this.tippingOverlay) {
      this.tippingOverlay = document.createElement('div');
      document.body.appendChild(this.tippingOverlay);
    }
    
    // Set current author
    this.currentAuthor = author;
    
    // Update the overlay content
    let content = tippingTemplateHtml
      .replace('{{extensionIconUrl}}', chrome.runtime.getURL('assets/images/sozu-logo.png'))
      .replace('{{authorUsername}}', author.username);
    
    // Add it to the DOM
    this.tippingOverlay.innerHTML = content;
    
    // Update USD value
    const amountInput = this.tippingOverlay.querySelector('.sozu-twitter-tipping-amount') as HTMLInputElement;
    const usdValueElement = this.tippingOverlay.querySelector('.sozu-twitter-tipping-usd-value');
    
    if (amountInput && usdValueElement) {
      // Set initial value
      amountInput.value = this.currentTipAmount.toString();
      usdValueElement.textContent = `≈ $${(this.currentTipAmount * this.ethPrice).toFixed(2)} USD`;
      
      // Update when value changes
      amountInput.addEventListener('input', () => {
        const amount = parseFloat(amountInput.value) || 0;
        this.currentTipAmount = amount;
        usdValueElement.textContent = `≈ $${(amount * this.ethPrice).toFixed(2)} USD`;
      });
    }
    
    // Add event listeners
    const closeButton = this.tippingOverlay.querySelector('.sozu-twitter-tipping-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.closeTipOverlay());
    }
    
    const sendButton = this.tippingOverlay.querySelector('.sozu-twitter-tipping-send-btn');
    if (sendButton) {
      sendButton.addEventListener('click', () => this.sendTip());
    }
    
    // Close on background click
    this.tippingOverlay.addEventListener('click', (e) => {
      if (e.target === this.tippingOverlay) {
        this.closeTipOverlay();
      }
    });
  }

  private closeTipOverlay(): void {
    if (this.tippingOverlay && this.tippingOverlay.parentNode) {
      this.tippingOverlay.parentNode.removeChild(this.tippingOverlay);
      this.tippingOverlay = null;
    }
  }

  private sendTip(): void {
    // In a real implementation, this would call to your wallet's API
    console.log(`Sending ${this.currentTipAmount} ETH to @${this.currentAuthor?.username}`);
    
    // Show success message
    this.showToast(`Tipped ${this.currentTipAmount} ETH to @${this.currentAuthor?.username}!`);
    
    // Close the overlay
    this.closeTipOverlay();
  }
} 