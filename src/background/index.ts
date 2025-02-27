import { createAuth0Client } from '@auth0/auth0-spa-js';
import { auth0Config } from '../config/auth0';

let auth0Client: any = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUTH0_LOGIN') {
    handleTwitterLogin().then(sendResponse);
    return true;
  }
  if (message.type === 'AUTH0_LOGOUT') {
    handleAuth0Logout().then(sendResponse);
    return true;
  }
});

async function initAuth0() {
  if (!auth0Client) {
    auth0Client = await createAuth0Client({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }
    });
  }
  return auth0Client;
}

async function handleAuth0Login() {
  try {
    const auth0 = await initAuth0();
    
    // Start login flow
    await auth0.loginWithPopup({
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri,
      }
    });

    // Get user info and token
    const user = await auth0.getUser();
    const token = await auth0.getTokenSilently();

    // Store in extension storage
    await chrome.storage.local.set({ 
      user,
      token,
      isAuthenticated: true 
    });

    return { success: true, user };
  } catch (error) {
    console.error('Auth0 login failed:', error);
    return { success: false, error };
  }
}

async function handleAuth0Logout() {
  try {
    const auth0 = await initAuth0();
    await auth0.logout();
    await chrome.storage.local.clear();
    return { success: true };
  } catch (error) {
    console.error('Auth0 logout failed:', error);
    return { success: false, error };
  }
}

async function handleTwitterLogin() {
  try {
    const auth0 = await createAuth0Client({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri,
        connection: 'twitter'
      }
    });

    await auth0.loginWithPopup();
    const user = await auth0.getUser();
    const token = await auth0.getTokenSilently();

    // Store user info
    await chrome.storage.local.set({ 
      user,
      token,
      isAuthenticated: true 
    });

    return { success: true, user };
  } catch (error) {
    console.error('Twitter login failed:', error);
    return { success: false, error };
  }
}

console.log('Background script loaded') 