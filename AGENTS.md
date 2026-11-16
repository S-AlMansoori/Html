# Html: notes for coding agents

## What this is
A two-file static page from 2024 (`index.html`, `_headers`), made to test deploying plain HTML through Cloudflare
Pages. This repository is public: write nothing personal or private into it.

## Rules
- Do not edit `index.html` or `_headers`. The page is a broken rich-text export (it shows escaped HTML source as
  text). It is left unchanged on purpose, because a Cloudflare Pages project may still publish this repository and
  that can only be confirmed in the Cloudflare dashboard.
- Do not deploy anything.

## Layout
- `index.html`: the page (8,803 bytes)
- `_headers`: `Content-Type: text/html; charset=utf-8` for `/*`
- `tools/serve.mjs`: local viewer, Node built-ins only, binds `127.0.0.1`, serves only `/` and `/index.html`
- `tools/check.mjs`: smoke check, imports the viewer

## Commands (verified 2026-11-16, also with no network)
```sh
. /Volumes/Projects/_tools/env.sh
cd /Volumes/Projects/archive/Html
node tools/check.mjs          # exit 0 and "CHECK OK: index.html is served ..."
node tools/serve.mjs 45500    # http://127.0.0.1:45500/ until Ctrl+C
```
There is no install, build, lint or test suite.

## Facts
- Ports: 45500 to 45599 only. `check.mjs` takes the first free one; `serve.mjs` defaults to 45500.
- No environment variables, no dependencies, no network use.
- Requires Node.js with built-in `fetch` (verified with Node 24).

## Versioning
No version number (static test page). The page is identified by commits `e0197e8` (`index.html`) and `edffea3` (`_headers`), both 2024-11-21 and still the last changes to those files. Do not invent a version or add a changelog.
