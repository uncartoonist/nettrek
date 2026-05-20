# B-001 — Hashed assets lack Cache-Control immutable headers

- **Type:** Bug / tech debt
- **Priority:** P2
- **Effort:** S
- **Status:** Backlog

## Problem

`dist/assets/index-<hash>.js` is content-hashed (cache-busts on every build)
but is served with no `Cache-Control` header. Verified live: CloudFront
returns the asset with only `etag` + `last-modified`, no `cache-control`.
Browsers fall back to heuristic caching and revalidate more than they need
to. Hashed assets can safely be cached forever.

## Acceptance criteria

- [ ] `/assets/*` served with `Cache-Control: public, max-age=31536000, immutable`
- [ ] `index.html` served with a short TTL (`no-cache` or `max-age=60`) so new
      builds are picked up promptly
- [ ] Verified with `curl -I` against the CloudFront URL

## Notes / files

- `scripts/deploy-dev.sh` — the `aws s3 sync` could set `--cache-control`
  per-path (two sync passes: assets immutable, html short-TTL), or configure
  it on the CloudFront distribution / S3 object metadata.
- Pure infra change; no game code involved.
