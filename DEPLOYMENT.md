# Sozu Cash PWA - Deployment Guide

This guide will walk you through deploying the Sozu Cash PWA to Vercel with all necessary configurations.

## 🚀 Quick Deploy

### 1. Prerequisites

- [Vercel account](https://vercel.com)
- [Privy account](https://privy.io)
- [Mantle RPC access](https://mantle.xyz)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (optional for caching)

### 2. Environment Setup

Create a `.env.local` file with the following variables:

```env
# Mantle Network Configuration
NEXT_PUBLIC_MANTLE_CHAIN_ID=5000
NEXT_PUBLIC_MANTLE_RPC_URLS=https://rpc.mantle.xyz,https://mantle.publicnode.com
NEXT_PUBLIC_USDC_ADDRESS=0x201EBa5CC46D216Ce6DC03F6a759e8E7660e1EF8

# Privy Authentication
PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here

# Vercel KV Storage (Optional)
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here

# IPFS Storage (Optional)
W3S_TOKEN=your_web3_storage_token_here
PINATA_JWT=your_pinata_jwt_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://app.sozu.cash
NEXT_PUBLIC_APP_NAME=Sozu Cash
```

### 3. Vercel Deployment

1. **Connect Repository**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Set up Custom Domain**:
   - Go to Settings → Domains
   - Add `app.sozu.cash`
   - Configure DNS records as instructed

### 4. Service Dependencies

#### Privy Setup
1. Create a new app at [console.privy.io](https://console.privy.io)
2. Configure authentication methods:
   - Enable Passkeys
   - Set redirect URLs: `https://app.sozu.cash`
3. Copy App ID and Secret to environment variables

#### Vercel KV (Optional)
1. Create KV database in Vercel dashboard
2. Copy connection details to environment variables
3. Used for caching invoice resolutions

#### IPFS Storage (Optional)
1. **Web3.Storage**: Get API token from [web3.storage](https://web3.storage)
2. **Pinata**: Get JWT from [pinata.cloud](https://pinata.cloud)
3. Used for storing invoice data

## 🔧 Advanced Configuration

### Edge Functions

The app includes Edge Functions for invoice resolution:

```typescript
// /vercel/edge/i/route.ts
export const runtime = 'edge'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Invoice resolution logic
}
```

### PWA Configuration

The app is configured as a PWA with:

- **Manifest**: `/public/manifest.json`
- **Service Worker**: `/public/sw.js`
- **Icons**: 192x192 and 512x512 PNG files

### Performance Optimizations

1. **Image Optimization**:
   ```javascript
   // next.config.js
   images: {
     domains: ['ipfs.io', 'gateway.pinata.cloud'],
   }
   ```

2. **Caching Headers**:
   ```javascript
   // next.config.js
   async headers() {
     return [
       {
         source: '/(.*)',
         headers: [
           { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
         ],
       },
     ]
   }
   ```

## 🧪 Testing

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Manual Testing Checklist

- [ ] **Passkey Authentication**: Test biometric unlock on mobile
- [ ] **NFC Reading**: Test on Android Chrome with NFC tags
- [ ] **QR Scanning**: Test camera access and QR decoding
- [ ] **Payment Flows**: Test invoice creation and payment
- [ ] **Quick Window**: Test auto-pay functionality
- [ ] **Offline Support**: Test PWA installation and offline mode

### Automated Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📱 PWA Installation

### Android
1. Open Chrome/Edge
2. Navigate to `https://app.sozu.cash`
3. Tap "Add to Home Screen" when prompted
4. App will install as native PWA

### iOS
1. Open Safari
2. Navigate to `https://app.sozu.cash`
3. Tap Share button → "Add to Home Screen"
4. App will install as native PWA

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use Vercel's environment variable encryption
- Rotate secrets regularly

### CORS Configuration
```javascript
// Edge Function CORS headers
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### Content Security Policy
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
        },
      ],
    },
  ]
}
```

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user interactions

### Error Tracking
```javascript
// Add error boundary
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
```

### Performance Monitoring
- Core Web Vitals tracking
- Payment success rates
- NFC/QR scan success rates

## 🚨 Troubleshooting

### Common Issues

1. **Passkey Not Working**:
   - Ensure HTTPS is enabled
   - Check browser compatibility
   - Verify Privy configuration

2. **NFC Not Available**:
   - Check Android Chrome version
   - Ensure NFC is enabled on device
   - Test with physical NFC tags

3. **Payment Failures**:
   - Check Mantle RPC connectivity
   - Verify USDC contract address
   - Check wallet balance

4. **PWA Not Installing**:
   - Verify manifest.json is accessible
   - Check service worker registration
   - Test on supported browsers

### Debug Commands
```bash
# Check build output
npm run build

# Analyze bundle size
npm run analyze

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Scaling Considerations

### Performance
- Use Vercel Edge Functions for global distribution
- Implement proper caching strategies
- Optimize bundle size with code splitting

### Reliability
- Multi-provider RPC setup
- Fallback mechanisms for all features
- Graceful degradation for unsupported features

### Security
- Regular security audits
- Dependency vulnerability scanning
- Penetration testing for payment flows

---

## 📞 Support

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Privy Documentation](https://docs.privy.io)
- [Mantle Documentation](https://docs.mantle.xyz)

For technical support:
- Create issue in GitHub repository
- Join Discord community
- Contact development team
