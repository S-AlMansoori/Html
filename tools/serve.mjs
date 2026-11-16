#!/usr/bin/env node
// Tiny local viewer for index.html. Node built-ins only, no dependencies.
// It serves the page at "/" and "/index.html" with the Content-Type that the
// _headers file asks for, and answers 404 for every other path.
// It listens on 127.0.0.1 only.
//
//   node tools/serve.mjs            http://127.0.0.1:45500/
//   node tools/serve.mjs 45501      another port
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const host = '127.0.0.1';

export function createPageServer() {
  return createServer((request, response) => {
    const path = new URL(request.url, `http://${host}`).pathname;
    const isRead = request.method === 'GET' || request.method === 'HEAD';
    if (!isRead || (path !== '/' && path !== '/index.html')) {
      response.writeHead(isRead ? 404 : 405, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(isRead ? 'Not found\n' : 'Method not allowed\n');
      return;
    }
    const body = readFileSync(join(root, 'index.html'));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': body.length });
    response.end(request.method === 'HEAD' ? undefined : body);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.argv[2] ?? 45500);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error(`Not a port number: ${process.argv[2]}`);
    process.exit(1);
  }
  const server = createPageServer();
  server.on('error', (error) => {
    console.error(`Cannot listen on ${host}:${port}: ${error.code ?? error.message}`);
    process.exit(1);
  });
  server.listen(port, host, () => console.log(`Serving index.html at http://${host}:${port}/  (Ctrl+C to stop)`));
}
