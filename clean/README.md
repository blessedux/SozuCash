# SozuCash Wallet Browser Extension

SozuCash Wallet is a Chrome extension that integrates with Twitter/X to provide a seamless Web3 wallet experience. The extension allows users to authenticate with their Twitter accounts and automatically generates EVM-compatible wallets for them.

## Features

- **Twitter/X OAuth Authentication**: Securely sign in using your Twitter account
- **EVM-Compatible Wallet Generation**: Each Twitter account can have multiple wallets
- **Mantle Network Support**: Send and receive MNT tokens on Mantle Network
- **Twitter Integration**: Injected wallet UI within Twitter's interface
- **Secure Key Management**: Private keys are stored locally and securely

## Project Structure

```
/src
  /background      # Background scripts for extension functionality
  /content         # Content scripts for Twitter UI integration
  /popup           # UI for the extension popup
  /services        # Service classes for auth, blockchain, etc.
  /utils           # Utility functions and helpers
  /types           # TypeScript type definitions
  /assets          # Images, icons, etc.
  /styles          # CSS files
  manifest.json    # Extension manifest
```

## Development Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set up your Twitter API credentials:

   - Create a Twitter Developer account at [developer.twitter.com](https://developer.twitter.com)
   - Create a new project and app with OAuth 2.0 authentication
   - Add `chrome-extension://[YOUR-EXTENSION-ID]/src/oauth-callback.html` as an allowed callback URL
   - Add your Client ID to the manifest.json file

3. Development mode:

   ```
   npm run dev
   ```

4. Build for production:

   ```
   npm run build
   ```

5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder from your project directory

## Usage

1. Click on the SozuCash extension icon in your browser toolbar
2. Click "Connect with X" to authenticate with your Twitter account
3. Authorize the application when prompted by Twitter
4. A new EVM wallet will be automatically generated for your Twitter account
5. Navigate to Twitter to see the wallet integration in action!

## License

This project is licensed under the MIT License.
