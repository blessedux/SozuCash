export const twitterConfig = {
  clientId: process.env.TWITTER_CLIENT_ID || '',
  clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  redirectUri: chrome.identity.getRedirectURL('twitter-auth'),
  scopes: [
    'tweet.read',
    'users.read',
    'offline.access'
  ],
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token'
}; 