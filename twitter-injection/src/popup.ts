// Sozu Wallet Popup UI Script

// Mock wallet data for demonstration
const walletData = {
  address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  balance: {
    eth: 0.125,
    mnt: 15.75
  },
  nfts: [
    { id: 123, name: 'Twitter Agent #123', collection: 'Twitter Agents' }
  ]
};

// Initialize wallet UI
function initializeWallet() {
  // Display the shortened wallet address
  const addressElement = document.querySelector('.account-address');
  if (addressElement) {
    const shortenedAddress = shortenAddress(walletData.address);
    addressElement.textContent = shortenedAddress;
    
    // Make address clickable to copy
    addressElement.addEventListener('click', () => {
      navigator.clipboard.writeText(walletData.address)
        .then(() => {
          showToast('Address copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy address: ', err);
        });
    });
  }
  
  // Update ETH balance
  const balanceElement = document.querySelector('.account-balance');
  if (balanceElement) {
    balanceElement.textContent = `${walletData.balance.eth} ETH`;
  }
  
  // Update asset values
  const ethAsset = document.querySelector('.asset-item:nth-child(1) .asset-balance');
  if (ethAsset) {
    ethAsset.textContent = `${walletData.balance.eth} ETH`;
  }
  
  const mntAsset = document.querySelector('.asset-item:nth-child(2) .asset-balance');
  if (mntAsset) {
    mntAsset.textContent = `${walletData.balance.mnt} MNT`;
  }
  
  // Add event listeners to buttons
  setupButtons();
}

// Shorten wallet address for display
function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Set up button event listeners
function setupButtons() {
  const sendButton = document.querySelector('button.secondary');
  if (sendButton) {
    sendButton.addEventListener('click', () => {
      alert('Send functionality will be implemented in a future version');
    });
  }
  
  const receiveButton = document.querySelector('button:not(.secondary)');
  if (receiveButton) {
    receiveButton.addEventListener('click', () => {
      alert(`Your wallet address is: ${walletData.address}`);
    });
  }
}

// Show a toast notification
function showToast(message: string) {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = '#1d9bf0';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '9999px';
  toast.style.zIndex = '9999';
  toast.textContent = message;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease-out';
    
    // Remove from DOM after fade
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWallet); 