/**
 * Scans public/assets/slider and public/assets (root images only)
 * Writes manifest.json so the home slider picks up new images automatically.
 *
 * Usage: npm run slider:sync  (also runs before dev & build)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const SLIDER_DIR = path.join(ROOT, 'assets', 'slider');
const ASSETS_DIR = path.join(ROOT, 'assets');
const MANIFEST_PATH = path.join(SLIDER_DIR, 'manifest.json');

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
const SKIP_FILES = new Set(['manifest.json', '.gitkeep']);

function listImagesInDir(dir, urlPrefix) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => {
      if (SKIP_FILES.has(name)) return false;
      const full = path.join(dir, name);
      return fs.statSync(full).isFile() && IMAGE_EXT.test(name);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => `${urlPrefix}/${encodeURI(name)}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(SLIDER_DIR);

const fromSlider = listImagesInDir(SLIDER_DIR, '/assets/slider');
const fromAssetsRoot = listImagesInDir(ASSETS_DIR, '/assets');

const images = [...new Set([...fromSlider, ...fromAssetsRoot])];

const manifest = {
  updatedAt: new Date().toISOString(),
  images,
  hint: 'Add images to public/assets/slider/ then run: npm run slider:sync',
};

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
console.log(`[slider:sync] ${images.length} slide(s) → public/assets/slider/manifest.json`);
images.forEach((src) => console.log(`  • ${src}`));
