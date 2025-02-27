export const auth0Config = {
  domain: 'your-auth0-domain.auth0.com',
  clientId: 'your-auth0-client-id',
  audience: 'your-api-identifier',
  redirectUri: chrome.runtime.getURL('popup.html'),
  scope: 'openid profile email',
  connection: 'twitter'  // Specify Twitter as the connection
}; 