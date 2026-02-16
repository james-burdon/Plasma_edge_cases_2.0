# 🚀 Deploy Contract Now

Use this when you want to deploy the smart contract to Plasma testnet.

## Option A: Deploy from the Admin UI (recommended)

1. Start the app (`./start.sh`).
2. Open http://localhost:3000/admin.html.
3. Deploy and follow the prompts.

This updates `data/config.json` and replaces `YOUR_DEPLOYED_CONTRACT_ADDRESS` in the frontend files.

## Option B: Deploy via CLI (Foundry)

```bash
export RPC_URL="https://testnet-rpc.plasma.to"
export PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"
./deploy.sh
```

After deployment, update the contract address in:
- `config.js`
- `send.js`
- `claim.js`

Also update `data/config.json` so the backend reports the correct address.
