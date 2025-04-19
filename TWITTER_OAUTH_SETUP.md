# Setting Up Twitter OAuth for SozuCash Wallet

This guide walks you through the process of setting up Twitter OAuth 2.0 for the SozuCash Wallet extension.

## 1. Create a Twitter Developer Account

1. Visit [developer.twitter.com](https://developer.twitter.com) and sign in with your Twitter account
2. Apply for a developer account if you don't already have one
3. You can choose the "Basic" free tier which is sufficient for OAuth authentication

## 2. Create a New Project and App

1. In the Twitter Developer Portal, navigate to "Projects & Apps" > "Create Project"
2. Give your project a name like "SozuCash Wallet"
3. Select "Web App, Automated App or Bot" as the use case
4. Complete the project creation process
5. Create a new app within this project

## 3. Configure OAuth 2.0 Settings

1. In your app settings, navigate to the "Authentication settings" section
2. Enable OAuth 2.0
3. Set the Type of App to "Web App, Automated App or Bot"
4. Add Callback URLs:

   ```
   chrome-extension://[YOUR-EXTENSION-ID]/oauth-callback.html
   ```

   - Replace `[YOUR-EXTENSION-ID]` with your actual extension ID from Chrome
   - You can find your extension ID in `chrome://extensions` after loading the unpacked extension

5. Set Website URL (can be your GitHub repo or personal website)
6. Enable "Request email from users" if you need email access
7. Save your settings

## 4. Get Your API Keys

1. Navigate to the "Keys and tokens" tab of your app
2. Note your "OAuth 2.0 Client ID" and "Client Secret"
3. Keep these secure and never commit them to public repositories

## 5. Configure the Extension

1. Create a `.env` file in the root of your project:

   ```
   TWITTER_CLIENT_ID=your_client_id_here
   TWITTER_CLIENT_SECRET=your_client_secret_here
   ```

2. Make sure the build process incorporates these environment variables into the extension

## 6. Test the Twitter OAuth Flow

1. Build your extension with `npm run build`
2. Load the extension in Chrome
3. Click "Connect with X" in the extension popup
4. You should be redirected to Twitter's authorization page
5. After authorizing, you should be redirected back to the extension

## Troubleshooting

### Error: Callback URL Mismatch

If you see an error about the callback URL not matching, ensure you:

1. Have the exact extension ID in your Twitter OAuth settings
2. Have updated the `redirectUri` in your code to match the Chrome extension

### Error: Unable to Get User Information

If authentication succeeds but you can't get user info:

1. Ensure you've requested the `users.read` scope
2. Check that your Twitter app has the necessary permissions
3. Verify your API tokens are correct

### Error: Extension ID Changed

Chrome may assign a different extension ID when reloading:

1. Create a `key` field in manifest.json to maintain a consistent extension ID
2. See [Chrome's documentation on extension IDs](https://developer.chrome.com/docs/extensions/mv3/manifest/key/) for details

## Free Tier Limitations

The Twitter API free tier should be sufficient for OAuth authentication needs. Limitations include:

- Rate limits for API calls (more than enough for development)
- Some advanced data access restrictions (not needed for basic OAuth)

## Security Considerations

- Never expose your Client Secret in client-side code
- Use PKCE (Proof Key for Code Exchange) for added security (already implemented in the extension)
- Store tokens securely in Chrome's storage API (as implemented)

## Additional Resources

- [Twitter OAuth 2.0 Documentation](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
- [Chrome Identity API Documentation](https://developer.chrome.com/docs/extensions/reference/identity/)
