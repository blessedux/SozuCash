# Sozu Cash — NFC Invoice PWA

A permissionless PWA with NFC-first payments and QR fallback, zero typing, passkeys (Face ID/biometrics) for unlock, and one-tap actions on Mantle Network.

## 🎯 Vision

**Goal**: Instant payments with a single tap. No typing, no passwords, no friction.

- **NFC-first**: Tap to pay, phone to phone, QR fallback everywhere
- **Passkeys**: Biometric unlock (Face ID/Touch ID)
- **One-tap flows**: If you tapped, that was your intent
- **Mantle Network**: Fast, cheap USDC transfers
- **PWA**: Install on home screen, works offline

## ✨ Features

### 🔐 Authentication

- **Passkeys (WebAuthn)**: Face ID/Touch ID unlock
- **Privy SDK**: Embedded wallet creation
- **No email/password**: Pure biometric authentication

### 💳 Payments

- **NFC Tags**: Android Web NFC read/write
- **QR Codes**: Universal fallback for all devices
- **One-tap auto-pay**: Unlocked = instant payment
- **USDC on Mantle**: Fast, cheap stablecoin transfers

### 📱 User Experience

- **Quick Window**: 60-second auto-pay sessions
- **Spend caps**: Configurable limits for safety
- **Optimistic UI**: "Paid ✓" immediately, then status
- **Offline support**: Service worker for reliability

## 🏗️ Architecture

### Frontend (Next.js 14)

```
/app
  /i/[id]/page.tsx      # Deep-link: fetch invoice -> auto-pay
  /receive/page.tsx     # Keypad -> sign invoice -> NFC write
  /send/page.tsx        # Scan QR -> auto-pay
  /_components/         # WaveOverlay, Keypad, BigQR, Toast
  /_hooks/              # useQuickWindow, usePrivyWallet, useNFC
/lib
  invoices/             # Build, sign (EIP-712), verify, pin
  payments/             # viem client, send, watcher
  effects/              # Wave animations + haptics
  rpc/                  # Multi-provider health/selection
  nfc/                  # Android writer/reader helpers
```

### Backend (Vercel Edge Functions)

```
/vercel
  /edge/i/route.ts      # GET /i/:id shortlink -> JSON
```

### Data Flow

1. **Vendor creates invoice** → signs with EIP-712 → pins to IPFS
2. **Short link generated** → `/i/ABC123` → Edge Function resolves
3. **Payer taps NFC/QR** → deep link opens → auto-pay if unlocked
4. **Transaction broadcast** → Mantle Network → confirmation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Vercel account
- Privy account
- Mantle RPC access

### Installation

1. **Clone and install**:

   ```bash
   git clone https://github.com/blessedux/sozu-wallet.git
   cd sozucash-pwa
   npm install
   ```

2. **Environment setup**:

   ```bash
   cp .env.example .env.local
   ```

   Configure your `.env.local`:

   ```env
   NEXT_PUBLIC_MANTLE_CHAIN_ID=5000
   NEXT_PUBLIC_MANTLE_RPC_URLS=https://rpc.mantle.xyz,https://mantle.publicnode.com
   NEXT_PUBLIC_USDC_ADDRESS=0x...
   PRIVY_APP_ID=...
   PRIVY_APP_SECRET=...
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   ```

3. **Development**:

   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

## 📱 Usage Flows

### App Open (First Run)

1. Splash screen → Passkey prompt (Face ID/biometrics)
2. Privy creates embedded wallet on Mantle
3. Home screen shows balance → user unlocked

### Vendor — Create Invoice

1. Navigate to `/receive` → keypad enter amount + memo
2. Build + sign invoice → pin to IPFS → get short link
3. **Android**: Write NDEF immediately → "Tag updated ✓"
4. **iOS**: Show QR + note "Provision tag with Android"

### Payer — Send Payment

1. Tap vendor NFC tag (or scan QR) → deep link `/i/:id`
2. If unlocked + Quick Window active → auto-sign & broadcast
3. UI: "Paid ✓" (optimistic) + status chip
4. If insufficient funds → full-screen failure toast + "Deposit"

### QR Fallback (Universal)

- Vendor shows QR of invoice link
- Payer taps "Send" → "Scan" → camera opens
- Auto-pay upon decode (if unlocked)

## 🔧 Technical Stack

### Client

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Wallet**: Privy SDK (embedded + passkeys)
- **EVM**: viem (Mantle config)
- **QR**: zxing-js/browser (scan), qrcode (generate)
- **NFC**: Web NFC APIs (NDEFReader/Writer)
- **Animations**: WebGL + SVG fallback

### Backend

- **Platform**: Vercel Edge Functions
- **Runtime**: Node 20 (Edge Runtime)
- **Storage**: Vercel KV (caching)
- **IPFS**: web3.storage/Pinata client

### Blockchain

- **Network**: Mantle Network (L2)
- **Token**: USDC
- **Contracts**: ERC-20 direct transfer

## 🛡️ Safety Features

### Quick Window

- **Default**: 60-second auto-pay window
- **Spend cap**: $50 total, $25 per transaction
- **Auto-extend**: +30s on successful payment near expiry

### Security

- **Anti-replay**: Nonce + expiration tracking
- **Signature verification**: EIP-712 over all invoice fields
- **Vendor allow-listing**: Optional vendor verification
- **Local nonce cache**: Prevent double-spending

## 📊 Invoice Schema

```json
{
  "v": 1,
  "net": "mantle",
  "token": "USDC",
  "dec": 6,
  "to": "0xVENDOR",
  "amt": "1250000",
  "memo": "Americano x2",
  "nonce": "0x04f3...af",
  "exp": 1733184000,
  "sig": "0x..." // EIP-712 over all fields
}
```

## 🎨 Design System

### Reused from Chrome Extension

- **Locked screen**: Biometric prompt design
- **Balance display**: Clean, minimal styling
- **Button components**: Consistent interactions
- **Dark mode**: Full theme support
- **Toast system**: Success/error notifications

### New Components

- **WaveOverlay**: Success animation on payment
- **Keypad**: Amount input with haptic feedback
- **BigQR**: Full-screen QR code display
- **Camera**: QR scanner with real-time detection

## 🚨 Known Limitations

### Platform Constraints

- **iOS NFC**: Cannot write tags from web (use Android to provision)
- **Phone↔phone NFC**: Not available on web (future-proof payloads)
- **Biometrics**: Cold starts may require Face ID once

### Browser Support

- **Web NFC**: Chrome/Edge on Android only
- **Passkeys**: Modern browsers with biometric hardware
- **PWA**: All modern browsers

## 🧪 Testing

### Manual Testing

```bash
# Android Chrome
npm run test:android-nfc

# iOS Safari
npm run test:ios-deeplink

# QR Scanner
npm run test:qr-scan

# Payment Flows
npm run test:payment
```

### Automated Testing

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 📈 Performance Targets

- **App load**: < 2 seconds
- **NFC read/write**: < 500ms
- **Payment confirmation**: < 3 seconds
- **Uptime**: 99.9% on Vercel
- **One-tap success**: > 95%

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [Mantle Network](https://mantle.xyz)
- Powered by [Privy](https://privy.io) for passkeys
- Deployed on [Vercel](https://vercel.com)
- Icons from [Mantle](https://mantle.xyz) and Sozu branding

---

## 📞 Support

- **Documentation**: [docs.sozu.cash](https://docs.sozu.cash)
- **Discord**: [discord.gg/sozucash](https://discord.gg/sozucash)
- **Twitter**: [@sozucash](https://twitter.com/sozucash)

---

_Sozu Cash — Tap to pay, instantly._
