# 🚀 Plasma Escrow Links

Send crypto to anyone via link - even if they don't have a wallet! Built on Plasma blockchain with Foundry + vanilla HTML/JS.

## ✨ Features

- **🔗 Send Crypto via Link**: Create escrow links without complex bash scripts
- **👛 Custodial Wallets**: Recipients can auto-create wallets when claiming
- **🔒 Secure Escrow**: Funds locked on-chain until claimed or expired
- **📧 Email Integration**: Optional email delivery of claim links
- **⏱️ Time-Locked**: Links expire after set duration
- **🌐 Web UI**: User-friendly interface for all operations

## 🚀 Quick Start

### 1. Deploy the Smart Contract

**Option A - Windows:**
```batch
set RPC_URL=https://testnet-rpc.plasma.to
set PRIVATE_KEY=0xYOUR_PRIVATE_KEY
deploy.bat
```

**Option B - Linux/Mac:**
```bash
export RPC_URL="https://testnet-rpc.plasma.to"
export PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
chmod +x deploy.sh
./deploy.sh
```

### 2. Start Web Server

```bash
# Python
python -m http.server 8000

# Or use VS Code Live Server
```

### 3. Use the Application

1. **Send Money**: Open `http://localhost:8000/send.html`
2. **Claim Funds**: Click the generated link
3. **View Dashboard**: See your balance at `dashboard.html`

📖 **Full Setup Guide**: See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

---

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```


					Interesting part

Tests Overview

The following unit tests validate the core escrow link functionality.

testCreateAndClaim

Verifies the happy path. A sender creates a link by locking ETH, and the recipient successfully claims the funds by revealing the correct secret.

testWrongSecretFails

Ensures that providing an incorrect secret when attempting to claim a link results in a revert (link cannot be found with the wrong secret hash).

testAttackerCannotClaimWithoutSecret

Confirms that an unauthorized third party cannot claim funds without the correct secret (claim attempt reverts when no valid secret is provided).

testClaimPaysSpecifiedRecipientNotCaller

Ensures claims pay the recipient address parameter (e.g., for relayers / gasless flows), not msg.sender. A relayer can submit the claim transaction, but funds still go to the intended recipient.

testCannotClaimTwice

Confirms that each escrow link can only be claimed once and cannot be double-spent.

testCancelAfterExpiry

Checks that the original sender can cancel an unclaimed link and recover funds after the link’s expiry time has passed.

testCancelBeforeExpiryFails

Ensures that the sender cannot cancel a link before its expiry, preserving the recipient’s claim window.