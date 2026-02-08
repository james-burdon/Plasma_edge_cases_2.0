# Plasma Escrow Links - Setup Guide

This guide aligns with the current `start.sh` workflow and the in-memory user store.

## Prerequisites

- Node.js installed
- Foundry installed (only if you want to deploy or run contract tests)
- A funded wallet on Plasma testnet for deployment

## Recommended Setup

```bash
chmod +x start.sh
./start.sh
```

The script installs dependencies (if needed), checks deployment status in `data/config.json`, starts the backend, and opens http://localhost:3000/.

## Deployment Options

### Option A: Deploy from the Admin UI (recommended)

1. Start the server.
2. Open http://localhost:3000/admin.html.
3. Deploy and follow the prompts.

This updates `data/config.json` and replaces `YOUR_DEPLOYED_CONTRACT_ADDRESS` in the frontend files.

### Option B: Deploy via `deploy.sh`

```bash
export RPC_URL="https://testnet-rpc.plasma.to"
export PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
./deploy.sh
```

After deployment, update the address in:
- `config.js`
- `send.js`
- `claim.js`

If you deploy via the script, also update `data/config.json` so the backend reflects the correct contract address.

## Manual Backend Start (optional)

```bash
npm start
```

## Notes

- User accounts are **in-memory only** and reset on every server restart.
- For contract tests, run `forge test`.
