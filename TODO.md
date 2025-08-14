# Sozu Cash - NFC Invoice PWA Roadmap

## Project Overview

Transitioning from Chrome extension to Next.js PWA with NFC-first payments, QR fallback, and passkeys authentication on Mantle Network.

## Architecture Summary

- **Frontend**: Next.js App Router + TypeScript + PWA
- **Backend**: Vercel Edge Functions + KV Storage
- **Authentication**: Privy SDK with Passkeys (WebAuthn)
- **Blockchain**: Mantle Network via viem
- **NFC**: Web NFC APIs (Android) + URL fallback (iOS)
- **Payments**: USDC transfers with one-tap flows

---

## Phase 1: Foundation

### Frontend Tasks

- [ ] **Initialize Next.js 14 project** with App Router
- [ ] **Set up PWA configuration** (manifest.json, service worker)
- [ ] **Configure TypeScript** and ESLint
- [ ] **Set up Tailwind CSS** with custom design system
- [ ] **Install core dependencies**:
  - `@privy-io/react-auth` (passkeys)
  - `viem` (EVM client)
  - `zustand` (state management)
  - `zxing-js/browser` (QR scanning)
  - `qrcode` (QR generation)

### Backend Tasks

- [ ] **Set up Vercel project** with Edge Functions
- [ ] **Configure environment variables**:
  - `NEXT_PUBLIC_MANTLE_CHAIN_ID=5000`
  - `NEXT_PUBLIC_MANTLE_RPC_URLS`
  - `NEXT_PUBLIC_USDC_ADDRESS`
  - `PRIVY_APP_ID`
  - `PRIVY_APP_SECRET`
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
- [ ] **Create Edge Function** `/api/i/[id]/route.ts` for invoice resolution

### Design System

- [ ] **Extract reusable UI components** from Chrome extension
- [ ] **Create component library**:
  - `WaveOverlay` (success animations)
  - `Keypad` (amount input)
  - `BigQR` (QR display)
  - `Toast` (notifications)
  - `Camera` (QR scanning)

---

## Phase 2: Authentication & Wallet

### Privy Integration

- [ ] **Set up Privy client** with passkey authentication
- [ ] **Create login flow** with biometric unlock
- [ ] **Implement embedded wallet** creation for Mantle
- [ ] **Add session management** with Quick Window concept

### Wallet Services

- [ ] **Create `usePrivyWallet` hook** for wallet operations
- [ ] **Implement balance fetching** from Mantle Network
- [ ] **Add transaction signing** with viem
- [ ] **Create `useQuickWindow` hook** for auto-pay sessions

### UI Components

- [ ] **Build locked screen** (reuse from Chrome extension)
- [ ] **Create home dashboard** with balance display
- [ ] **Add biometric prompt** UI
- [ ] **Implement Quick Window** status indicator

---

## Phase 3: Invoice System

### Invoice Creation

- [ ] **Define invoice schema** (EIP-712 compatible)
- [ ] **Create invoice signing** service
- [ ] **Implement IPFS pinning** via web3.storage
- [ ] **Add short-link generation** for invoices

### Invoice Resolution

- [ ] **Complete Edge Function** `/api/i/[id]/route.ts`
- [ ] **Add invoice verification** (signature + expiration)
- [ ] **Implement KV caching** for fast resolution
- [ ] **Add anti-replay protection** with nonce tracking

### Deep Link Handling

- [ ] **Create `/i/[id]/page.tsx`** for invoice deep links
- [ ] **Implement auto-pay logic** when unlocked
- [ ] **Add insufficient funds** handling
- [ ] **Create payment status** tracking

---

## Phase 4: NFC & QR

### NFC Implementation

- [ ] **Create `useNFC` hook** for Android Web NFC
- [ ] **Implement NFC writing** for invoice tags
- [ ] **Add NFC reading** for payment initiation
- [ ] **Handle iOS limitations** (URL fallback only)

### QR System

- [ ] **Build QR scanner** with camera access
- [ ] **Create QR generator** for invoice sharing
- [ ] **Add QR fallback** for all NFC operations
- [ ] **Implement auto-pay** on QR scan

### Payment Flows

