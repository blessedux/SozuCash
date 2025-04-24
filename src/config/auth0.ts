/// <reference types="chrome"/>

// Simplified Auth0 config - not actually used in the simplified version
// but kept to prevent import errors
export const Auth0Config = {
  clientId: 'YOUR_AUTH0_CLIENT_ID',
  audience: 'https://auth0-api-audience',
  redirectUri: 'chrome-extension://YOUR_EXTENSION_ID/oauth-callback.html',
  scope: 'openid profile email',
  cacheLocation: 'localStorage',
  useRefreshTokens: true,
  connection: 'twitter'
};

export default Auth0Config; 