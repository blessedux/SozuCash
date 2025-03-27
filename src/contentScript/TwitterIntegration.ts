/**
 * TwitterIntegration.ts
 * Handles Twitter/X specific integration for Sozu Wallet
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

import './twitter-styles.css';

interface Author {
  username: string;
  displayName: string;
  avatarUrl: string;
  tweetId: string;
}

export class TwitterIntegration {
  private tippingOverlay: HTMLElement | null = null;
  private currentTipAmount: number = 0.01;
  private currentAuthor: Author | null = null;
  private ethPrice: number = 1800; // Default ETH price in USD

  constructor() {
    // Initialize integration
    this.init();
  }

  private init(): void {
    // Fetch the current ETH price
    this.fetchEthPrice();
    
    // Start observing Twitter DOM for tweets
    this.observeTwitterTimeline();
  }

  private fetchEthPrice(): void {
    // In a production app, you would fetch this from a price API
    // For this demo, we'll use a hardcoded value
    // TODO: Implement actual price fetching
    this.ethPrice = 1800;
  }

  private observeTwitterTimeline(): void {
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
        // Check for existing tweets right away
        this.findAndEnhanceTweets();
      } else {
        setTimeout(startObserving, 1000);
      }
    };

    startObserving();
  }

  private findAndEnhanceTweets(): void {
    // Find all tweet action groups that don't have our tip button
    const tweetActions = document.querySelectorAll('[data-testid="tweet"] [role="group"]:not(.sozu-enhanced)');
    
    tweetActions.forEach(actionGroup => {
      // Mark as enhanced to avoid processing it again
      actionGroup.classList.add('sozu-enhanced');
      
      try {
        // Get tweet and author information
        const tweetEl = actionGroup.closest('[data-testid="tweet"]');
        if (!tweetEl) return;
        
        const tweetId = this.extractTweetId(tweetEl);
        const authorInfo = this.extractAuthorInfo(tweetEl);
        
        if (!authorInfo || !tweetId) return;
        
        // Create the tip button
        const tipButton = document.createElement('div');
        tipButton.className = 'sozu-tip-author-btn';
        tipButton.innerHTML = `
          <img src="${chrome.runtime.getURL('assets/images/sozu-logo.png')}" alt="Tip" />
          <span>Tip</span>
        `;
        
        // Add the button to the action group
        actionGroup.appendChild(tipButton);
        
        // Add click event to open tipping overlay
        tipButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          this.currentAuthor = {
            username: authorInfo.username,
            displayName: authorInfo.displayName,
            avatarUrl: authorInfo.avatarUrl,
            tweetId: tweetId
          };
          
          this.showTippingOverlay(this.currentAuthor);
        });
      } catch (error) {
        console.error('Error enhancing tweet:', error);
      }
    });
  }

  private extractTweetId(tweetEl: Element): string | null {
    try {
      // Try to find the tweet ID from the article's aria-labelledby or other attributes
      const tweetLink = tweetEl.querySelector('a[href*="/status/"]');
      if (tweetLink) {
        const href = tweetLink.getAttribute('href');
        if (href) {
          const match = href.match(/\/status\/(\d+)/);
          if (match && match[1]) {
            return match[1];
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting tweet ID:', error);
      return null;
    }
  }

  private extractAuthorInfo(tweetEl: Element): { username: string; displayName: string; avatarUrl: string } | null {
    try {
      // Find author username and display name
      const userElement = tweetEl.querySelector('[data-testid="User-Name"]');
      if (!userElement) return null;
      
      const displayNameEl = userElement.querySelector('span');
      const usernameEl = userElement.querySelector('div:last-child span');
      
      if (!displayNameEl || !usernameEl) return null;
      
      const displayName = displayNameEl.textContent || 'Unknown';
      // Username typically has @ at the beginning
      let username = usernameEl.textContent || '';
      username = username.startsWith('@') ? username.substring(1) : username;
      
      // Find avatar
      const avatarEl = tweetEl.querySelector('[data-testid="Tweet-User-Avatar"] img');
      const avatarUrl = avatarEl ? avatarEl.getAttribute('src') || '' : '';
      
      return { username, displayName, avatarUrl };
    } catch (error) {
      console.error('Error extracting author info:', error);
      return null;
    }
  }

  private showTippingOverlay(author: Author): void {
    // Create overlay if it doesn't exist
    if (!this.tippingOverlay) {
      this.tippingOverlay = document.createElement('div');
      document.body.appendChild(this.tippingOverlay);
    }
    
    // Calculate USD value based on ETH amount
    const usdValue = (this.currentTipAmount * this.ethPrice).toFixed(2);
    
    // Populate the template
    const template = tippingTemplateHtml
      .replace('{{extensionIconUrl}}', chrome.runtime.getURL('assets/images/sozu-logo.png'))
      .replace('{{authorUsername}}', author.username)
      .replace('{{usdValue}}', usdValue);
    
    this.tippingOverlay.innerHTML = template;
    
    // Setup event listeners
    this.setupTippingOverlayEvents(this.tippingOverlay);
    
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
  }

  private setupTippingOverlayEvents(overlay: HTMLElement): void {
    // Close button
    const closeBtn = overlay.querySelector('.sozu-twitter-tipping-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeTippingOverlay());
    }
    
    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeTippingOverlay();
      }
    });
    
    // Amount input
    const amountInput = overlay.querySelector('.sozu-twitter-tipping-amount') as HTMLInputElement;
    if (amountInput) {
      amountInput.value = this.currentTipAmount.toString();
      amountInput.addEventListener('input', (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        if (!isNaN(value)) {
          this.currentTipAmount = value;
          // Update USD value
          const usdValueEl = overlay.querySelector('.sozu-twitter-tipping-usd-value');
          if (usdValueEl) {
            usdValueEl.textContent = `≈ $${(value * this.ethPrice).toFixed(2)} USD`;
          }
        }
      });
    }
    
    // Send tip button
    const sendBtn = overlay.querySelector('.sozu-twitter-tipping-send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.processTip());
    }
  }

  private closeTippingOverlay(): void {
    if (this.tippingOverlay) {
      document.body.removeChild(this.tippingOverlay);
      this.tippingOverlay = null;
    }
    
    // Restore scrolling
    document.body.style.overflow = '';
  }

  private processTip(): void {
    if (!this.currentAuthor) return;
    
    // Get message if any
    const messageEl = this.tippingOverlay?.querySelector('.sozu-twitter-tipping-message-input') as HTMLTextAreaElement;
    const message = messageEl?.value || '';
    
    // Show loading state
    const sendBtn = this.tippingOverlay?.querySelector('.sozu-twitter-tipping-send-btn');
    if (sendBtn) {
      sendBtn.innerHTML = '<span class="sozu-loading-spinner"></span> Processing...';
      sendBtn.setAttribute('disabled', 'true');
    }
    
    // In a real app, you would call your backend API to process the tip
    // For this demo, we'll simulate the process
    setTimeout(() => {
      this.closeTippingOverlay();
      
      // Show success toast
      this.showToast(`Successfully tipped ${this.currentTipAmount} ETH to @${this.currentAuthor?.username}!`, 'success');
      
      // Reset current author
      this.currentAuthor = null;
    }, 2000);
  }

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `sozu-toast ${type}`;
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 5000);
  }
}

export default TwitterIntegration; 