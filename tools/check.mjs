#!/usr/bin/env node
// Smoke check: start the local viewer, request the page over HTTP, compare the
// answer with index.html on disk, stop the viewer. Node built-ins only.
// It checks that the file is served unchanged; it does not judge the page.
//
//   node tools/check.mjs            exit 0 = served correctly, 1 = not
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createPageServer, host, root } from './serve.mjs';

const firstPort = 45500;
const lastPort = 45599;

const listen = (server, port) =>
  new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      server.off('error', reject);
      resolve();
    });
  });

const server = createPageServer();
let port = firstPort;
for (;;) {
  try {
    await listen(server, port);
    break;
  } catch (error) {
    if (error.code !== 'EADDRINUSE' || port === lastPort) {
      console.log(`FAIL  cannot listen on ${host}:${port}: ${error.code ?? error.message}`);
      process.exit(1);
    }
    port += 1;
  }
}

const problems = [];
const expect = (condition, message) => {
  console.log(`${condition ? 'ok  ' : 'FAIL'}  ${message}`);
  if (!condition) problems.push(message);
};

try {
  const onDisk = readFileSync(join(root, 'index.html'));
  const base = `http://${host}:${port}`;

  for (const path of ['/', '/index.html']) {
    const response = await fetch(base + path);
    const body = Buffer.from(await response.arrayBuffer());
    expect(response.status === 200, `GET ${path} -> ${response.status} (want 200)`);
    expect(
      response.headers.get('content-type') === 'text/html; charset=utf-8',
      `GET ${path} Content-Type is "${response.headers.get('content-type')}" (want "text/html; charset=utf-8")`,
    );
    expect(body.equals(onDisk), `GET ${path} body is ${body.length} bytes, index.html on disk is ${onDisk.length} bytes, identical: ${body.equals(onDisk)}`);
  }

  const missing = await fetch(`${base}/no-such-file`);
  await missing.arrayBuffer();
  expect(missing.status === 404, `GET /no-such-file -> ${missing.status} (want 404)`);
} catch (error) {
  expect(false, `request failed: ${error.cause?.code ?? error.message}`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}

if (problems.length > 0) {
  console.log(`\nCHECK FAILED: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`\nCHECK OK: index.html is served on ${host}:${port} and the server was stopped`);
