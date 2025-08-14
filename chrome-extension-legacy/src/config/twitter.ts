/// <reference types="chrome"/>

/**
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
export const TwitterConfig = {
  // Replace these with your own Twitter API credentials
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  callbackUrl: 'chrome-extension://YOUR_EXTENSION_ID/oauth-callback.html',
  // Add these new properties
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token',
  redirectUri: 'chrome-extension://YOUR_EXTENSION_ID/oauth-callback.html',
  scopes: ['tweet.read', 'users.read', 'offline.access']
};

export default TwitterConfig; 