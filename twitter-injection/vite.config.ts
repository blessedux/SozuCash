/// <reference types="chrome"/>import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'
import packageJson from './package.json'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    // https://github.com/lisonge/vite-plugin-monkey/issues/10#issuecomment-1207264978
    esbuild: {
        charset: 'utf8',
    },
    build: {
        cssMinify: false,
        rollupOptions: {
            input: {
                'twitter-inject': resolve(__dirname, 'src/twitter-inject.ts'),
                'background': resolve(__dirname, 'src/background.ts'),
                'popup': resolve(__dirname, 'index.html'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    },
    plugins: [
        monkey({
            entry: 'src/main.ts',
            userscript: {
                'name': {
                    '': 'Sozu Wallet Twitter Integration',
                },
                'author': packageJson.author,
                'namespace': packageJson.author,
                'description': {
                    '': 'Integrates Sozu Wallet into Twitter with a sidebar button',
                },
                'license': packageJson.license,
                'run-at': 'document-start',
                'match': [
                    'https://twitter.com/*',
                    'https://x.com/*',
                ],
                'icon': 'https://abs.twimg.com/favicons/twitter.2.ico',
            },
            build: {
                fileName: 'sozu-twitter.user.js',
            },
            server: {
                open: true,
            },
        }),
    ],
})
