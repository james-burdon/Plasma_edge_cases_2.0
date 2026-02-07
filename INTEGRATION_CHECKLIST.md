# ✅ Integration Checklist

Use this checklist to connect your Foundry backend with the HTML/JS frontend.

## Step 1: Deploy Contract ⚙️

- [ ] Set environment variables:
  ```batch
  set RPC_URL=https://testnet-rpc.plasma.to
  set PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
  ```

- [ ] Run deployment script:
  ```batch
  deploy.bat
  ```
  Or on Linux/Mac:
  ```bash
  ./deploy.sh
  ```

- [ ] Copy the deployed contract address (looks like `0x123...abc`)

## Step 2: Update Configuration 📝

Update the contract address in these 3 files:

- [ ] [config.js](config.js) - Line 10
  ```javascript
  ESCROW_CONTRACT_ADDRESS: "0xYOUR_ADDRESS_HERE",
  ```

- [ ] [send.js](send.js) - Line 11
  ```javascript
  const ESCROW_CONTRACT_ADDRESS = "0xYOUR_ADDRESS_HERE";
  ```

- [ ] [claim.js](claim.js) - Line 10
  ```javascript
  const ESCROW_CONTRACT_ADDRESS = "0xYOUR_ADDRESS_HERE";
  ```

**Tip**: Use Find & Replace (Ctrl+H) to replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with your actual address in all files.

## Step 3: Test the Frontend 🌐

- [ ] Start a web server:
  ```bash
  python -m http.server 8000
  ```

- [ ] Open browser to `http://localhost:8000/send.html`

- [ ] Verify you see the "Send Crypto via Link" form

## Step 4: Create Your First Escrow Link 🔗

- [ ] Fill in the form:
  - Recipient Email: `test@example.com`
  - Amount: `0.01` XPL
  - Message: `Testing escrow link!`
  - Expiry: `24 hours`

- [ ] Click "Create Escrow Link"

- [ ] Wait for transaction confirmation

- [ ] Copy the generated claim link

**Expected Result**: You should see a success message with a claim link like:
```
http://localhost:8000/claim.html#secret=0x1234...&email=test@example.com&amount=0.01&message=Testing%20escrow%20link!
```

## Step 5: Test Claiming 🎁

### Option A: Create New Account (Custodial)

- [ ] Open the claim link in a new incognito/private window

- [ ] Click "Create New Plasma Account"

- [ ] Fill in registration form:
  - Forename: `Test`
  - Surname: `User`
  - Username: `testuser`
  - Password: `password123`
  - Check the T&C box

- [ ] Click "Create Account & Claim Funds"

- [ ] Wait for transaction

- [ ] Verify redirect to dashboard

- [ ] Confirm balance shows 0.01 XPL

### Option B: Use Existing Wallet

- [ ] Open the claim link

- [ ] Click "I Have My Own Wallet Address"

- [ ] Enter your wallet address (0x...)

- [ ] Click "Claim to This Address"

- [ ] Wait for confirmation

## Step 6: (Optional) Email Integration 📧

Only needed if you want automatic email sending:

- [ ] Get Resend API key from [resend.com](https://resend.com)

- [ ] Create `.env` file:
  ```
  RESEND_API_KEY=re_your_key_here
  PORT=3000
  ```

- [ ] Install dependencies:
  ```bash
  npm install
  ```

- [ ] Start email service:
  ```bash
  npm run email-service
  ```

- [ ] Update [send.js](send.js) - Uncomment lines 70-71:
  ```javascript
  // Uncomment to enable email sending:
  await sendEmailToRecipient(recipientEmail, claimUrl, amount, message);
  ```

- [ ] Test email sending

## Common Issues & Solutions 🔧

### ❌ "Cannot read properties of undefined"
**Solution**: Make sure you updated the contract address in all 3 files.

### ❌ "Transaction failed"
**Solution**:
- Check your wallet has enough XPL for gas
- Verify PRIVATE_KEY is correct (should start with 0x)
- Confirm RPC_URL is accessible

### ❌ "Link not found"
**Solution**:
- The contract address might be wrong
- The link might have already been claimed
- Check browser console (F12) for detailed errors

### ❌ Email not sending
**Solution**:
- Verify RESEND_API_KEY in .env
- Check email service is running (npm run email-service)
- Email service is optional - links work without it

## Architecture Overview 🏗️

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  1. User fills form on send.html                         │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  2. send.js generates:                                    │
│     - Random secret (32 bytes)                           │
│     - Hash = keccak256(secret)                          │
│     - Calls: EscrowLinks.createLink(hash, TTL, memo)    │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  3. Smart Contract (EscrowLinks.sol)                     │
│     - Locks ETH on-chain                                 │
│     - Emits LinkCreated event                           │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  4. Claim link generated:                                │
│     /claim.html#secret=0x...                            │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  5. Recipient opens link                                 │
│     claim.js reads secret from URL                       │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  6. Two claiming options:                                │
│     A) Create new custodial wallet                       │
│     B) Use existing wallet address                       │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  7. claim.js calls:                                      │
│     EscrowLinks.claim(secret, recipientAddress)          │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  8. Contract verifies:                                   │
│     - Secret is correct (hash matches)                   │
│     - Link not already claimed                          │
│     - Link not expired                                  │
│     - Transfers ETH to recipient                        │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## File Reference 📚

| File | Purpose |
|------|---------|
| `src/EscrowLinks.sol` | Smart contract (Foundry) |
| `script/DeployEscrowLinks.s.sol` | Deployment script |
| `deploy.bat` / `deploy.sh` | Simplified deployment |
| `send.html` + `send.js` | Create escrow links |
| `claim.html` + `claim.js` | Claim funds |
| `dashboard.html` | View wallet balance |
| `register.html` + `register.js` | User registration |
| `config.js` | Centralized config |
| `send_email.js` | Optional email service |
| `package.json` | Node.js dependencies |

## Success Criteria ✨

You've successfully integrated when:

- ✅ Contract deployed to Plasma testnet
- ✅ Can create escrow links through web UI
- ✅ Can claim funds by clicking link
- ✅ Custodial wallets auto-generated for new users
- ✅ Dashboard shows correct balance
- ✅ No more manual bash scripts needed!

## Next Steps 🚀

After basic integration works:

1. **Add Email Sending**: Set up the email service for automatic link delivery
2. **Improve Security**: Encrypt custodial wallets, use secure backend
3. **Add Features**:
   - QR codes for mobile
   - Bulk sending
   - Link analytics
4. **Bank Integration**: Connect to traditional banking for off-ramping

## Need Help? 💬

- Check browser console (F12) for detailed error messages
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed explanations
- Test with small amounts first (0.01 XPL)
- Verify all contract addresses match across files

---

**Built for Plasma Hackathon 2.0** 🎉
