// Build script for Sozu Wallet Chrome extension
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const distDir = path.resolve(rootDir, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create icons directory in dist
const distIconsDir = path.resolve(distDir, 'icons');
if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// Copy manifest.json to dist directory
const manifestPath = path.resolve(publicDir, 'manifest.json');
const manifestDestPath = path.resolve(distDir, 'manifest.json');
fs.copyFileSync(manifestPath, manifestDestPath);

// Generate placeholder icons
const iconSizes = [16, 32, 48, 128];
iconSizes.forEach(size => {
  // This would normally create an actual icon, but for simplicity,
  // we'll just create placeholder text files
  const iconFile = path.resolve(distIconsDir, `icon${size}.png`);
  fs.writeFileSync(iconFile, `Placeholder for ${size}x${size} icon`);
});

console.log('Build completed. Files copied to dist directory.'); 