- [ ] **Create `/receive/page.tsx`** (invoice creation)
- [ ] **Create `/send/page.tsx`** (QR scanning)
- [ ] **Implement one-tap payment** logic
- [ ] **Add payment confirmation** UI

---

## Phase 5: Polish & UX

### Animations & Effects

- [ ] **Implement wave animations** on success
- [ ] **Add haptic feedback** for mobile
- [ ] **Create loading states** and transitions
- [ ] **Add sound effects** for iOS

### Safety Features

- [ ] **Implement spend caps** for Quick Window
- [ ] **Add vendor allow-listing** (optional)
- [ ] **Create insufficient funds** toast
- [ ] **Add transaction limits** and warnings

### Performance

- [ ] **Optimize bundle size** and loading
- [ ] **Add offline support** with service worker
- [ ] **Implement background sync** for payments
- [ ] **Add error boundaries** and fallbacks

---

## Phase 6: Deployment

### Vercel Setup

- [ ] **Configure custom domain** (app.sozu.cash)
- [ ] **Set up Edge Functions** and KV storage
- [ ] **Configure environment variables**
- [ ] **Test deployment** and CDN

### Testing

- [ ] **Test Android NFC** read/write flows
- [ ] **Test iOS deep links** and QR scanning
- [ ] **Verify passkey authentication** on both platforms
- [ ] **Test payment flows** end-to-end

### Documentation

- [ ] **Update README.md** with new architecture
- [ ] **Create deployment guide**
- [ ] **Add API documentation**
- [ ] **Create user onboarding** flow

---

## Technical Debt & Future Enhancements

### Phase 7: Advanced Features

- [ ] **Add local vault** fallback (BIP-39 + WebCrypto)
- [ ] **Implement EIP-3009** transfer vouchers
- [ ] **Add multi-token support** beyond USDC
- [ ] **Create vendor dashboard** for analytics

### Phase 8: Scale & Security

- [ ] **Add rate limiting** to Edge Functions
- [ ] **Implement audit logging** for payments
- [ ] **Add fraud detection** algorithms
- [ ] **Create backup/restore** functionality

---

## 📋 Reusable Components from Chrome Extension

### UI Components to Extract

- [ ] **Locked screen** design and animations
- [ ] **Balance display** styling
- [ ] **Button components** and interactions
- [ ] **Dark mode** support
- [ ] **Toast notifications** system

### Services to Adapt

- [ ] **MantleService** → viem client integration
- [ ] **AuthService** → Privy passkey integration
- [ ] **PasswordService** → local vault (optional)

### Assets to Reuse

- [ ] **Sozu logo** and branding
- [ ] **Mantle Network** icons
- [ ] **Color scheme** and design tokens

---

## 🎯 Success Metrics

### Technical KPIs

- [ ] **App load time** < 2 seconds
- [ ] **NFC read/write** < 500ms
- [ ] **Payment confirmation** < 3 seconds
- [ ] **99.9% uptime** on Vercel

### User Experience KPIs

- [ ] **One-tap payment** success rate > 95%
- [ ] **Passkey authentication** < 2 seconds
- [ ] **Zero typing** required for payments
- [ ] **Cross-platform** compatibility

---

## 🚨 Risk Mitigation

### Technical Risks

- **Web NFC API limitations**: Implement robust QR fallback
- **Passkey browser support**: Add email fallback for older devices
- **Mantle RPC reliability**: Multi-provider setup with health checks

### UX Risks

- **iOS NFC restrictions**: Clear messaging about Android requirement
- **Biometric failures**: Graceful fallback to PIN/password
- **Network connectivity**: Offline-first design with sync

---

## 📞 Team Handoff Notes

### Frontend Team

- Focus on PWA performance and mobile UX
- Prioritize one-tap flows and biometric authentication
- Ensure cross-platform compatibility (Android/iOS)

### Backend Team

- Edge Functions should be stateless and fast
- KV storage for caching, IPFS for persistence
- No user accounts or PII on server side

### DevOps Team

- Vercel deployment with custom domain
- Environment variable management
- Monitoring and alerting setup

---

_Last updated: [Current Date]_
_Next review: [Weekly]_
