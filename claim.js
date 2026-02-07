import {
  Wallet,
  JsonRpcProvider,
  Contract,
  keccak256,
  formatEther,
  Network
} from "https://cdn.jsdelivr.net/npm/ethers@6.16.0/dist/ethers.min.js";

// Configuration
const RPC_URL = "https://testnet-rpc.plasma.to";
const ESCROW_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

// EscrowLinks ABI
const ESCROW_ABI = [
  "function claim(bytes32 secret, address recipient) external",
  "function getLink(bytes32 hash) external view returns (address sender, uint128 amount, uint64 expiry, bool claimed, bytes32 memoHash)"
];

// Create provider with Plasma network config (ENS disabled)
const plasmaNetwork = Network.from({
  name: "plasma-testnet",
  chainId: 9746
});

const provider = new JsonRpcProvider(RPC_URL, plasmaNetwork, {
  staticNetwork: true,
  ensAddress: null
});

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.hash.substring(1));
const secret = urlParams.get("secret");
const senderEmail = urlParams.get("email");
const displayAmount = urlParams.get("amount");
const senderMessage = urlParams.get("message");

const loadingStatus = document.getElementById("loadingStatus");
const claimInfo = document.getElementById("claimInfo");
const errorDisplay = document.getElementById("errorDisplay");
const errorMessage = document.getElementById("errorMessage");
const claimStatus = document.getElementById("claimStatus");

// UI elements
const createAccountBtn = document.getElementById("createAccountBtn");
const useExistingBtn = document.getElementById("useExistingBtn");
const newAccountForm = document.getElementById("newAccountForm");
const existingWalletForm = document.getElementById("existingWalletForm");

let linkData = null;

// Initialize
async function init() {
  if (!secret) {
    showError("Invalid claim link. No secret found.");
    return;
  }

  try {
    // Verify the link exists on-chain
    const hash = keccak256(secret);
    const escrowContract = new Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, provider);

    linkData = await escrowContract.getLink(hash);

    if (linkData.sender === "0x0000000000000000000000000000000000000000") {
      showError("This link does not exist or has already been claimed.");
      return;
    }

    if (linkData.claimed) {
      showError("This link has already been claimed.");
      return;
    }

    const expiry = Number(linkData.expiry);
    if (Date.now() / 1000 > expiry) {
      showError("This link has expired.");
      return;
    }

    // Show claim info
    document.getElementById("amountDisplay").textContent =
      displayAmount || formatEther(linkData.amount);

    if (senderMessage) {
      document.getElementById("messageDisplay").textContent =
        `"${decodeURIComponent(senderMessage)}"`;
    }

    loadingStatus.style.display = "none";
    claimInfo.style.display = "block";

  } catch (error) {
    console.error("❌ Init error:", error);
    showError(`Failed to load claim data: ${error.message}`);
  }
}

function showError(msg) {
  loadingStatus.style.display = "none";
  claimInfo.style.display = "none";
  errorDisplay.style.display = "block";
  errorMessage.textContent = msg;
}

function updateClaimStatus(msg, isError = false) {
  claimStatus.innerHTML = `<p style="color: ${isError ? 'red' : 'green'}">${msg}</p>`;
}

// Button handlers
createAccountBtn.addEventListener("click", () => {
  newAccountForm.style.display = "block";
  existingWalletForm.style.display = "none";
});

useExistingBtn.addEventListener("click", () => {
  existingWalletForm.style.display = "block";
  newAccountForm.style.display = "none";
});

// Create new account and claim
document.getElementById("registerClaimForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    updateClaimStatus("⏳ Creating your custodial wallet...");

    // Generate new wallet for user
    const newWallet = Wallet.createRandom();
    const connectedWallet = newWallet.connect(provider);

    // Store user data
    const userData = {
      forename: document.getElementById("forename").value,
      surname: document.getElementById("surname").value,
      username: document.getElementById("username").value,
      walletAddress: newWallet.address,
      privateKey: newWallet.privateKey, // WARNING: In production, this should be encrypted!
      mnemonic: newWallet.mnemonic.phrase
    };

    // Save to localStorage (in production, use secure backend)
    localStorage.setItem("plasmaUserWallet", JSON.stringify(userData));
    sessionStorage.setItem("plasmaUserProfile", JSON.stringify({
      forename: userData.forename,
      surname: userData.surname,
      username: userData.username
    }));

    // Claim to the new wallet
    await claimFunds(connectedWallet.address);

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 3000);

  } catch (error) {
    console.error("❌ Account creation error:", error);
    updateClaimStatus(`❌ Error: ${error.message}`, true);
  }
});

// Claim to existing wallet
document.getElementById("existingClaimForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const walletAddress = document.getElementById("walletAddress").value;

  if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    updateClaimStatus("❌ Invalid wallet address format", true);
    return;
  }

  await claimFunds(walletAddress);
});

// Core claim function
async function claimFunds(recipientAddress) {
  try {
    updateClaimStatus("⏳ Claiming funds...");

    // We need a wallet with funds to pay for gas
    // In production, you'd use a relayer or have the sender pay gas
    const gasPayerKey = "0xaf09071a6eed1ca9314fb92e3460a1d49fad0caf88f3160184f6789d823eb1ef";
    const gasPayerWallet = new Wallet(gasPayerKey, provider);

    const escrowContract = new Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, gasPayerWallet);

    updateClaimStatus("⏳ Submitting claim transaction...");
    const tx = await escrowContract.claim(secret, recipientAddress);

    updateClaimStatus("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();

    updateClaimStatus(`✅ Success! Funds claimed to ${recipientAddress}<br>Transaction: ${receipt.hash}`);

  } catch (error) {
    console.error("❌ Claim error:", error);
    updateClaimStatus(`❌ Claim failed: ${error.message}`, true);
  }
}

// Start
init();
