import {readFileSync, writeFileSync, readdirSync, mkdirSync} from 'node:fs';

const types = {
  html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8', webmanifest: 'application/manifest+json',
  svg: 'image/svg+xml', png: 'image/png', ico: 'image/x-icon'
};
const assets = {};
for (const file of readdirSync('dist', {withFileTypes: true})) {
  if (!file.isFile()) continue;
  const type = types[file.name.split('.').at(-1)];
  if (!type) continue;
  assets['/' + file.name] = {type, data: readFileSync('dist/' + file.name).toString('base64')};
}
assets['/'] = assets['/index.html'];
mkdirSync('dist/server', {recursive: true});
const worker = readFileSync('worker/index.js', 'utf8');
writeFileSync('dist/server/index.js', worker.replace("import assets from './assets.js';", 'const assets = ' + JSON.stringify(assets) + ';'));
