# B-002 — CloudFront not routing /api/* to backend

- **Type:** Bug
- **Priority:** P1
- **Effort:** S
- **Status:** Backlog

## Problem

The beta-signup client fix (commit cf98784) now resolves the API base to
same-origin `/api` in production. But CloudFront has no behavior forwarding
`/api/*` to the `server/api.js` backend — so signup and leaderboard requests
404 against the static S3 origin. The previous hard-coded `http://54.224.95.1`
was mixed-content-blocked; this is the proper fix that still needs the infra
half wired up.

## Acceptance criteria

- [ ] CloudFront has an `/api/*` cache behavior pointing at the API origin
      (the EC2/whatever host running `server/api.js`) over HTTPS
- [ ] `POST /api/signup` and `GET /api/leaderboard` succeed from the live
      CloudFront site
- [ ] `NETTREK_ALLOWED_ORIGINS` on the API host includes the CloudFront domain
- [ ] Optionally set `VITE_API_BASE_URL` at build time instead of relying on
      the same-origin fallback
- [ ] Pending signups queued in `localStorage['nettrek-pending-signups']`
      get a flush path (background retry on next load)

## Notes / files

- `src/main.ts` — signup handler, API base resolution
- `server/api.js` — the backend (CORS allowlist already added)
- Infra-side change; coordinate with the API host deployment.
