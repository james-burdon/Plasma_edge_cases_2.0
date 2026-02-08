import {
  Wallet,
  JsonRpcProvider,
  parseEther,
  Contract,
  keccak256,
  randomBytes,
  hexlify,
  Network
} from "https://cdn.jsdelivr.net/npm/ethers@6.16.0/dist/ethers.min.js";

// Configuration
const RPC_URL = "https://testnet-rpc.plasma.to";
const ESCROW_CONTRACT_ADDRESS = "0x8826F1D05Fc8c403df65dC57E3b8F6711344a48a";

// EscrowLinks ABI (only the functions we need)
const ESCROW_ABI = [
  "function createLink(bytes32 hash, uint64 ttlSeconds, bytes32 memoHash) external payable",
  "function getLink(bytes32 hash) external view returns (address sender, uint128 amount, uint64 expiry, bool claimed, bytes32 memoHash)",
  "event LinkCreated(bytes32 indexed hash, address indexed sender, uint256 amount, uint64 expiry, bytes32 indexed memoHash)"
];

// Check if user is logged in
const storedPrivateKey = sessionStorage.getItem("plasmaPrivateKey");
if (!storedPrivateKey) {
  alert("Please login first!");
  window.location.href = "login.html";
  throw new Error("Not logged in");
}

// Create provider with Plasma network config (ENS disabled)
const plasmaNetwork = Network.from({
  name: "plasma-testnet",
  chainId: 9746,
  ensAddress: null,
  ensNetwork: null
});

const provider = new JsonRpcProvider(RPC_URL, plasmaNetwork, {
  staticNetwork: plasmaNetwork
});

// Use logged-in user's wallet
const senderWallet = new Wallet(storedPrivateKey, provider);
const escrowContract = new Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, senderWallet);

const statusOutput = document.getElementById("statusOutput");
const linkOutput = document.getElementById("linkOutput");
const sendButton = document.getElementById("sendButton");

function updateStatus(message, isError = false) {
  statusOutput.innerHTML = `<p style="color: ${isError ? 'red' : 'green'}">${message}</p>`;
}

document.getElementById("sendForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const recipientEmail = document.getElementById("recipientEmail").value;
  const amount = document.getElementById("amount").value;
  const message = document.getElementById("message").value;
  const expirySeconds = parseInt(document.getElementById("expiry").value);

  try {
    // Check if contract is deployed
    if (!ESCROW_CONTRACT_ADDRESS || ESCROW_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      updateStatus("❌ Contract not deployed!", true);
      window.location.href = "/setup.html";
      return;
    }

    sendButton.disabled = true;
    updateStatus("⏳ Generating secret and creating escrow link...");

    // 1. Generate random secret (32 bytes)
    const secret = hexlify(randomBytes(32));
    console.log("🔐 Generated secret:", secret);

    // 2. Hash the secret
    const hash = keccak256(secret);
    console.log("🔒 Hash:", hash);

    // 3. Create memo hash from email
    const memoHash = keccak256(new TextEncoder().encode(recipientEmail));
    console.log("📝 Memo hash:", memoHash);

    // 4. Call createLink on the contract
    updateStatus("⏳ Submitting transaction to blockchain...");
    const tx = await escrowContract.createLink(
      hash,
      expirySeconds,
      memoHash,
      { value: parseEther(amount) }
    );

    updateStatus("⏳ Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);

    // 5. Generate the claim link
    const claimUrl = `${window.location.origin}/claim.html#secret=${secret}&email=${encodeURIComponent(recipientEmail)}&amount=${amount}&message=${encodeURIComponent(message)}`;

    // 6. Send email to recipient
    updateStatus("📧 Sending email to recipient...");
    const emailSent = await sendEmailToRecipient(recipientEmail, claimUrl, amount, message);

    // 7. Show success and the link
    updateStatus("✅ Escrow link created successfully!");
    linkOutput.style.display = "block";
    linkOutput.innerHTML = `
      <div style="padding: 20px; background: #e8f5e9; border-radius: 8px;">
        <h3>🎉 Link Created!</h3>
        ${emailSent
          ? `<p style="color: green;">✅ Email sent to ${recipientEmail}</p>`
          : `<p style="color: orange;">⚠️ Email service unavailable. Please send the link manually.</p>`
        }
        <p><strong>Claim link:</strong></p>
        <div style="background: white; padding: 10px; border-radius: 4px; word-break: break-all; margin: 10px 0;">
          <code>${claimUrl}</code>
        </div>
        <button onclick="navigator.clipboard.writeText('${claimUrl}')" style="margin-top: 10px;">
          📋 Copy Link
        </button>
        <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
          Transaction hash: <code>${receipt.hash}</code>
        </p>
      </div>
    `;

  } catch (error) {
    console.error("❌ Error:", error);
    updateStatus(`❌ Error: ${error.message || error}`, true);
  } finally {
    sendButton.disabled = false;
  }
});

// Function to send email via backend
async function sendEmailToRecipient(email, claimUrl, amount, message) {
  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, claimUrl, amount, message })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Email sent successfully:", data);
      return true;
    } else {
      console.warn("⚠️ Email sending failed, but link is still valid");
      return false;
    }
  } catch (error) {
    console.warn("⚠️ Email service unavailable, but link is still valid");
    return false;
  }
}
