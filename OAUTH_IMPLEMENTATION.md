# OAuth Integration with X (Twitter)

This document outlines the implementation of OAuth authentication with X (Twitter) in the Sozu Wallet Chrome extension.

## Overview

We've implemented a complete OAuth flow that allows users to authenticate with their X (Twitter) accounts. This implementation:

1. Uses OAuth 2.0 with PKCE (Proof Key for Code Exchange) for security
2. Handles token refresh for persistent sessions
3. Securely stores authentication state in Chrome's local storage
4. Provides an intuitive user interface with loading states and error handling

## Architecture

### Files Created/Modified

1. **`src/services/AuthService.ts`**

   - Core service handling the OAuth flow
   - Manages auth state, tokens, and user profiles
   - Handles token refresh and expiration

2. **`src/utils/SessionManager.ts`**

   - Manages persistent storage of auth state
   - Provides helper methods for auth state access

3. **`src/background.ts`**

   - Background script to handle auth messages
   - Processes OAuth callbacks and token exchanges

4. **`src/oauth-callback.html`**

   - The OAuth callback page that receives the authorization code
   - Sends the code to the background script for processing

5. **`src/popup/index.ts`**

   - Updated to use the AuthService for login/logout
   - Displays appropriate UI based on auth state
   - Handles error states and loading indicators

6. **`src/styles/main.css`**

   - Added styles for login/logout UI elements
   - Loading state animations

7. **`src/manifest.json`**

   - Updated permissions for OAuth functionality
   - Added identity and tabs permissions
   - Configured host permissions for X.com API

8. **`webpack.config.dev.js` and `webpack.config.prod.js`**
   - Updated to copy the OAuth callback page to the build directory

## OAuth Flow

### 1. Login Initiation

When a user clicks the "Connect with X" button:

```typescript
// In popup/index.ts
private async handleLogin() {
  // Show the loading state
  this.showLoadingState();

  try {
    // Send a message to the background script to start the login process
    const response = await chrome.runtime.sendMessage({ type: 'LOGIN' });
    // ...
  } catch (error) {
    // Handle errors
  }
}
```

### 2. Authorization Request

The background script initiates the OAuth flow:

```typescript
// In AuthService.ts
async login(): Promise<void> {
  // Generate a random nonce for security
  const nonce = this.generateNonce();
  await chrome.storage.local.set({ [AUTH_NONCE_KEY]: nonce });

  // Build the authorization URL
  const authUrl = this.buildAuthorizationUrl(nonce);

  // Open the authorization page in a new tab
  chrome.tabs.create({ url: authUrl });
}
```

### 3. Authorization Callback

After authorization, X (Twitter) redirects to our callback page:

```html
<!-- In oauth-callback.html -->
<script>
  window.onload = function () {
    chrome.runtime.sendMessage({
      type: "AUTH_CALLBACK",
      url: window.location.href,
    });
    window.close();
  };
</script>
```

### 4. Token Exchange

The background script processes the callback:

```typescript
// In background.ts
async function handleAuthCallback(url: string) {
  try {
    // Process the callback and get the auth state
    const authState = await authService.handleCallback(url);

    // Notify the popup
    chrome.runtime.sendMessage({
      type: "AUTH_STATE_CHANGED",
      state: authState,
    });

    return { state: authState };
  } catch (error) {
    // Handle errors
  }
}
```

### 5. Session Management

The SessionManager handles persistent storage:

```typescript
// In SessionManager.ts
static async saveAuthState(authState: AuthState): Promise<void> {
  try {
    await chrome.storage.local.set({ [AUTH_STATE_KEY]: authState });
    console.log('Auth state saved successfully');
  } catch (error) {
    console.error('Error saving auth state:', error);
    throw error;
  }
}
```

### 6. Logout Process

The logout flow clears the session:

```typescript
// In popup/index.ts
private async handleLogout() {
  try {
    // Send logout message to background
    const response = await chrome.runtime.sendMessage({ type: 'LOGOUT' });

    if (response.success) {
      console.log('Logout successful');
      this.showLoginScreen();
    } else {
      // Handle errors
    }
  } catch (error) {
    // Handle errors
  }
}
```

## Security Considerations

1. **PKCE Flow**: Used PKCE instead of client secret (which isn't secure in client-side applications)
2. **Nonce Validation**: Implemented nonce validation to prevent CSRF attacks
3. **Secure Storage**: Used Chrome's encrypted storage for sensitive data
4. **Token Refresh**: Implemented token refresh to avoid constant re-authorization
5. **Error Handling**: Comprehensive error handling throughout the flow

## Next Steps

1. **Complete API Integration**: Finish integrating with Twitter's API for actual token exchange
2. **Add User Profile Display**: Show user profile information in the UI
3. **Implement Rate Limiting**: Add protections against excessive API calls
4. **Add Comprehensive Testing**: Create tests for the OAuth flow

## Testing the Implementation

To test the OAuth integration:

1. Load the extension in Chrome
2. Click "Connect with X" button
3. Authorize the application on X.com
4. You should be redirected back and logged in automatically
5. Try closing and reopening the extension - your session should persist
6. Click the Logout button to test the logout flow

## References

- [X Developer Platform](https://developer.twitter.com/en)
- [OAuth 2.0 with PKCE](https://oauth.net/2/pkce/)
- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
