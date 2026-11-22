import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.resolve('dist');
const destDir = path.resolve('android/app/src/main/assets/public');
const configSrc = path.resolve('capacitor.config.json');
const configDest = path.resolve('android/app/src/main/assets/capacitor.config.json');

if (!fs.existsSync(srcDir)) {
  console.error('❌ dist/ directory not found. Please run "npm run build:web" first.');
  process.exit(1);
}

// 1. Copy web assets to Android assets directory
fs.rmSync(destDir, { recursive: true, force: true });
fs.mkdirSync(destDir, { recursive: true });
fs.cpSync(srcDir, destDir, { recursive: true });

// 2. Ensure capacitor.config.json is present in android assets
if (fs.existsSync(configSrc)) {
  fs.copyFileSync(configSrc, configDest);
}

console.log('⚡ [Mr Bun Mobile Sync]: Web assets and configuration synced cleanly to android/app/src/main/assets/public');
