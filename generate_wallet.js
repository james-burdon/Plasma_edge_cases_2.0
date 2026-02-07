import { Wallet, JsonRpcProvider } from "ethers";

// 2. Generate a new random wallet
const wallet = Wallet.createRandom();

console.log("=== Plasma Testnet Wallet ===");
console.log("Address:", wallet.address);
console.log("Mnemonic:", wallet.mnemonic.phrase);
console.log("Private Key:", wallet.privateKey);

// 3. Connect the wallet to Plasma Testnet RPC
const provider = new JsonRpcProvider("https://testnet-rpc.plasma.to");
const connectedWallet = wallet.connect(provider);

console.log("\nWallet connected to Plasma Testnet!");
