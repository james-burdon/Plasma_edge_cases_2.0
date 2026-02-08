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

let statusStep = 0;
const totalSteps = 4;

function updateStatus(message, isError = false, isDone = false) {
  if (isError) {
    statusOutput.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,60,60,.8);box-shadow:0 0 0 4px rgba(255,60,60,.15);flex-shrink:0;"></div>
        <span style="font-weight:700;font-size:13px;color:rgba(180,30,30,.9);">${message}</span>
      </div>`;
    return;
  }
  if (isDone) {
    statusOutput.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:10px;height:10px;border-radius:50%;background:rgba(32,199,180,.9);box-shadow:0 0 0 4px rgba(32,199,180,.2);flex-shrink:0;"></div>
        <span style="font-weight:800;font-size:13px;color:rgba(10,21,18,.86);">${message}</span>
      </div>
      <div style="width:100%;height:6px;border-radius:6px;background:rgba(10,21,18,.08);overflow:hidden;margin-top:10px;">
        <div style="width:100%;height:100%;border-radius:6px;background:linear-gradient(90deg,rgba(32,199,180,.7),rgba(32,199,180,.9));"></div>
      </div>`;
    return;
  }
  statusStep++;
  const pct = Math.min((statusStep / totalSteps) * 100, 95);
  statusOutput.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <div style="width:10px;height:10px;border-radius:50%;background:rgba(32,199,180,.6);box-shadow:0 0 0 4px rgba(32,199,180,.15);flex-shrink:0;"></div>
      <span style="font-weight:700;font-size:13px;color:rgba(10,21,18,.86);">${message}</span>
    </div>
    <div style="width:100%;height:6px;border-radius:6px;background:rgba(10,21,18,.08);overflow:hidden;">
      <div style="width:${pct}%;height:100%;border-radius:6px;background:linear-gradient(90deg,rgba(32,199,180,.7),rgba(32,199,180,.9));transition:width .4s ease;"></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:rgba(10,21,18,.5);font-weight:700;">Step ${statusStep} of ${totalSteps}</div>`;
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
    statusStep = 0;
    updateStatus("Generating secret and creating escrow link...");

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
    updateStatus("Submitting transaction to blockchain...");
    const tx = await escrowContract.createLink(
      hash,
      expirySeconds,
      memoHash,
      { value: parseEther(amount) }
    );

    updateStatus("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt);

    // 5. Generate the claim link
    const claimUrl = `${window.location.origin}/claim.html#secret=${secret}&email=${encodeURIComponent(recipientEmail)}&amount=${amount}&message=${encodeURIComponent(message)}`;

    // 6. Send email to recipient
    updateStatus("Sending email to recipient...");
    const emailSent = await sendEmailToRecipient(recipientEmail, claimUrl, amount, message);

    // 7. Show success and the link
    updateStatus("Escrow link created successfully!", false, true);
    linkOutput.style.display = "block";
    linkOutput.innerHTML = `
      <div style="border-radius:14px;border:1px solid rgba(32,199,180,.22);background:rgba(32,199,180,.05);padding:14px;display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:8px;height:8px;border-radius:50%;background:rgba(32,199,180,.85);box-shadow:0 0 0 3px rgba(32,199,180,.15);"></div>
          <span style="font-weight:900;font-size:14px;letter-spacing:-.02em;color:rgba(10,21,18,.88);">Link Created</span>
        </div>
        <div style="padding:10px 12px;border-radius:10px;background:${emailSent ? 'rgba(32,199,180,.08)' : 'rgba(255,180,0,.08)'};border:1px solid ${emailSent ? 'rgba(32,199,180,.2)' : 'rgba(255,180,0,.2)'};">
          <div style="font-weight:900;font-size:14px;color:${emailSent ? 'rgba(16,120,105,.9)' : 'rgba(180,120,0,.9)'};">${emailSent ? 'Email sent to ' + recipientEmail : 'Email unavailable — share the link manually'}</div>
        </div>
        <div style="border-radius:10px;border:1px solid rgba(10,21,18,.08);background:rgba(255,255,255,.85);padding:10px;word-break:break-all;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;color:rgba(10,21,18,.7);line-height:1.45;">${claimUrl}</div>
        <button id="copyLinkBtn" type="button" style="width:100%;height:38px;border-radius:10px;border:1px solid rgba(10,21,18,.1);background:rgba(10,21,18,.03);font-weight:800;font-size:13px;color:rgba(10,21,18,.75);cursor:pointer;transition:all .15s ease;">Copy Link</button>
        <div style="display:flex;align-items:center;gap:6px;padding:0 2px;">
          <span style="font-size:10px;color:rgba(10,21,18,.4);font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Tx</span>
          <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px;color:rgba(10,21,18,.45);word-break:break-all;">${receipt.hash}</span>
        </div>
      </div>
    `;
    // Hide the "Next" hint since we're showing the result
    const nextHint = linkOutput.parentElement.querySelector('.notice:last-of-type');
    if (nextHint && nextHint.textContent.includes('Next')) nextHint.style.display = 'none';
    document.getElementById("copyLinkBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(claimUrl);
      const btn = document.getElementById("copyLinkBtn");
      btn.textContent = "Copied!";
      btn.style.background = "rgba(32,199,180,.1)";
      btn.style.borderColor = "rgba(32,199,180,.25)";
      btn.style.color = "rgba(32,199,180,.9)";
      setTimeout(() => { btn.textContent = "Copy Link"; btn.style.background = ""; btn.style.borderColor = ""; btn.style.color = ""; }, 2000);
    });

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
