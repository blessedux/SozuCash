a# Sozu Cash - NFC Payment PWA

A Progressive Web App (PWA) for NFC-first payments with one-tap flows on Mantle Network.

## Features

- **PWA Support**: Installable on mobile devices with home screen access
- **Authentication Flow**: Secure passkey-based authentication with session management
- **NFC Payments**: Tap-to-pay functionality using Web NFC APIs
- **QR Code Support**: Fallback payment method with QR code scanning
- **Mantle Network**: Built on Mantle Network for fast, low-cost transactions
- **Offline Support**: Service worker for offline functionality

## PWA Installation

### Android

1. Open the app in Chrome or any Chromium-based browser
2. Tap the "Add to Home Screen" prompt or use the browser menu
3. The app will be installed and accessible from your home screen
4. When opened from home screen, users are directed to the authentication screen

### iOS

1. Open the app in Safari
2. Tap the share button and select "Add to Home Screen"
3. The app will be installed and accessible from your home screen
4. When opened from home screen, users are directed to the authentication screen

## Authentication Flow

The PWA implements a secure authentication flow:

1. **Home Screen Launch**: When opened from home screen, users are directed to `/app` (authentication screen)
2. **Passkey Authentication**: Users authenticate using passkeys (WebAuthn)
3. **Session Management**: Authentication state is stored locally with 24-hour expiration
4. **Auto-logout**: Inactivity timeout of 60 seconds automatically logs users out
5. **Manual Logout**: Users can manually lock the wallet using the lock button or ESC key

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_MANTLE_CHAIN_ID=5000
NEXT_PUBLIC_MANTLE_RPC_URLS=https://rpc.mantle.xyz
NEXT_PUBLIC_USDC_ADDRESS=0x...
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token
```

## Project Structure

```
app/
├── _components/          # Reusable UI components
├── _context/            # React contexts (Auth, Navigation, Wallet)
├── _hooks/              # Custom React hooks
├── _types/              # TypeScript type definitions
├── app/                 # Authentication screen (/app)
├── cash/                # Main wallet interface (/cash)
├── auth/                # Legacy auth page
└── layout.tsx           # Root layout with providers
```

## Key Features

### Authentication Context

- Manages authentication state across the app
- Handles session persistence and expiration
- Provides logout functionality

### Session Timeout

- 60-second inactivity timeout
- Automatically logs users out after inactivity
- Resets on user activity (touch, scroll, keyboard)

### PWA Configuration

- `start_url: "/app"` - Directs to authentication screen when launched from home screen
- Service worker for offline functionality
- Manifest with proper icons and metadata

## Testing

```bash
# Run tests
npm test

# Run type checking
npx tsc --noEmit

# Run linting
npm run lint
```

## Deployment

The app is configured for deployment on Vercel with Edge Functions for API routes.

## License

MIT License
