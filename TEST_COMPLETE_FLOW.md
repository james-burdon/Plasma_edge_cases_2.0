# ✅ Complete Flow Test

This document tests the ENTIRE system to ensure everything works.

## 🎯 What's Fixed:

1. ✅ **ENS Error** - Contract address fetched dynamically from backend
2. ✅ **Localhost Opens** - start.bat/start.ps1 auto-opens browser
3. ✅ **Navigation** - All pages have back/home buttons
4. ✅ **Fresh Database** - In-memory storage, clears on restart
5. ✅ **Setup Guide** - Clear instructions when contract not deployed

## 🧪 Test 1: Server Starts & Opens Browser

```powershell
# Stop any running server (Ctrl+C)

# Start fresh
npm start
```

**Expected:**
- ✅ Browser opens to `http://localhost:3000/`
- ✅ You see the homepage with nav buttons
- ✅ Console shows: "Server running on http://localhost:3000/"

**Result:** PASS / FAIL

---

## 🧪 Test 2: Navigation Works

**Steps:**
1. Click "Login" in nav bar
2. Click "← Back" button
3. Click "🏠 Home" button

**Expected:**
- ✅ Links work
- ✅ Back button returns to previous page
- ✅ Home returns to index.html

**Result:** PASS / FAIL

---

## 🧪 Test 3: User Registration (Fresh Each Time)

**Steps:**
1. Go to http://localhost:3000/register.html
2. Register with username "test1"
3. Check console: should show "User registered: test1 (in-memory)"
4. Stop server (Ctrl+C)
5. Start server again (npm start)
6. Try registering "test1" again

**Expected:**
- ✅ First registration works
- ✅ After restart, can reuse "test1"
- ✅ No "username already exists" error

**Result:** PASS / FAIL

---

## 🧪 Test 4: Contract Not Deployed (Graceful Handling)

**Steps:**
1. Go to http://localhost:3000/send.html
2. Try to send crypto

**Expected:**
- ✅ NO ENS ERROR
- ✅ Redirects to setup.html
- ✅ Shows clear instructions

**Result:** PASS / FAIL

---

## 🧪 Test 5: Contract Deployment

**Steps:**
```powershell
$env:RPC_URL="https://testnet-rpc.plasma.to"
$env:PRIVATE_KEY="0xYOUR_KEY"
.\deploy.bat
```

**Expected:**
- ✅ Deploys successfully
- ✅ Shows contract address
- ✅ No errors

**Result:** PASS / FAIL

**Contract Address:** `0x________________`

---

## 🧪 Test 6: Update Configuration

**Steps:**
1. Copy contract address from deployment
2. Open VS Code
3. Press Ctrl+Shift+H (Find & Replace in Files)
4. Find: `0x0000000000000000000000000000000000000000`
5. Replace with your contract address
6. Replace in: send.js, claim.js, config.js

**Expected:**
- ✅ 3 files updated
- ✅ All occurrences replaced

**Result:** PASS / FAIL

---

## 🧪 Test 7: Sending Crypto (ENS Error Test)

**Steps:**
1. Restart server (npm start)
2. Register new user
3. Go to send.html
4. Enter:
   - Email: test@example.com
   - Amount: 0.01
   - Message: Test
5. Click "Create Escrow Link"

**Expected:**
- ✅ **NO ENS ERROR** ← MOST IMPORTANT
- ✅ Transaction submits
- ✅ Link generated
- ✅ Shows success message

**Result:** PASS / FAIL

**Error (if any):** _______________________

---

## 🧪 Test 8: Email Integration (Optional)

**Prerequisites:** RESEND_API_KEY in .env

**Steps:**
1. Add API key to .env
2. Restart server
3. Send crypto to your email
4. Check inbox

**Expected:**
- ✅ Email received
- ✅ Contains claim link
- ✅ Beautiful HTML template

**Result:** PASS / FAIL (or SKIPPED)

---

## 🧪 Test 9: Claiming Funds

**Steps:**
1. Copy claim link from send test
2. Open in incognito window
3. Choose "Create New Account"
4. Fill in details
5. Click claim

**Expected:**
- ✅ Account created
- ✅ Funds claimed
- ✅ Redirected to dashboard
- ✅ Balance shows claimed amount

**Result:** PASS / FAIL

---

## 🧪 Test 10: Complete Restart Test

**Steps:**
1. Stop server (Ctrl+C)
2. Start server (npm start)
3. Try to login with previous username

**Expected:**
- ✅ Login fails (user doesn't exist)
- ✅ Can register with same username
- ✅ Fresh database confirmed

**Result:** PASS / FAIL

---

## 📊 Final Results

| Test | Status |
|------|--------|
| 1. Server Starts | ⬜ PASS / ⬜ FAIL |
| 2. Navigation | ⬜ PASS / ⬜ FAIL |
| 3. User Registration | ⬜ PASS / ⬜ FAIL |
| 4. Contract Handling | ⬜ PASS / ⬜ FAIL |
| 5. Deployment | ⬜ PASS / ⬜ FAIL |
| 6. Configuration | ⬜ PASS / ⬜ FAIL |
| 7. **ENS Error Test** | ⬜ **PASS** / ⬜ **FAIL** |
| 8. Email (Optional) | ⬜ PASS / ⬜ FAIL / ⬜ SKIP |
| 9. Claiming | ⬜ PASS / ⬜ FAIL |
| 10. Restart Test | ⬜ PASS / ⬜ FAIL |

**Overall:** ⬜ ALL PASS / ⬜ SOME FAIL

---

## 🐛 If Tests Fail:

### ENS Error Still Appears:
1. Hard refresh browser: `Ctrl + Shift + R`
2. Clear browser cache completely
3. Check contract address is valid (not 0x000...)
4. Check console for actual error

### Server Won't Start:
```powershell
# Kill existing process
taskkill /F /IM node.exe

# Reinstall
npm install

# Try again
npm start
```

### Contract Deployment Fails:
- Check you have XPL for gas
- Verify private key is correct
- Check RPC URL is accessible
- Try manual deployment with foundry

---

## ✅ Success Criteria:

All tests should PASS, especially:
- ✅ Test 1: Server auto-opens browser
- ✅ Test 3: Fresh database works
- ✅ **Test 7: NO ENS ERROR** ← CRITICAL
- ✅ Test 9: Full send→claim flow works

---

## 📝 Notes:

**Time to Complete:** ~10-15 minutes

**Prerequisites:**
- Node.js installed
- Foundry installed (for deployment)
- XPL in wallet for gas

**After Testing:**
Document any failures and their error messages for debugging.
