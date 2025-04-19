# SozuCash Wallet Browser Extension

SozuCash Wallet is a Chrome extension that integrates with Twitter/X to provide a seamless Web3 wallet experience. The extension allows users to authenticate with their Twitter accounts and automatically generates EVM-compatible wallets for them.

## Features

- **Twitter/X OAuth Authentication**: Securely sign in using your Twitter account
- **EVM-Compatible Wallet Generation**: Each Twitter account can have multiple wallets
- **Mantle Network Support**: Send and receive MNT tokens on Mantle Network
- **Twitter Integration**: Injected wallet UI within Twitter's interface
- **Secure Key Management**: Private keys are stored locally and securely

## Installation

### Local Development Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/sozucash-wallet.git
   cd sozucash-wallet
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your Twitter API credentials:

   - Create a Twitter Developer account at [developer.twitter.com](https://developer.twitter.com)
   - Create a new project and app
   - Set up OAuth 2.0 authentication
   - Add `chrome-extension://[YOUR-EXTENSION-ID]/oauth-callback.html` as an allowed callback URL
   - Copy your Client ID and Client Secret

4. Create a `.env` file in the root directory with your Twitter API credentials:

   ```
   TWITTER_CLIENT_ID=your_client_id_here
   TWITTER_CLIENT_SECRET=your_client_secret_here
   ```

5. Build the extension:

   ```
   npm run build
   ```

6. Load the extension in Chrome:

   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder from your project directory
   - Note the generated extension ID for setting up your Twitter OAuth callback URL

7. Update your Twitter OAuth callback URL with your actual extension ID and rebuild if necessary

### Installing from Chrome Web Store (Coming Soon)

1. Navigate to the Chrome Web Store
2. Search for "SozuCash Wallet"
3. Click "Add to Chrome"

## Usage

### Initial Setup

1. Click on the SozuCash extension icon in your browser toolbar
2. Click "Connect with X" to authenticate with your Twitter account
3. Authorize the application when prompted by Twitter
4. A new EVM wallet will be automatically generated for your Twitter account
5. Your wallet is now ready to use!

### Using the Wallet

- **View Balance**: Your balance is displayed on the main dashboard
- **Send Tokens**: Click the "Send" button to transfer tokens to another address
- **Receive Tokens**: Click the "Deposit" button to view your wallet address for receiving tokens
- **Switch Networks**: Use the network selector to switch between different EVM networks (when available)
- **Logout**: Clear your Twitter authentication (Note: this doesn't delete your wallet)

### Twitter Integration

The extension also injects a wallet UI into Twitter's interface:

1. Navigate to [twitter.com](https://twitter.com) or [x.com](https://x.com)
2. Click on the SozuCash button in the left sidebar
3. The wallet UI will appear in the right sidebar, replacing the "What's happening" section
4. You can interact with your wallet directly within Twitter!

## Twitter API Requirements

SozuCash Wallet uses Twitter's OAuth 2.0 for authentication. You will need:

1. A Twitter Developer Account
2. A Twitter App with OAuth 2.0 enabled
3. Client ID and Client Secret for your app

For development purposes, you can use a free developer account which provides basic API access. For production, you may need an elevated access level depending on usage.

**Note**: If you're just testing the extension locally, you can get a free Twitter Developer account which should be sufficient for OAuth authentication flows.

### Twitter OAuth Scopes Used

The extension requests the following scopes:

- `tweet.read`: To read tweets (for future features)
- `users.read`: To access user profile information
- `offline.access`: To maintain persistent authentication

## Security

SozuCash Wallet prioritizes security:

- Private keys are stored locally in your browser's secure storage
- Authentication tokens are stored securely and managed through Chrome's extension APIs
- The extension uses PKCE (Proof Key for Code Exchange) for enhanced OAuth security
- No sensitive data is transmitted to external servers

## Development

### Project Structure

- `src/`: Source code
  - `background/`: Background scripts for extension functionality
  - `popup/`: UI for the extension popup
  - `services/`: Service classes for authentication, blockchain interactions, etc.
  - `utils/`: Utility functions and helpers
  - `types/`: TypeScript type definitions
  - `twitter-injection/`: Code for Twitter UI integration

### Build Commands

- `npm run dev`: Start development server
- `npm run build`: Build production version
- `npm run test`: Run tests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Ethereum](https://ethereum.org) and [Mantle Network](https://mantle.xyz)
- Powered by [Twitter OAuth 2.0](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
