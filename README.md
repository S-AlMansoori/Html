# Html

A two-file static page from November 2024, made to test deploying plain HTML through Cloudflare Pages.

| File | What it is |
|---|---|
| `index.html` | the page (see "Status": it is a broken export) |
| `_headers` | Cloudflare Pages headers file: sends `Content-Type: text/html; charset=utf-8` for every path |
| `tools/serve.mjs` | tiny local viewer (Node built-ins only) |
| `tools/check.mjs` | smoke check: the page is served and is byte-identical to the file |

## Status

- **The page is broken, and it is left that way on purpose.** `index.html` is a rich-text export (its generator
  tag says "Cocoa HTML Writer"), not hand-written HTML. Its body contains the *escaped source code* of a "Loading
  Screen" page, so a browser shows that code as text instead of running it. The intended page (a loading bar with
  a percentage counter) never appears.
- Nothing has changed in the two original files since 2024-11-21. The README, the agent notes and `tools/` were
  added in November 2026 to document the repository; `index.html` and `_headers` are byte-for-byte unchanged.
- Whether a Cloudflare Pages project still serves this repository cannot be seen from the repository itself (no
  URL is recorded anywhere in it); only the Cloudflare dashboard shows that. For that reason the page has not been
  "fixed": a change to `index.html` on the production branch could change a live site.
- If a Pages project does publish this repository's root folder, the documentation files and `tools/` would be
  published as static files too once they reach the production branch.

## Versioning

This repository has **no version number**: it is a static test page, not a released product, so there is no
`package.json`, no `VERSION` file, no release tags and no changelog, and no site version is stamped in the page. The
page is identified by the git commit of `index.html` and `_headers`: neither has changed since
2024-11-21 (`index.html` since commit `e0197e86d4c64f7770d7536aa86424719e0fc42e`, `_headers` since
`edffea3e15ee7075f340e3723634d30842844ae9`). Everything else in the
repository (README, agent notes, `tools/`) was added in November 2026 and documents or checks those two files.
`git log -- index.html _headers` shows this. Because the repository may be published as a site, a date version
would only make sense if the owner starts changing the page; none is invented here.

## View it locally (works offline)

The only requirement is Node.js. There are no dependencies and nothing to install.

```sh
. /Volumes/Projects/_tools/env.sh
cd /Volumes/Projects/archive/Html
node tools/serve.mjs 45500
```

Then open <http://127.0.0.1:45500/>. Stop the viewer with Ctrl+C. If the port is taken, pass any other free one
from 45500 to 45599. You will see the source code of the "Loading Screen" page as plain text: that is the broken
export described above, not a fault of the viewer.

The first line puts a locally stored Node 24 on `PATH` and the second goes to the local checkout. Anywhere else,
skip both and run `node tools/serve.mjs` from the repository folder with any current Node.js.

The viewer listens on `127.0.0.1` only, serves `/` and `/index.html` with the header from `_headers`, and
answers 404 for everything else.

## Check (works offline)

```sh
. /Volumes/Projects/_tools/env.sh
cd /Volumes/Projects/archive/Html
node tools/check.mjs
```

It starts the viewer on the first free port from 45500 to 45599, requests `/`, `/index.html` and a path that does
not exist, compares status, `Content-Type` and body with the file on disk, and stops the viewer. Expected last
line: `CHECK OK: index.html is served on 127.0.0.1:<port> and the server was stopped`. Exit code 0 means pass, 1
means fail.

The check proves that the file is served unchanged. It does not, and cannot, prove that the page is a good page.

## What is not here

- No build step, no package manager, no tests beyond the smoke check above.
- No environment variables are read, so there is no `.env.example`.
- No network or cloud service is contacted by the page or the tools (the only URL in `index.html` is the document
  type declaration).
- No deployment configuration other than `_headers`. Deploying is not part of this repository's tooling.
