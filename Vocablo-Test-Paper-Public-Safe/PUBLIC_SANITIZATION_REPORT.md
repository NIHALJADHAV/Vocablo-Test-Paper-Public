# PUBLIC_SANITIZATION_REPORT.md

## Purpose

This repository is a public-safe development copy of the Vocablo Test Paper Generator. It was prepared from the supplied source archive without including real credentials or private contact information.

## Changes made

- Removed the hard-coded administrator email address from `src/components/AdminAuthModal.tsx` and replaced it with `admin@example.com`.
- Removed the hard-coded administrator password and the other hard-coded password comparisons. The existing client-side admin gate remains a DEMO-ONLY gate accepting a non-empty password of at least four characters; this is **not production authentication**.
- Removed the visible default admin password from the admin UI.
- Replaced seed school contact details (addresses, phone numbers, emails, websites, and school names) with clearly fictional/demo values.
- Removed the specific Google AI Studio application URL from `README.md`.
- Replaced the deployment documentation's specific domain example with `example.com`.
- No `.env` file or real API key was included in the supplied archive. `.env.example` retains placeholders only.

## Files intentionally excluded

- `.env` / runtime secret files
- Node dependency directories such as `node_modules/`
- Build output such as `dist/`
- Git history

## Required environment variables

- `GEMINI_API_KEY` — provide your own key at runtime.
- `APP_URL` — provide the runtime application URL.

## Security limitations that remain

- The original project has a client-side/demo-style administrator gate. It must be replaced with real server-side authentication and authorization before production use.
- API endpoints and Gemini usage require further hardening (authentication, authorization, rate limiting, input validation, and abuse/cost controls).
- Storage is not yet production-persistent; the later production architecture/database phase must address this.
- This sanitization does not constitute a full security audit.

## Content note

The source contains educational sample/seed content. This sanitization focused on credentials, private contact information, runtime secrets, and deployment-specific identifiers; it did not perform a copyright or licensing review of educational content.

## Verification

The supplied archive was recursively inspected for common credential patterns and known values. The public copy contains no intentionally retained real Gemini API key, administrator password, or personal administrator email. Placeholder environment variables remain by design.

## Original project

The original source archive was not modified. This directory is a separate sanitized copy intended for a fresh public repository with fresh Git history.
