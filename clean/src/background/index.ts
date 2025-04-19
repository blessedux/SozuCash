/// <reference types="chrome"/>/// <reference types="chrome"/>

/**
 * Background script for SozuCash Wallet extension
 * Handles Twitter OAuth authentication and communication between components
 */

// Constants
const TWITTER_CLIENT_ID = 'YOUR_TWITTER_CLIENT_ID'; // Replace with your actual Twitter client ID 
const REDIRECT_URL = chrome.runtime.getURL('src/oauth-callback.html');
const TWITTER_OAUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_SCOPES = ['tweet.read', 'users.read', 'offline.access'];

// State
let authTabId: number | null = null;

/**
 * Initiates the Twitter OAuth flow
 * @param senderId - ID of the sender (tab or extension)
 */
function initiateTwitterOAuth(senderId?: number): void {
  // Generate random state value for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Generate OAuth URL with PKCE
  const url = new URL(TWITTER_OAUTH_URL);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', TWITTER_CLIENT_ID);
  url.searchParams.append('redirect_uri', REDIRECT_URL);
  url.searchParams.append('scope', TWITTER_SCOPES.join(' '));
  url.searchParams.append('state', state);
  url.searchParams.append('code_challenge_method', 'S256');
  url.searchParams.append('code_challenge', 'CODE_CHALLENGE_VALUE'); // TODO: Implement actual PKCE
  
  // Store state in local storage for verification on callback
  chrome.storage.local.set({ oauthState: state });
  
  // Open OAuth window
  chrome.tabs.create({ url: url.toString() }, (tab) => {
    if (tab.id) {
      authTabId = tab.id;
      
      // If sender is a tab, remember it to return the result
      if (senderId) {
        chrome.storage.local.set({ callerTabId: senderId });
      }
    }
  });
}

/**
 * Handles the OAuth callback from Twitter
 * @param url - The callback URL containing the authorization code
 */
