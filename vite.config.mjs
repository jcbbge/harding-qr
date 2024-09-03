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
  'device-vision-pro',
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
  'terminal-2'
];

export default defineConfig({
  plugins: [
    devtools({
      autoname: true
    }),
    solidPlugin(),
    {
      name: 'copy-selected-tabler-icons',
      buildStart() {
        const iconDir = path.resolve(__dirname, 'node_modules/@tabler/icons/icons');
        const publicIconDir = path.resolve(__dirname, 'public/icons');
        fs.ensureDirSync(publicIconDir);

        requiredIcons.forEach(iconName => {
          const sourceFile = path.join(iconDir, `${iconName}.svg`);
          const destFile = path.join(publicIconDir, `${iconName}.svg`);
          if (fs.existsSync(sourceFile)) {
            fs.copySync(sourceFile, destFile);
            console.log(`Copied icon: ${iconName}.svg`);
          } else {
            console.warn(`Icon not found: ${iconName}.svg`);
          }
        });
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
  optimizeDeps: {
    exclude: ['@tabler/icons']
  },
  assetsInclude: ['**/*.svg']
});
