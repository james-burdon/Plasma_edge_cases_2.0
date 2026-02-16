# 🚀 One Command Startup Guide

Use the single entrypoint script to install dependencies, check deployment status, start the backend, and open the browser.

## ✅ Start the App

```bash
chmod +x start.sh
./start.sh
```

Windows:

```powershell
./start.ps1
```

```bat
start.bat
```

The app opens at http://localhost:3000/.

## What the Script Does

1. Verifies Node.js is installed.
2. Installs `npm` dependencies (if missing).
3. Ensures `data/` exists.
4. Checks `data/config.json` for deployment status.
5. Starts `node server.js` and opens the browser.

## Important Behavior

- **User accounts are in-memory only** and reset on every server restart.
- Contract addresses are hardcoded in `config.js`, `send.js`, and `claim.js`.

## Manual Start (optional)

```bash
npm start
```

For deployment options and configuration details, see `README.md`.