function handleOAuthCallback(url: string): void {
  // Parse the URL to get authorization code and state
  const urlParams = new URLSearchParams(new URL(url).search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  
  // Verify state parameter to prevent CSRF attacks
  chrome.storage.local.get(['oauthState'], (result) => {
    if (result.oauthState !== state) {
      console.error('OAuth state does not match. Possible CSRF attack.');
      return;
    }
    
    if (code) {
      // Process the authorization code
      // In a real implementation, you would exchange this code for tokens
      console.log('Received OAuth code:', code);
      
      // Store auth code for later use
      chrome.storage.local.set({ 
        twitterAuthCode: code,
        isAuthenticated: true,
        authTimestamp: Date.now()
      });
      
      // Notify any waiting tabs
      chrome.storage.local.get(['callerTabId'], (result) => {
        if (result.callerTabId) {
          chrome.tabs.sendMessage(result.callerTabId, {
            type: 'OAUTH_COMPLETE',
            success: true
          });
          
          // Clear the stored caller ID
          chrome.storage.local.remove(['callerTabId']);
        }
      });
      
      // Close the auth tab if it's still open
      if (authTabId) {
        chrome.tabs.remove(authTabId);
        authTabId = null;
      }
    }
  });
}

/**
 * Handle messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle OAuth initiation
  if (message.type === 'TWITTER_OAUTH_START') {
    // Get sender tab ID if available
    const senderId = sender.tab?.id;
    initiateTwitterOAuth(senderId);
    sendResponse({ status: 'initiating_oauth' });
    return true; // Keep channel open for async response
  }
  
  // Handle OAuth callback
  if (message.type === 'OAUTH_CALLBACK' && message.url) {
    handleOAuthCallback(message.url);
    sendResponse({ status: 'processing_callback' });
    return true;
  }
  
  // Handle authentication status check
  if (message.type === 'CHECK_AUTH_STATUS') {
    chrome.storage.local.get(['isAuthenticated', 'authTimestamp'], (result) => {
      // Check if auth is valid (not expired)
      const isAuthenticated = result.isAuthenticated;
      const authTimestamp = result.authTimestamp || 0;
      const authAge = Date.now() - authTimestamp;
      
      // Consider auth expired after 24 hours (86400000 ms)
      const isExpired = authAge > 86400000;
      
      sendResponse({
        isAuthenticated: isAuthenticated && !isExpired
      });
    });
    return true; // Keep channel open for async response
  }
});

// Listen for tab updates to capture OAuth callback
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === authTabId && changeInfo.url && changeInfo.url.startsWith(REDIRECT_URL)) {
    handleOAuthCallback(changeInfo.url);
  }
});

// Handle extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First installation
    console.log('SozuCash Wallet installed');
    
    // Open welcome page or tutorial
    chrome.tabs.create({
      url: chrome.runtime.getURL('src/popup/index.html?welcome=true')
    });
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('SozuCash Wallet updated to version', chrome.runtime.getManifest().version);
  }
});

interface TwitterWallet {
  address: string;
  privateKey: string;
  created: number;
  name: string;
  twitterUsername: string;
  isImported?: boolean;
}

// Store wallets by Twitter username -> array of wallets
interface WalletStore {
  [twitterUsername: string]: TwitterWallet[];
}

async function handleTwitterAuth(details: { twitterUsername: string }): Promise<any> {
  try {
    // Twitter OAuth 2.0 flow
    const redirectUri = chrome.identity.getRedirectURL();
    const clientId = 'YOUR_TWITTER_CLIENT_ID'; // Get from Twitter Developer Portal
    
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', 'tweet.read users.read');
    authUrl.searchParams.append('state', crypto.randomUUID());
    authUrl.searchParams.append('code_challenge', await generateCodeChallenge());
    authUrl.searchParams.append('code_challenge_method', 'S256');
    
    // Launch authentication flow - fix for responseUrl possibly undefined
    const responseUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl.toString(),
      interactive: true
    });
    
    // Add null check before creating URL
    if (!responseUrl) {
      throw new Error("Authentication failed - no response URL received");
    }
    
    // Now TypeScript knows responseUrl is defined
    const url = new URL(responseUrl);
    const code = url.searchParams.get('code');
    
    if (!code) {
      throw new Error('Authentication failed - no code received');
    }
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUri,
        'client_id': clientId,
        'code_verifier': await getStoredCodeVerifier()
      })
    });
    
    const tokens = await tokenResponse.json();
    
    // Get user details from Twitter API
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });
    
    const userData = await userResponse.json();
    const twitterUsername = userData.data.username;
    
    // Create or get wallet for user
    const wallet = await createOrGetWallet(twitterUsername);
    
    // Add null check before sending wallet data
    if (wallet) {
      // Send success to UI
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'OAUTH_COMPLETE',
            wallet: {
              address: wallet.address,
              username: twitterUsername,
              name: wallet.name
            }
          });
        }
      });
      
      return {
        username: twitterUsername,
        wallet: {
          address: wallet.address,
          name: wallet.name
        }
      };
    } else {
      // Return just the username if no wallet
      return {
        username: twitterUsername,
        wallet: null
      };
    }
    
  } catch (error) {
    console.error('Twitter Auth Error:', error);
    throw error;
  }
}

// Generate a code verifier and challenge for PKCE
async function generateCodeChallenge(): Promise<string> {
  const codeVerifier = generateRandomString(128);
  
  // Store code verifier for later token exchange
  chrome.storage.local.set({ code_verifier: codeVerifier });
  
  // Hash the code verifier to create the code challenge
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  // Fix: Use Array.from instead of spread operator
  return btoa(Array.from(new Uint8Array(digest))
    .map(b => String.fromCharCode(b))
    .join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function getStoredCodeVerifier(): Promise<string> {
  const result = await chrome.storage.local.get('code_verifier');
  return result.code_verifier;
}

function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => String.fromCharCode(b % 26 + 97))
    .join('');
}

async function createOrGetWallet(twitterUsername: string, importedAddress?: string): Promise<TwitterWallet | null> {
  // Check if user already has wallets
  const wallets = await getWallets(twitterUsername);
  
  if (wallets.length > 0) {
    // Return the first wallet if they already have one
    return wallets[0];
  }
  
  if (importedAddress) {
    // Create wallet entry with imported address
    const importedWallet: TwitterWallet = {
      address: importedAddress,
      privateKey: '', // No private key for imported wallets
      created: Date.now(),
      name: `${twitterUsername}'s Imported Wallet`,
      twitterUsername,
      isImported: true
    };
    
    // Store the imported wallet
    await storeWallet(twitterUsername, importedWallet);
    return importedWallet;
  }
  
  // No wallet yet and no import address - return null to trigger import screen
  return null;
}

async function getWallets(twitterUsername: string): Promise<TwitterWallet[]> {
  try {
    const result = await chrome.storage.local.get('wallets');
    const walletStore: WalletStore = result.wallets || {};
    return walletStore[twitterUsername] || [];
  } catch (error) {
    console.error('Error retrieving wallets:', error);
    return [];
  }
}

async function storeWallet(twitterUsername: string, wallet: TwitterWallet): Promise<void> {
  try {
    // Get current wallets
    const result = await chrome.storage.local.get('wallets');
    const walletStore: WalletStore = result.wallets || {};
    
    // Add new wallet to user's wallet array
    walletStore[twitterUsername] = walletStore[twitterUsername] || [];
    walletStore[twitterUsername].push(wallet);
    
    // Save updated wallets
    await chrome.storage.local.set({ 'wallets': walletStore });
  } catch (error) {
    console.error('Error storing wallet:', error);
    throw error;
  }
}

async function importWallet(twitterUsername: string, address: string): Promise<TwitterWallet> {
  // Validate the address
  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error('Invalid Ethereum address format');
  }
  
  // Create wallet object for the imported address
  const wallet: TwitterWallet = {
    address: address,
    privateKey: '', // No private key for imported wallets
    created: Date.now(),
    name: `${twitterUsername}'s Imported Wallet`,
    twitterUsername,
    isImported: true
  };
  
  // Store the wallet
  await storeWallet(twitterUsername, wallet);
  return wallet;
} 