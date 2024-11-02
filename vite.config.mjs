import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import path from 'path';
import fs from 'fs-extra';
import { spawn } from 'child_process';

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
  'polaroid',
  'radar-2',
  'device-vision-pro',
  'timeline',
  'plus',
  'square',
  'grid-3x3',
  'grid-dots',
  'caret-up-down',
  'components',
  'help-small',
  'home',
  'device-gamepad',
  'mail', 
  'butterfly',
  'brand-linkedin',
];

// Updated function to copy icons
function copyIcons() {
    const iconDir = path.resolve(__dirname, 'node_modules/@tabler/icons/icons/outline');
    const publicIconDir = path.resolve(__dirname, 'public/assets/icons');
    console.log('Icon source directory:', iconDir);
    console.log('Icon destination directory:', publicIconDir);
    fs.ensureDirSync(publicIconDir);
    requiredIcons.forEach(iconName => {
      const sourceFile = path.join(iconDir, `${iconName}.svg`);
      const destFile = path.join(publicIconDir, `${iconName}.svg`);
      if (fs.existsSync(sourceFile)) {
        if (!fs.existsSync(destFile)) {
          fs.copySync(sourceFile, destFile);
          console.log(`Copied icon: ${iconName}.svg`);
        } else {
          console.log(`Skipped existing icon: ${iconName}.svg`);
        }
      } else {
        console.warn(`Icon not found: ${iconName}.svg`);
      }
    });
  }

// function cliPlugin() {
//   return {
//     name: 'vite-plugin-cli',
//     configureServer(server) {
//       server.httpServer.once('listening', () => {
//         const cli = spawn('node', ['ai/cli-script.js'], { stdio: 'inherit' });
//         process.on('exit', () => cli.kill());
//       });
//     },
//   };
// }
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
    }, 
    {
        name: 'copy-headers-file',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: '_headers',
            source: '/*.js\n  Content-Type: application/javascript'
          });
        }
      },
      {
        name: 'move-assets',
        writeBundle() {
          fs.copySync('public/assets', 'dist/assets');
        },
      }
    // , cliPlugin()
  ],
  server: {
    port: 3000,
    host: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot']
});