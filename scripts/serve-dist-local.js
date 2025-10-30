#!/usr/bin/env node
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = '127.0.0.1';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5173;
const distDir = path.resolve(__dirname, '..', 'dist');

function send404(res) {
  res.statusCode = 404;
  res.end('Not found');
}

function mimeType(file) {
  const ext = path.extname(file).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };
  return map[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(distDir, reqPath);
    if (!filePath.startsWith(distDir)) return send404(res);
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) return send404(res);
      res.setHeader('Content-Type', mimeType(filePath));
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (e) {
    send404(res);
  }
});

server.listen(port, host, () => {
  console.log(`Serving dist from ${distDir} at http://${host}:${port}/`);
});
