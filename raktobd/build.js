/**
 * build.js — Bundles and minifies all public JS files into a single bundle.min.js
 * Run with: node build.js
 *
 * Load order matches index.html script load order exactly.
 */

const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

const PUBLIC_JS = path.join(__dirname, 'public', 'js');
const OUTPUT_DIR = path.join(__dirname, 'public', 'dist');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'bundle.min.js');

// Exact load order — must match the <script> tags in index.html
const FILES_IN_ORDER = [
  'bd_geodata.js',
  'bd_hospitals.js',
  'api.js',
  'components/toast.js',
  'components/navbar.js',
  'components/donorCard.js',
  'components/requestCard.js',
  'pages/home.js',
  'pages/donors.js',
  'pages/requests.js',
  'pages/register.js',
  'pages/login.js',
  'pages/dashboard.js',
  'pages/thalassemia.js',
  'pages/donate.js',
  'app.js'
];

async function build() {
  console.log('🔨 Building bundle...');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read all source files in order
  const sourceMap = {};
  for (const file of FILES_IN_ORDER) {
    const fullPath = path.join(PUBLIC_JS, file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`);
      process.exit(1);
    }
    sourceMap[file] = fs.readFileSync(fullPath, 'utf-8');
    console.log(`  ✔ Read: ${file}`);
  }

  // Minify with terser — mangle names, compress aggressively
  const result = await minify(sourceMap, {
    compress: {
      dead_code: true,
      drop_console: false, // Keep console.warn/error for runtime debugging visibility
      passes: 2
    },
    mangle: {
      toplevel: false // Don't mangle top-level names (window.api, window.toast etc.)
    },
    format: {
      comments: false // Strip all comments
    }
  });

  if (result.error) {
    console.error('❌ Minification failed:', result.error);
    process.exit(1);
  }

  fs.writeFileSync(OUTPUT_FILE, result.code, 'utf-8');

  const srcSize = Object.values(sourceMap).reduce((sum, s) => sum + s.length, 0);
  const outSize = result.code.length;
  const savings = (((srcSize - outSize) / srcSize) * 100).toFixed(1);

  console.log(`\n✅ Bundle written to: public/dist/bundle.min.js`);
  console.log(`   Source: ${(srcSize / 1024).toFixed(1)} KB → Minified: ${(outSize / 1024).toFixed(1)} KB (${savings}% smaller)`);
  console.log('\n📋 Next step: index.html already references /dist/bundle.min.js');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
