// Match GitHub Pages' extensionless app URLs without a production build step.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml' };

http.createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    if (!path.extname(pathname)) pathname += '.html';
    const filename = path.resolve(root, '.' + pathname);
    if (!filename.startsWith(root + path.sep) || !types[path.extname(filename)]) {
      response.writeHead(404).end();
      return;
    }
    const body = await fs.readFile(filename);
    response.writeHead(200, {
      'Content-Type': types[path.extname(filename)],
      'Cache-Control': 'no-store',
    }).end(body);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4173, '127.0.0.1');
