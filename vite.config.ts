import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        contentScript: resolve(__dirname, 'src/contentScript.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') {
            return 'popup.html'
          }
          return '[name].[ext]'
        }
      }
    },
    emptyOutDir: true
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

      /* Add new styles for login UI */
      .login-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 48px 24px;
        pointer-events: none;
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

      .auth-buttons {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .twitter-login {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: #000000;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 16px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .twitter-login:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .twitter-icon {
        width: 24px;
        height: 24px;
      }

      .import-wallet-button {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 12px;
        padding: 16px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .import-wallet-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
      }

      /* Enable pointer events only for interactive elements */
      .brand-section,
      .auth-buttons,
      .twitter-login,
      .import-wallet-button {
        pointer-events: auto;
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
          <div class="auth-buttons">
            <button class="twitter-login" onclick="window.app.handleTwitterLogin()">
              <svg class="twitter-icon" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
              </svg>
              Continue with Twitter
            </button>
            <button class="import-wallet-button" onclick="window.app.handleImportWallet()">
              Import Existing Wallet
            </button>
          </div>
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