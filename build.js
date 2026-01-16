
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

const distPath = path.join(__dirname, 'dist');

console.log('--- Iniciando preparación de carpeta dist ---');

try {
  // 1. Limpiar y crear carpeta dist
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  fs.mkdirSync(distPath, { recursive: true });

  // 2. Copiar archivos raíz
  filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(distPath, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`[OK] Copiado: ${file}`);
    } else {
      console.warn(`[WARN] No se encontró: ${file}`);
    }
  });

  // 3. Copiar carpeta de servicios (recursivo simple)
  const servicesSrc = path.join(__dirname, 'services');
  const servicesDest = path.join(distPath, 'services');

  if (fs.existsSync(servicesSrc)) {
    if (!fs.existsSync(servicesDest)) fs.mkdirSync(servicesDest, { recursive: true });
    const files = fs.readdirSync(servicesSrc);
    files.forEach(file => {
      fs.copyFileSync(path.join(servicesSrc, file), path.join(servicesDest, file));
    });
    console.log('[OK] Carpeta services/ copiada');
  }

  // Verificación crítica para Capacitor
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    console.log('--- ¡Construcción exitosa! dist/index.html listo ---');
  } else {
    throw new Error('CRÍTICO: dist/index.html no se generó correctamente.');
  }

} catch (err) {
  console.error('Error durante el build:', err.message);
  process.exit(1);
}
