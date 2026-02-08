# ✅ Integration Checklist

Use this checklist to connect the Foundry contract with the local web app.

## 1) Start the App

```bash
chmod +x start.sh
./start.sh
```

The app opens at http://localhost:3000/.

## 2) Deploy the Contract

### Option A: Admin UI (recommended)

- Visit http://localhost:3000/admin.html
- Deploy using your private key
- Confirm the contract address updates in `data/config.json`

### Option B: CLI (Foundry)

```bash
export RPC_URL="https://testnet-rpc.plasma.to"
export PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
./deploy.sh
```

After deployment, update the contract address in:
- `config.js`
- `send.js`
- `claim.js`

Also update `data/config.json` so the backend reports the correct address.

## 3) Create an Escrow Link

- Open http://localhost:3000/send.html
- Fill in recipient email + amount
- Submit and copy the generated claim link

## 4) Claim the Funds

- Open the claim link in a new window
- Either create a new account or claim with an existing wallet

## 5) Optional Email Integration

- Set `RESEND_API_KEY` in a `.env` file or environment
- Start the server (it uses `/api/send-email` automatically)

## 6) Optional Contract Tests (Foundry)

```bash
forge test
```
