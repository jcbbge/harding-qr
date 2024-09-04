import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import path from 'path';
import fs from 'fs-extra';

// List of icon names you need
const requiredIcons = [
  'cpu',
  'layers-difference',
  'device-tv-old',
  'sphere',
  'track',
  'recharging',
  'building-skyscraper',
  'brand-apple-arcade',
  'lollipop',
  'stereo-glasses',
  'wave-sine',
  'shopping-bag',
  'sun',
  'moon',
  'sun-moon',
  'layout-dashboard',
  'palette',
  'arrow-narrow-left',
  'arrow-narrow-right',
  'arrow-narrow-up',
  'arrow-narrow-down',
  'space',
  'arrow-back',
  'arrow-big-up',
  'terminal-2',
  'help-square-rounded',
  'moon-stars',
  'texture',
  'target',
  'zodiac-aquarius',
  'ice-cream',
  'mug',
  'polaroid'
];

// Updated function to copy icons
function copyIcons() {
  const iconDir = path.resolve(__dirname, 'node_modules/@tabler/icons/icons/outline');
  const publicIconDir = path.resolve(__dirname, 'src/assets/icons');

  console.log('Icon source directory:', iconDir);
  console.log('Icon destination directory:', publicIconDir);

  fs.ensureDirSync(publicIconDir);
}

// Run the copy function immediately
copyIcons();

export default defineConfig({
  plugins: [
    devtools({
      autoname: true
    }),
    solidPlugin(),
    {
      name: 'copy-selected-tabler-icons',
      buildStart() {
        copyIcons();
      }
    }
  ],
  server: {
    port: 3000
  },
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  assetsInclude: ['**/*.svg']
});
