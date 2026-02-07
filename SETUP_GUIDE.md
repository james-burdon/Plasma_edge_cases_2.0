# Plasma Escrow Links - Setup Guide

This guide will help you connect your Foundry backend with the HTML/JavaScript frontend.

## Prerequisites

- Node.js installed
- Foundry installed
- A funded wallet on Plasma testnet

## Step 1: Deploy the EscrowLinks Contract

Instead of running the long bash script manually, we'll simplify it:

```bash
# Set your environment variables
export RPC_URL="https://testnet-rpc.plasma.to"
export PRIVATE_KEY="0xaf09071a6eed1ca9314fb92e3460a1d49fad0caf88f3160184f6789d823eb1ef"

# Deploy the contract
forge script script/DeployEscrowLinks.s.sol:DeployEscrowLinks \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

After deployment, you'll see output like:
```
Contract deployed at: 0x1234567890abcdef...
```

**Copy this contract address!**

## Step 2: Update the Configuration

Open `config.js` and update the `ESCROW_CONTRACT_ADDRESS`:

```javascript
ESCROW_CONTRACT_ADDRESS: "0x1234567890abcdef...", // Paste your deployed address here
```

Also update the same address in:
- `send.js` (line 11)
- `claim.js` (line 10)

## Step 3: Start a Local Web Server

The frontend needs to be served over HTTP/HTTPS to work properly.

Option 1 - Python:
```bash
python -m http.server 8000
```

Option 2 - Node.js (http-server):
```bash
npx http-server -p 8000
```

Option 3 - VS Code Live Server extension:
- Install "Live Server" extension
- Right-click on `send.html` and select "Open with Live Server"

## Step 4: Test the Flow

### A. Send Crypto via Link

1. Open `http://localhost:8000/send.html`
2. Fill in:
   - Recipient email
   - Amount (e.g., 0.01 XPL)
   - Optional message
   - Expiry time
3. Click "Create Escrow Link"
4. Wait for transaction confirmation
5. Copy the generated claim link

### B. Claim Funds

1. Open the claim link in a new browser window
2. Choose one of two options:
   - **Create New Account**: Generate a custodial wallet
   - **Use Existing Wallet**: Enter your own address
3. Submit to claim the funds

### C. View Dashboard

If you created a new account during claiming:
1. You'll be redirected to `dashboard.html`
2. Your wallet balance will be displayed
3. The wallet is stored in localStorage (custodial)

## Architecture Overview

```
┌─────────────────┐
│   send.html     │ ──> User creates escrow link
│   send.js       │ ──> Calls EscrowLinks.createLink()
└─────────────────┘
        │
        ├─> Generates random secret
        ├─> Hashes secret (keccak256)
        └─> Sends transaction to contract
                    │
                    ▼
        ┌─────────────────────────┐
        │  EscrowLinks.sol        │
        │  (Foundry Contract)     │
        │                         │
        │  - createLink()         │
        │  - claim()              │
        │  - getLink()            │
        └─────────────────────────┘
                    │
                    ▼
┌─────────────────┐
│   claim.html    │ ──> Recipient opens link
│   claim.js      │ ──> Parses secret from URL
└─────────────────┘ ──> Calls EscrowLinks.claim()
        │
        ├─> Option 1: Create custodial wallet
        │   └─> Generates new wallet
        │   └─> Stores in localStorage
        │   └─> Claims to new wallet
        │
        └─> Option 2: Use existing wallet
            └─> Claims to provided address
```

## File Structure

```
Plasma_edge_cases_2.0/
├── src/
│   └── EscrowLinks.sol         # Main escrow contract
├── script/
│   └── DeployEscrowLinks.s.sol # Deployment script
├── send.html                    # UI for creating escrow links
├── send.js                      # Logic for creating links
├── claim.html                   # UI for claiming funds
├── claim.js                     # Logic for claiming
├── dashboard.html               # Wallet dashboard
├── register.html                # Account registration
├── config.js                    # Centralized configuration
└── style.css                    # Styling
```

## Key Features

1. **No Bash Scripts**: Everything runs through the web UI
2. **Custodial Wallets**: Users without wallets can create one automatically
3. **Secure Escrow**: Funds locked on-chain until claimed
4. **Email Integration**: Ready to add email sending (optional)
5. **Expiry System**: Links expire after set time

## Next Steps (Optional Enhancements)

1. **Email Sending**: Integrate `send_email.js` to automatically send claim links
2. **Backend Storage**: Move custodial wallets to secure backend
3. **Wallet Encryption**: Encrypt private keys before storing
4. **Relayer Service**: Use a relayer for gasless claiming
5. **Bank Integration**: Add bank account connection for off-ramping

## Security Notes

⚠️ **Important for Production**:
- Never expose private keys in frontend code
- Use proper encryption for custodial wallets
- Implement backend API for sensitive operations
- Use relayer services for gasless transactions
- Add rate limiting and fraud detection

## Troubleshooting

**Issue: "Cannot read properties of undefined"**
- Make sure you updated the contract address in config.js

**Issue: "Transaction failed"**
- Check that the sender wallet has enough XPL for gas
- Verify the contract is deployed correctly

**Issue: "Link not found"**
- The contract address might be wrong
- The link might have expired or been claimed

## Support

For issues or questions, check the console logs in your browser's developer tools (F12).
