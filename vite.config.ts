import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'

const manifest = {
  manifest_version: 3,
  name: "Sozu Wallet",
  version: "1.0.0",
  description: "Sozu Wallet Chrome Extension",
  action: {
    default_popup: "index.html"
  },
  permissions: ["storage"],
  web_accessible_resources: [{
    resources: ["assets/*"],
    matches: ["<all_urls>"]
  }]
}

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
}) 