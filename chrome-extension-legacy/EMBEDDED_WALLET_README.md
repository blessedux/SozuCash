# Sozu Wallet - Embedded Twitter Integration

This document explains how the Sozu Wallet integrates directly into the Twitter/X.com UI, replacing part of the right sidebar with our own embedded wallet interface.

## Architecture Overview

The integration uses a Chrome extension content script that modifies Twitter's UI to embed our wallet directly into the page's layout instead of showing it as a separate popup window.

### Key Files

- `src/contentScript.ts`: Entry point for the content script, detects when the user is on Twitter/X and initializes our integration
- `src/contentScript/TwitterIntegration.ts`: Core class that handles replacing Twitter's sidebar with our wallet UI
- `src/contentScript/twitter-styles.css`: All styles for our embedded wallet and tipping interface

## How It Works

1. When a user visits Twitter/X.com, our content script (`contentScript.ts`) loads
2. It initializes the `TwitterIntegration` class which:
   - Finds Twitter's right sidebar using DOM selectors
   - Replaces the sidebar content with our wallet UI
   - Sets up event listeners for wallet interactions
   - Adds "Tip" buttons to tweets
   - Creates tipping overlay for sending crypto to tweet authors

## Key Features

- **Embedded UI**: Instead of a separate popup like traditional wallets (e.g., MetaMask), Sozu Wallet replaces a part of Twitter's own UI.
- **Native Feel**: Styled to match Twitter's dark theme for a seamless integration
- **Tweet Tipping**: Adds buttons to tweets allowing users to send crypto to tweet authors
- **Multi-section UI**: Includes tabs for wallet balances, NFTs, activity, and tipping history
- **Responsive**: Adapts to Twitter's responsive layout

## Technical Approach

- **Sidebar Replacement**: Instead of injecting a button that opens a popup, we directly replace Twitter's right sidebar with our wallet UI
- **MutationObserver**: Used to detect when tweets are added to the timeline and when page navigation occurs
- **CSS Injection**: Our styles are injected via a separate CSS file included in the extension manifest

## Usage For Users

1. Install the Sozu Wallet Chrome extension
2. Visit Twitter.com or X.com
3. The right sidebar will be replaced with the Sozu Wallet interface
4. Use the wallet interface to:
   - View token balances
   - Send and receive crypto
   - Browse NFTs
   - View activity history
   - Tip tweet authors by clicking the "Tip" button on tweets

## Development Notes

### DOM Selectors

Twitter's UI structure can change, so we use multiple potential selectors for finding the sidebar:

- `[data-testid="sidebarColumn"]`
- `[data-testid="primaryColumn"] + div`
- `aside[role="complementary"]`

### Event Handling

The integration sets up various event listeners:

- Tab switching in the wallet UI
- Button clicks for wallet actions
- Tweet discovery for adding tip buttons
- Page navigation to re-inject when Twitter's SPA navigates

### Security Considerations

In a production implementation, you would need to:

- Ensure secure connections to your wallet's backend
- Implement proper authentication
- Handle transaction signing securely
- Store keys and tokens securely

## Future Improvements

- Add proper wallet connection functionality
- Implement real blockchain transactions
- Add more token support
- Add network switching
- Improve detection of Twitter UI changes
- Optimize performance for larger timelines

-BIOMETRIC!!!!!!
