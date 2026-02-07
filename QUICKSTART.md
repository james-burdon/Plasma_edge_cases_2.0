# ⚡ Quick Start Guide

## Prerequisites
- Foundry installed (`forge --version` to check)
- A funded wallet on Plasma testnet
- Your private key ready

## Step 1: Deploy Contract

### PowerShell (Recommended for Windows):
```powershell
# Set environment variables
$env:RPC_URL="https://testnet-rpc.plasma.to"
$env:PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"

# Run deployment script
.\deploy.bat
```

### Command Prompt (CMD):
```batch
# Set environment variables
set RPC_URL=https://testnet-rpc.plasma.to
set PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Run deployment script
deploy.bat
```

### Linux/Mac:
```bash
# Set environment variables
export RPC_URL="https://testnet-rpc.plasma.to"
export PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"

# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

## Step 2: Update Contract Address

The deployment will output something like:
```
Contract Address: 0x1234567890abcdef...
```

**Copy this address** and update it in these files:

1. **config.js** (line 10):
   ```javascript
   ESCROW_CONTRACT_ADDRESS: "0x1234567890abcdef...",
   ```

2. **send.js** (line 11):
   ```javascript
   const ESCROW_CONTRACT_ADDRESS = "0x1234567890abcdef...";
   ```

3. **claim.js** (line 10):
   ```javascript
   const ESCROW_CONTRACT_ADDRESS = "0x1234567890abcdef...";
   ```

**Quick Find & Replace:** Use Ctrl+H in VS Code to replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with your actual address in all files at once.

## Step 3: Start Web Server

```bash
# Python (cross-platform)
python -m http.server 8000

# Or Node.js
npx http-server -p 8000
```

## Step 4: Test It Out

1. Open browser: `http://localhost:8000/`
2. Click "Send Crypto Link"
3. Fill in form and create link
4. Open claim link in new window
5. Choose "Create New Account"
6. Claim funds!

## Common PowerShell Issues

### Issue: "deploy.bat is not recognized"
**Solution:** Use `.\deploy.bat` with the dot-slash prefix

### Issue: "Running scripts is disabled"
**Solution:** Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Environment variables not persisting
**Solution:** Set them in the same PowerShell session where you run the script, or use:
```powershell
[Environment]::SetEnvironmentVariable("RPC_URL", "https://testnet-rpc.plasma.to", "User")
[Environment]::SetEnvironmentVariable("PRIVATE_KEY", "0xYOUR_KEY", "User")
```

## Testing Checklist

- [ ] Contract deployed successfully
- [ ] Contract address updated in all 3 files
- [ ] Web server running on port 8000
- [ ] Can open http://localhost:8000/
- [ ] Can create escrow link on send.html
- [ ] Can claim link on claim.html
- [ ] Dashboard shows correct balance

## Need Help?

- **PowerShell syntax issues**: See above common issues
- **Contract errors**: Check you have enough XPL for gas
- **Frontend errors**: Press F12 to see console logs
- **Email not working**: It's optional, links work without email

---

**Next Steps:**
- Read [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md) for detailed walkthrough
- Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for architecture details
