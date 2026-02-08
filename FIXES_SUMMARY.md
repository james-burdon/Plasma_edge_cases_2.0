# ✅ Current Behavior Summary

This document summarizes the current state of the repo after recent fixes and cleanup.

## ✅ ENS Error Fix

- The frontend uses an explicit Plasma network config with ENS disabled.
- If you see caching issues, hard refresh your browser.

## ✅ Navigation

- A shared navigation bar (`nav.js`) is included on key pages.

## ✅ In-Memory Users

- User accounts are **in-memory only** and reset on each server restart.
- `data/config.json` persists the deployment configuration only.

## ✅ Startup Flow

- Recommended: `./start.sh` (installs deps, checks deploy status, starts server, opens browser).
- Optional: `npm start` (backend only).

## ✅ Optional Email Integration

- Set `RESEND_API_KEY` to enable `/api/send-email`.

## Quick Verification

1. Run `./start.sh`.
2. Register a new user.
3. Create an escrow link on `/send.html`.
4. Claim the link in a new window.
