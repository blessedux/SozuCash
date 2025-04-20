/// <reference types="chrome"/>/// <reference types="chrome"/>

/**
 * Background script for SozuCash Wallet extension
 * Handles Twitter OAuth authentication and communication between components
 */

import { blockchainService, walletManager, secureStorage } from '../services/wallet';
import type { Wallet } from '../services/wallet';

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
      
      // Get username from Twitter API (mock for now)
      const twitterUsername = "twitter_user"; // This would come from the API
      
      // Store username
      chrome.storage.local.set({ twitterUsername });
      
      // Notify any waiting tabs
      chrome.storage.local.get(['callerTabId'], (result) => {
        if (result.callerTabId) {
          chrome.tabs.sendMessage(result.callerTabId, {
            type: 'OAUTH_COMPLETE',
            success: true,
            username: twitterUsername
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
  
  // Get wallets for a user
  if (message.type === 'GET_WALLETS') {
    const { username, password } = message;
    
    // Validate input
    if (!username) {
      sendResponse({ success: false, error: 'Username is required' });
      return true;
    }
    
    // If password provided, try to get wallets from secure storage
    if (password) {
      secureStorage.getWallets(username, password)
        .then(wallets => {
          // Convert to public wallet objects (without private keys)
          const publicWallets: Wallet[] = wallets.map(w => ({
            address: w.address,
            name: w.name,
            balance: w.balance,
            twitterUsername: w.twitterUsername,
            networkId: w.networkId,
            isImported: w.isImported,
            created: w.created
          }));
          
          sendResponse({ success: true, wallets: publicWallets });
        })
        .catch(error => {
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to get wallets' 
          });
        });
    } else {
      // Without password, return empty wallets
      sendResponse({ success: true, wallets: [] });
    }
    
    return true; // Keep channel open for async response
  }
  
  // Import a wallet
  if (message.type === 'IMPORT_WALLET') {
    const { username, address, password } = message;
    
    // Validate input
    if (!username || !address || !password) {
      sendResponse({ 
        success: false, 
        error: 'Username, address and password are required' 
      });
      return true;
    }
    
    try {
      // Imported wallets don't have private keys
      secureStorage.saveWallet(username, {
        address,
        name: `${username}'s Imported Wallet`,
        privateKey: '', // No private key for imported wallets
        twitterUsername: username,
        balance: '0',
        created: Date.now(),
        networkId: 'mantle',
        isImported: true
      }, password)
        .then(() => {
          sendResponse({
            success: true,
            wallet: {
              address,
              name: `${username}'s Imported Wallet`,
              twitterUsername: username,
              balance: '0',
              created: Date.now(),
              networkId: 'mantle',
              isImported: true
            }
          });
        })
        .catch(error => {
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to import wallet' 
          });
        });
    } catch (error) {
      sendResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to import wallet' 
      });
    }
    
    return true; // Keep channel open for async response
  }
  
  // Create a new wallet
  if (message.type === 'CREATE_WALLET') {
    const { username, password, name } = message;
    
    // Validate input
    if (!username || !password) {
      sendResponse({ 
        success: false, 
        error: 'Username and password are required' 
      });
      return true;
    }
    
    try {
      // Create a new wallet
      const { wallet, privateKey } = blockchainService.createWallet(username);
      
      // Set custom name if provided
      if (name) {
        wallet.name = name;
      }
      
      // Save to secure storage
      secureStorage.saveWallet(username, {
        ...wallet,
        privateKey
      }, password)
        .then(() => {
          // Return public wallet info (without private key)
          sendResponse({
            success: true,
            wallet: {
              address: wallet.address,
              name: wallet.name,
              twitterUsername: wallet.twitterUsername,
              balance: wallet.balance,
              created: wallet.created,
              networkId: wallet.networkId,
              isImported: wallet.isImported
            }
          });
        })
        .catch(error => {
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to save wallet' 
          });
        });
    } catch (error) {
      sendResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create wallet' 
      });
    }
    
    return true; // Keep channel open for async response
  }
  
  // Get balance for an address
  if (message.type === 'GET_BALANCE') {
    const { address, networkId } = message;
    
    // Validate address
    if (!address) {
      sendResponse({ success: false, error: 'Address is required' });
      return true;
    }
    
    blockchainService.getBalance(address, networkId || 'mantle')
      .then(balance => {
        sendResponse({ success: true, balance });
      })
      .catch(error => {
        sendResponse({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to get balance' 
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