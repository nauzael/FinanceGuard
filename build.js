
const fs = require('fs');
const path = require('path');

const filesToCopy = [
  'index.html',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'manifest.json',
  'sw.js',
  'metadata.json'
];

const foldersToCopy = [
  'services',
  'components',
  'views'
];

const distPath = path.join(__dirname, 'dist');

console.log('--- Preparando build modular ---');

try {
  if (fs.existsSync(distPath)) fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });

  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) fs.copyFileSync(file, path.join(distPath, file));
  });

  foldersToCopy.forEach(folder => {
    const src = path.join(__dirname, folder);
    const dest = path.join(distPath, folder);
    if (fs.existsSync(src)) {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(file => {
        fs.copyFileSync(path.join(src, file), path.join(dest, file));
      });
    }
  });

  console.log('--- Build Finalizado con éxito ---');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
