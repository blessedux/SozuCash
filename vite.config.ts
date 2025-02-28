import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    copyPublicDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        contentScript: resolve(__dirname, 'src/contentScript/index.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') {
            return 'popup.html'
          }
          if (assetInfo.name?.includes('/assets/')) {
            return assetInfo.name.replace('src/', '')
          }
          return '[name].[ext]'
        }
      }
    },
    emptyOutDir: true,
    target: 'es2015',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    include: ['@metamask/browser-passworder', 'ethers', '@ethersproject/hdnode'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.TWITTER_CLIENT_ID': JSON.stringify(process.env.TWITTER_CLIENT_ID),
    'process.env.TWITTER_CLIENT_SECRET': JSON.stringify(process.env.TWITTER_CLIENT_SECRET),
    'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN),
    'process.env.AUTH0_CLIENT_ID': JSON.stringify(process.env.AUTH0_CLIENT_ID),
    'process.env.AUTH0_AUDIENCE': JSON.stringify(process.env.AUTH0_AUDIENCE)
  },
  plugins: [{
    name: 'copy-manifest-and-html',
    generateBundle(_, bundle) {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify({
          manifest_version: 3,
          name: "Sozu Wallet",
          version: "1.0.0",
          description: "Sozu Wallet Chrome Extension",
          action: {
            default_popup: "popup.html"
          },
          background: {
            service_worker: "background.js"
          },
          content_scripts: [{
            matches: ["<all_urls>"],
            js: ["contentScript.js"]
          }],
          permissions: [
            "storage",
            "identity"
          ],
          host_permissions: [
            "https://*.auth0.com/*",
            "https://your-backend-url/*"
          ]
        }, null, 2)
      });

      this.emitFile({
        type: 'asset',
        fileName: 'popup.html',
        source: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Sozu Wallet</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html, body {
        width: 375px;
        height: 600px;
        overflow: hidden;
        background: #000;
      }

      #app {
        position: relative;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .spline-container {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 150%;
        height: 150%;
        transform: translate(-50%, -50%);
        z-index: 0;
        pointer-events: all;
      }

      .spline-container iframe {
        width: 100%;
        height: 100%;
        border: none;
        transform: scale(1.2);
        transform-origin: center center;
        pointer-events: auto;
      }

      #mainContent {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .login-container {
        padding: 48px 24px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        pointer-events: auto;
      }

      .brand-section {
        text-align: center;
      }

      .brand-title {
        font-size: 42px;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
      }

      .twitter-login {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: #000;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px 32px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        width: auto;
      }

      .twitter-login:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .twitter-icon {
        width: 24px;
        height: 24px;
      }

      .wallet-container {
        padding: 24px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 24px;
        pointer-events: auto;
      }

      .wallet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .wallet-selector {
        display: flex;
        gap: 8px;
      }

      .wallet-item {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 8px;
        color: white;
        cursor: pointer;
      }

      .wallet-item.active {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
      }

      .balance-section {
        text-align: center;
        padding: 32px 0;
      }

      .balance-amount {
        font-size: 48px;
        font-weight: bold;
        margin-top: 8px;
      }

      .action-buttons {
        display: flex;
        gap: 16px;
      }

      .action-buttons button {
        flex: 1;
        padding: 16px;
        border-radius: 12px;
        background: #000;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
      }

      .transactions-list {
        flex: 1;
        overflow-y: auto;
      }

      .error-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.2);
        padding: 12px 24px;
        border-radius: 8px;
        color: #ff4444;
        backdrop-filter: blur(10px);
        z-index: 1000;
        animation: slideIn 0.3s ease;
      }

      .loader {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes slideIn {
        from { transform: translate(-50%, -100%); }
        to { transform: translate(-50%, 0); }
      }

      .input-validation {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 4px;
      }

      .input-error {
        border-color: #ff4444 !important;
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        backdrop-filter: blur(10px);
      }

      .profile-picture {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.2);
      }

      .username {
        color: white;
        font-size: 14px;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div class="spline-container">
        <iframe 
          src='https://my.spline.design/animatedshapeblend-44b4174e2919277ccdb7a032cc53f2c1/'
          frameborder='0'
          width='100%'
          height='100%'
          allowtransparency="true"
          allow="autoplay; pointer-lock"
          style="pointer-events: auto;"
        ></iframe>
      </div>
      <div id="mainContent">
        <div class="login-container">
          <div class="brand-section">
            <div class="brand-title">SOZU</div>
            <div class="brand-title">CASH</div>
          </div>
          <button class="twitter-login" onclick="window.app.handleTwitterLogin()">
            <svg class="twitter-icon" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
            </svg>
            Continue with X
          </button>
        </div>
      </div>
    </div>
    <script src="popup.js"></script>
  </body>
</html>`
      });
    }
  }]
}) 