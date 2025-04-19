/// <reference types="chrome"/>/**
 * Twitter OAuth 2.0 Configuration
 * 
 * For development, you'll need to:
 * 1. Create a free Twitter Developer account at developer.twitter.com
 * 2. Create a project and app with OAuth 2.0 enabled
 * 3. Set the callback URL to match your Chrome extension:
 *    chrome-extension://[YOUR-EXTENSION-ID]/oauth-callback.html
 * 4. Add your Twitter Client ID and Client Secret to your .env file
 * 
 * These environment variables should be loaded during the build process.
 * For local testing, you can use a basic account with minimal API access.
 */
export const twitterConfig = {
  clientId: process.env.TWITTER_CLIENT_ID || '',
  clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  
  // This uses Chrome's identity API to generate the proper redirect URL
  // The parameter 'twitter-auth' should match your OAuth callback path
  redirectUri: chrome.identity.getRedirectURL('twitter-auth'),
  
  // Required scopes for user authentication and wallet creation
  scopes: [
    'tweet.read',    // For future social features
    'users.read',    // To get the user's Twitter profile
    'offline.access' // For persistent authentication
  ],
  
  // Twitter API endpoints for OAuth 2.0
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token'
}; 