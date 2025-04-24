/// <reference types="chrome"/>export const auth0Config = {
domain: process.env.AUTH0_DOMAIN || '',
    clientId;
process.env.AUTH0_CLIENT_ID || '',
    audience;
process.env.AUTH0_AUDIENCE || '',
    redirectUri;
chrome.identity.getRedirectURL('oauth-callback.html'),
    scope;
'openid profile email',
    cacheLocation;
'memory',
    useRefreshTokens;
true,
    connection;
'twitter';
;
