# Plasma Escrow Links (Plasma Hackathon 2.0)

Send XPL to anyone using escrow links. This repo ships a Node/Express backend, a static HTML/JS frontend, and a Foundry smart contract.

## Quick Start (recommended)

Use the single entrypoint script so it installs deps, checks deployment state, starts the server, and opens the browser for you.

```bash
chmod +x start.sh
./start.sh
```

Windows alternatives:

```powershell
./start.ps1
```

```bat
start.bat
```

The app opens at http://localhost:3000/.

## What `start.sh` does

1. Verifies Node.js is installed.
2. Installs `npm` dependencies if needed.
3. Ensures the `data/` directory exists.
4. Checks deployment status from `data/config.json`.
5. Starts the backend (`node server.js`) and opens a browser.

## Manual Start (optional)

If you want the backend only:

```bash
npm start
```

## Deployment Notes

The frontend uses a hardcoded contract address (in `config.js`, `send.js`, and `claim.js`). When you deploy a new contract, update those files.

Options:

- **Use the admin deploy endpoint** (recommended for local use):
  - Start the server.
  - Visit http://localhost:3000/admin.html and deploy there.
  - This updates `data/config.json` and the frontend contract address placeholders.
- **Use `deploy.sh`** (Foundry required):
  - Set `RPC_URL` and `PRIVATE_KEY`.
  - Run `./deploy.sh` and follow prompts to update the frontend files.
  - If you deploy this way, also update `data/config.json` so the backend reports the correct address.

## Data & Storage

- User accounts are **in-memory only**. They reset on every server restart.
- `data/config.json` stores the deployed contract address and deployment status.

## Optional Email Service

To enable email sending, set `RESEND_API_KEY` in your environment (or a `.env` file). The app will then use `/api/send-email`.

## Tests (Foundry)

Smart contract tests live under `test/` and can be run with Foundry (the template Counter example has been removed to keep tests focused on EscrowLinks):

```bash
forge test
```

These tests are optional and do not affect `start.sh` or the backend.

## Project Structure

```
.
├── server.js               # Express backend
├── start.sh                # One-command startup (recommended)
├── src/                    # Foundry contracts
├── script/                 # Foundry deploy scripts
├── data/config.json        # Deployment config
├── *.html / *.js           # Frontend UI and logic
└── test/                   # Foundry tests
```

## Environment Variables

```bash
# Backend
export PORT=3000
export ENCRYPTION_KEY="<32-byte hex>"

# Deploy
export RPC_URL="https://testnet-rpc.plasma.to"
export PRIVATE_KEY="0x..."

# Optional email
export RESEND_API_KEY="re_..."
```
