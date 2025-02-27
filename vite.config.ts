import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        contentScript: resolve(__dirname, 'src/contentScript/index.ts')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        dir: 'dist'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [{
    name: 'copy-manifest-and-html',
    generateBundle() {
      // Copy manifest
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
            "storage"
          ]
        }, null, 2)
      });

      // Copy HTML file
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
      body {
        margin: 0;
        padding: 0;
        width: 375px;
        height: 600px;
        background: #1a1a1a;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }
      
      #app {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        padding: 16px;
        border-bottom: 1px solid #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .content {
        flex: 1;
        padding: 20px;
      }

      .nav-buttons {
        display: flex;
        gap: 10px;
      }

      button {
        background: #8A2BE2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
      }

      button:hover {
        background: #9B30FF;
      }

      h2, h3 {
        margin: 0;
      }

      .balance-display {
        font-size: 24px;
        font-weight: bold;
        margin: 20px 0;
      }

      input {
        background: #333;
        border: 1px solid #444;
        color: white;
        border-radius: 4px;
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div class="header">
        <h2>Sozu Wallet</h2>
        <div class="nav-buttons">
          <button id="settingsBtn">Settings</button>
        </div>
      </div>
      <div class="content" id="mainContent">
        <!-- Dynamic content will be inserted here -->
      </div>
    </div>
    <script src="popup.js"></script>
  </body>
</html>`
      });
    }
  }]
}) 