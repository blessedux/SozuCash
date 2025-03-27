# Sozu Wallet Installation Guide

This document provides detailed instructions for installing, building, and deploying the Sozu Wallet Chrome extension, both for users and developers.

## For Users: Installation Process

### Method 1: Install from Chrome Web Store (Coming Soon)

1. Open the Chrome Web Store in your browser
2. Search for "Sozu Wallet" or use the direct link (TBD)
3. Click "Add to Chrome"
4. Confirm the installation when prompted
5. Pin the extension to your toolbar for easy access

### Method 2: Manual Installation (Developer Mode)

1. Download the latest release package (`sozu-wallet.zip`) from the [Releases](https://github.com/your-username/sozu-wallet/releases) page
2. Extract the zip file to a folder on your computer
3. Open Chrome and navigate to `chrome://extensions`
4. Enable "Developer mode" using the toggle in the top-right corner
5. Click "Load unpacked" and select the extracted folder
6. The extension should now be installed and ready to use
7. Pin the extension to your toolbar for easy access

## For Developers: Build and Deployment Process

### Initial Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/sozu-wallet.git
   cd sozu-wallet
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up development environment:
   - Copy `.env.example` to `.env` (if applicable)
   - Configure any required environment variables

### Development Workflow

1. Start the development server with hot reloading:

   ```bash
   yarn dev
   ```

2. Load the extension in Chrome:

   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

3. Make changes to the code:
   - Changes will be automatically compiled
   - Refresh the extension in Chrome to see your changes

### Building for Production

1. Create a production build:

   ```bash
   yarn build
   ```

2. The production-ready extension will be in the `dist` directory

### Packaging for Distribution

1. Create a zip file of the `dist` directory:

   ```bash
   cd dist
   zip -r ../sozu-wallet.zip *
   ```

2. The `sozu-wallet.zip` file is ready for distribution

### Deployment to Chrome Web Store

1. Create a developer account on the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay the one-time developer registration fee ($5.00 USD)
3. Create a new item:
   - Click "New Item"
   - Upload the `sozu-wallet.zip` file
   - Fill in all required information:
     - Store listing
     - Privacy practices
     - Content rating
     - Images and videos
4. Submit for review
5. Wait for approval (typically 1-3 business days)
6. Once approved, the extension will be available in the Chrome Web Store

## X.com Integration

After installing the extension, visit [X.com](https://x.com) to see the Sozu Wallet button in the sidebar. The button appears below the "Grok" button and allows you to:

1. Open your wallet
2. View your NFTs
3. Activate NFT agents to search for hidden prizes
4. Claim prizes directly from within X.com

## Troubleshooting

If you encounter any issues during installation or use:

1. Make sure Chrome is up to date
2. Try disabling other extensions that might conflict
3. Check the console for error messages (right-click > Inspect > Console)
4. Restart Chrome
5. Reinstall the extension
6. Report issues on the [GitHub Issues](https://github.com/your-username/sozu-wallet/issues) page

## Security Considerations

The Sozu Wallet extension:

1. Stores all sensitive data encrypted in your browser's local storage
2. Never sends private keys to external servers
3. Uses the secure Chrome extension sandboxing model
4. Requests minimal permissions
5. Is open-source, allowing for security audits

## Updates

The extension will automatically update when new versions are published to the Chrome Web Store. For manual installations, you'll need to download and install updates manually.

## Uninstallation

1. Open Chrome and navigate to `chrome://extensions`
2. Find Sozu Wallet in the list
3. Click "Remove" to uninstall the extension

This will completely remove the extension from your browser. Note that wallet data stored in your browser's local storage will also be removed.
