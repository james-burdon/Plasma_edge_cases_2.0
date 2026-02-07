# 🚀 Deploy Contract NOW

## ✅ ENS Error Fixed!

The placeholder address `0x000...` prevents the ENS error, but **you need to deploy the actual contract** to send crypto.

## 📋 Quick Deploy (Copy & Paste):

### PowerShell:
```powershell
$env:RPC_URL="https://testnet-rpc.plasma.to"
$env:PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"
.\deploy.bat
```

### Git Bash:
```bash
export RPC_URL="https://testnet-rpc.plasma.to"
export PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"
bash deploy.sh
```

---

## 🔑 Get Your Private Key:

From MetaMask or your wallet:
1. Click account menu
2. Account Details
3. Export Private Key
4. Copy the key (starts with `0x`)

---

## 📝 After Deployment:

The script will output:
```
Contract Address: 0xABCDEF1234567890...
```

**Copy that address** and update these 3 files:

### 1. send.js (line 14)
```javascript
const ESCROW_CONTRACT_ADDRESS = "0xABCDEF1234567890...";
```

### 2. claim.js (line 12)
```javascript
const ESCROW_CONTRACT_ADDRESS = "0xABCDEF1234567890...";
```

### 3. config.js (line 9)
```javascript
ESCROW_CONTRACT_ADDRESS: "0xABCDEF1234567890...",
```

---

## ⚡ Quick Replace:

Use Find & Replace (Ctrl+H) in VS Code:
- **Find:** `0x0000000000000000000000000000000000000000`
- **Replace:** `0xYOUR_DEPLOYED_ADDRESS`
- **Files:** `send.js, claim.js, config.js`

---

## ✅ Done!

Refresh browser and try sending again. No more errors! 🎉
