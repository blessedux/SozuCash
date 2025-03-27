# Sozu Wallet

A next-generation Web3 wallet Chrome extension with seamless X.com (Twitter) integration, allowing users to manage blockchain assets and NFTs directly from their social media experience.

## 🌟 Features

- **X.com Integration**: Interact with your wallet directly from Twitter's interface
- **Multi-Chain Support**: Compatible with Mantle Network and other EVM-compatible chains
- **NFT Management**: View, trade, and activate NFTs as Twitter agents
- **Hidden Prize Discovery**: Use your NFT agents to find hidden prizes across Twitter
- **Secure Transaction System**: End-to-end encrypted transactions and storage

## 🔌 X.com Integration

Sozu Wallet redefines how users interact with blockchain by integrating directly into the X.com (Twitter) user interface:

### Sidebar Button

A custom "Sozu Wallet" button appears in the X.com sidebar beneath the "Grok" button, giving users immediate access to their wallet without leaving the social platform.

### NFT Agents

Activate your NFTs as Twitter agents that can:

- Search for hidden prizes in tweets and comments
- Hide prizes in your own tweets for others to discover
- Interact with other agents across the platform

### Prize Discovery & Claiming

Find and claim hidden crypto prizes directly within X.com:

1. NFT agents automatically scan your feed for hidden prize codes
2. When found, claim the prize with a single click
3. Prizes are transferred directly to your wallet

### Transaction Context

Send transactions related to Twitter content in a single click:

- Tip content creators
- Participate in giveaways
- Purchase NFTs mentioned in tweets

![X.com Integration Demo](https://via.placeholder.com/800x400?text=Sozu+X.com+Integration)

## 🛠️ Tech Stack

- **Frontend**: TypeScript, React, TailwindCSS
- **Blockchain Interaction**: ethers.js
- **Build System**: Webpack
- **State Management**: Custom React Hooks
- **Security**: @metamask/browser-passworder for encryption
- **Extension Framework**: Chrome Extension Manifest V3

## 🔒 Security Measures

Sozu Wallet implements industry-standard security practices:

- **Local Key Storage**: Private keys are never sent to servers
- **Strong Encryption**: All sensitive data is encrypted using @metamask/browser-passworder
- **Sandboxed Execution**: Chrome extension isolation protects wallet operations
- **Content Script Isolation**: Injected scripts have limited access to page context
- **Permission Scoping**: Minimal required permissions in manifest.json
- **No External Dependencies**: All core functionality works without external services

## 📦 Installation Process

For detailed installation instructions for users and developers, please see:

👉 [Installation Guide](INSTALLATION.md)

### Quick Start for Users

1. Download the latest release from the Chrome Web Store (link coming soon)
2. Or install manually:
   - Download the latest `sozu-wallet.zip` from the Releases page
   - Extract the zip file
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the extracted folder
3. Pin the extension to your toolbar for easy access
4. Visit X.com (Twitter) to see the Sozu Wallet button in the sidebar

### Quick Start for Developers

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/sozu-wallet.git
   cd sozu-wallet
   ```

2. Install dependencies

   ```bash
   yarn install
   ```

3. Start the development server
   ```bash
   yarn dev
   ```

## 🚀 Deployment Flow

For detailed deployment instructions, please see:

👉 [Installation Guide](INSTALLATION.md#deployment-flow)

## 📋 Development Guidelines

For developers looking to contribute to the project, please see:

👉 [Contributing Guide](CONTRIBUTING.md)

### Git Flow

1. **Branch Strategy**

   - `main`: Production-ready code
   - `develop`: Latest development changes
   - `feature/*`: New features
   - `hotfix/*`: Urgent fixes

2. **Commit Messages**
   - Follow conventional commit format
   - Include ticket/issue number when applicable

## 📝 Documentation

- [Installation Guide](INSTALLATION.md) - Detailed installation instructions
- [Contributing Guide](CONTRIBUTING.md) - Guidelines for contributors
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines
- [API Documentation](docs/API.md) - API documentation (coming soon)

## 💼 License

[MIT License](LICENSE)

## 🙏 Acknowledgements

- Built with support from the Mantle Network
- Special thanks to the Boys NFT Collection by Petra
