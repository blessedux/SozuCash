<h1 align="center">Get Twitter Icons Back</h1>

<div align="center">

## Say NO to 𝕏

[![GreasyFork][GreasyFork-image]][GreasyFork-url]

[GreasyFork-image]: https://img.shields.io/static/v1?label=%20&message=GreasyFork&style=flat-square&labelColor=7B0000&color=960000&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=
[GreasyFork-url]: https://greasyfork.org/scripts/471595-get-twitter-icons-back

<img src="https://github.com/pionxzh/Get-Twitter-Icons-Back/assets/9910706/3fca5769-15d9-4317-ad88-e07cfdc747c6" alt="Twitter Icon" width="200">

<br /><br />
<align>This script brings back the old good <b>blue bird</b> icon on [Twitter](https://twitter.com/).</align>
<br />

<img src="https://github.com/pionxzh/Get-Twitter-Icons-Back/assets/9910706/d9375c17-d61a-4b27-8136-ada06b3d6414" alt="Feature Preview" width="600px">
<br />

## Install

### Prerequisites

<align>Install <b>`Tampermonkey`</b></align>

[<img src="https://user-images.githubusercontent.com/3750161/214147732-c75e96a4-48a4-4b64-b407-c2402e899a75.PNG" height="60" alt="Chrome" valign="middle">][link-chrome] &nbsp;&nbsp; [<img src="https://user-images.githubusercontent.com/3750161/214148610-acdef778-753e-470e-8765-6cc97bca85ed.png" height="60" alt="Firefox" valign="middle">][link-firefox] &nbsp;&nbsp; [<img src="https://user-images.githubusercontent.com/3750161/233201810-d1026855-0482-44c8-b1ec-c7247134473e.png" height="60" alt="Chrome" valign="middle">][link-edge]

[link-chrome]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=id "Chrome Web Store"
[link-firefox]: https://addons.mozilla.org/firefox/addon/tampermonkey "Firefox Add-ons"
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd "Edge Add-ons"

### UserScript

| Greasyfork                                   | GitHub                                       |
| -------------------------------------------- | -------------------------------------------- |
| [![Install][Install-1-image]][install-1-url] | [![Install][Install-2-image]][install-2-url] |

[Install-1-image]: https://img.shields.io/badge/-Install-blue
[Install-1-url]: https://greasyfork.org/scripts/471595-get-twitter-icons-back
[Install-2-image]: https://img.shields.io/badge/-Install-blue
[Install-2-url]: https://raw.githubusercontent.com/pionxzh/Get-Twitter-Icons-Back/main/dist/twitter.user.js

</div>

## Features

- Replace **all** 𝕏 icon with the Twitter Blue Bird icon
- Replace home icon with the Twitter BirdHouse icon
- Restore favicon
- Restore `meta` information
- Restore title `/ Twitter`

# Sozu Wallet

A next-generation Web3 wallet Chrome extension with seamless X.com (Twitter) integration, allowing users to manage blockchain assets and NFTs directly from their social media experience.

## Twitter Integration Implementation

This project implements a Chrome extension that injects a Sozu Wallet button into the Twitter/X.com sidebar, providing seamless integration with the social media platform.

### Key Features

- **Sidebar Button**: Injects a "Sozu Wallet" button into Twitter's sidebar below the Grok button
- **Wallet Interface**: Opens a custom wallet interface when the button is clicked
- **Multi-Chain Support**: Compatible with Mantle Network and other EVM-compatible chains
- **NFT Management**: View and manage NFTs that can be used as Twitter agents

### Technical Implementation

The Twitter integration is implemented using the following components:

1. **Content Script (`twitter-inject.ts`)**:

   - Injects a wallet button into Twitter's UI
   - Uses DOM manipulation to insert the button in the sidebar
   - Detects UI changes and ensures the button remains visible
   - Sends messages to the extension's background script when clicked

2. **Background Script (`background.ts`)**:

   - Listens for messages from the content script
   - Opens the wallet interface in response to button clicks
   - Manages extension lifecycle events

3. **Wallet Interface (`popup.ts` and `index.html`)**:
   - Provides a modern, Twitter-styled wallet interface
   - Displays wallet balances, assets, and NFTs
   - Supports sending and receiving transactions

### How It Works

The extension works by:

1. Monitoring Twitter's DOM for sidebar navigation
2. Injecting a custom wallet button with appropriate styling
3. Setting up event listeners for button clicks
4. Opening a wallet interface when the button is clicked
5. Managing wallet operations through the extension's background scripts

### Based On

This implementation was inspired by the "Get Twitter Icons Back" userscript, but extends the concept to add new functionality rather than just replacing existing icons.

## Development

### Prerequisites

- Node.js >= 20
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Installing the Extension

1. Build the extension with `pnpm build`
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the `dist` directory
5. Visit Twitter/X.com to see the Sozu Wallet button in the sidebar

## License

MIT
