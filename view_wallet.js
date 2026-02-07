console.log("✅ view_wallet.js loaded");

import {
  Wallet,
  JsonRpcProvider,
  formatEther
} from "https://cdn.jsdelivr.net/npm/ethers@6.16.0/dist/ethers.min.js";

console.log("✅ ethers imported");

const wallet_key =
  "0x316a6df79c678f420a352b2ef577d4d16bd94462d9bb12b537b6e1360733ec61";

console.log("🔑 Wallet key length:", wallet_key.length);

// Plasma provider
const provider = new JsonRpcProvider("https://testnet-rpc.plasma.to");
console.log("🌐 Provider created");

// Wallet
const wallet = new Wallet(wallet_key, provider);
console.log("👛 Wallet address:", wallet.address);

// DOM check
const output = document.getElementById("walletOutput");
if (!output) {
  console.error("❌ walletOutput div not found");
} else {
  console.log("✅ walletOutput div found");
}

// Polling function
async function updateBalance() {
  try {
    console.log("🔄 Fetching balance...");
    const balanceWei = await provider.getBalance(wallet.address);
    const balanceXPL = formatEther(balanceWei);

    output.innerHTML = `
      <p><strong>Wallet:</strong><br>${wallet.address}</p>
      <p><strong>Balance:</strong> ${balanceXPL} XPL</p>
      <p><em>Last updated: ${new Date().toLocaleTimeString()}</em></p>
    `;

    console.log("✅ Balance updated:", balanceXPL);
  } catch (err) {
    console.error("❌ Balance fetch failed:", err);
    output.innerText = "Error fetching balance. See console.";
  }
}

// Run immediately
updateBalance();

// Then poll every 5 seconds
setInterval(updateBalance, 5000);
