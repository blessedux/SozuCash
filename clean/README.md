# SozuCash Wallet - Chrome Extension for Twitter Integration

**Version:** 1.0.0  
**Authors:** MENTE_MAESTRA Team  
**License:** MIT

## Overview

SozuCash Wallet is a lightweight, secure Chrome extension that integrates with Twitter/X to provide a seamless Web3 wallet experience. The extension allows users to authenticate with their Twitter accounts and manage EVM-compatible wallets directly within the Twitter interface.

## Goal

Our mission is to simplify cryptocurrency adoption by providing a frictionless wallet experience integrated with social media. SozuCash enables Twitter users to interact with the Mantle Network blockchain directly from their Twitter feed, eliminating the complexity typically associated with crypto wallets.

## Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Blockchain Library:** ethers.js v6
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Authentication:** Twitter OAuth 2.0
- **Secure Storage:** @metamask/browser-passworder
- **Extension Framework:** Chrome Extensions Manifest V3
- **Network Support:** Mantle Network (mainnet and testnet)

## Features

- **Twitter/X OAuth Authentication:** Securely sign in using your Twitter account
- **EVM-Compatible Wallet Management:** Create and import wallets
- **Secure Key Encryption:** All private keys are encrypted with AES-256
- **Mantle Network Integration:** Send and receive MNT tokens
- **Twitter UI Integration:** Wallet interface injected directly into Twitter's UI
- **Multi-Wallet Support:** Create multiple wallets per Twitter account
- **Transaction History:** View all your past transactions
- **Address Book:** Save and manage frequent contacts

## Project Structure

```
/src
  /background     # Background service worker for extension
  /content        # Content scripts for Twitter UI integration
  /popup          # Extension popup UI components
  /services       # Core service classes
    /wallet       # Wallet management services
  /utils          # Utility functions and helpers
  /types          # TypeScript type definitions
  /assets         # Images, icons, and static assets
  /styles         # CSS and styling files
  manifest.json   # Extension manifest configuration
```

## Installation Process

### Development Setup

1. Clone the repository:

   ```
   git clone https://github.com/your-username/sozucash.git
   cd sozucash/clean
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your Twitter API credentials:

   - Create a Twitter Developer account at [developer.twitter.com](https://developer.twitter.com)
   - Create a new project and app with OAuth 2.0 authentication
   - Add `chrome-extension://[YOUR-EXTENSION-ID]/src/oauth-callback.html` as an allowed callback URL
   - Update the `YOUR_TWITTER_CLIENT_ID` in `src/manifest.json` and `src/background/index.ts`

4. Development mode:

   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked" and select the `dist` folder from your project directory
4. The extension should now appear in your browser toolbar

### Setting Up the Extension

1. Click on the SozuCash extension icon in your browser toolbar
2. Click "Connect with X" to authenticate with your Twitter account
3. When prompted by Twitter, authorize the application
4. Create a secure password to encrypt your wallet data
5. Your wallet will be generated automatically
6. Visit Twitter to see the wallet integration in action!

## Security Features

- **Zero Server Storage:** All wallet data is stored locally in your browser
- **AES-256 Encryption:** Private keys are never stored in plain text
- **Password-Protected:** All sensitive operations require password verification
- **No Private Key Exposure:** The extension never exposes private keys to the webpage

## Building for Production

To create a production build for distribution:

```
npm run build
```

This will generate a `dist` folder containing the complete extension ready for deployment. You can distribute this through the Chrome Web Store or as a direct download for users.

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
