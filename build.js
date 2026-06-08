const { buildSync } = require('esbuild');
const fs = require('fs');
const path = require('path');

if (fs.existsSync('public')) fs.rmSync('public', { recursive: true });
fs.mkdirSync('public');

buildSync({
  entryPoints: ['app.jsx'],
  bundle: true,
  outfile: 'public/bundle.js',
  platform: 'browser',
  jsx: 'transform',
  minify: true,
});

const uploadsDir = 'uploads';
if (fs.existsSync(uploadsDir)) {
  fs.mkdirSync('public/uploads');
  for (const file of fs.readdirSync(uploadsDir)) {
    fs.copyFileSync(path.join(uploadsDir, file), path.join('public/uploads', file));
  }
}

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('src="dist/bundle.js"', 'src="bundle.js"');
html = html.replace(/<!-- impeccable-live-start -->[\s\S]*?<!-- impeccable-live-end -->\n?/g, '');
fs.writeFileSync('public/index.html', html);

console.log('Build complete → public/');
