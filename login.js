const API_URL = "http://localhost:3000/api";

const statusOutput = document.getElementById("statusOutput");
const loginButton = document.getElementById("loginButton");
const deploymentWalletButton = document.getElementById("deploymentWalletButton");

function updateStatus(message, isError = false) {
  statusOutput.innerHTML = `<p style="color: ${isError ? 'red' : 'green'}">${message}</p>`;
}

// Login with deployment wallet (has funds)
deploymentWalletButton.addEventListener("click", async () => {
  try {
    deploymentWalletButton.disabled = true;
    updateStatus("Loading deployment wallet...");

    const response = await fetch(`${API_URL}/deployment-wallet`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to load deployment wallet");
    }

    sessionStorage.setItem("plasmaPrivateKey", data.privateKey);
    sessionStorage.setItem("plasmaUser", JSON.stringify({
      username: "deployment",
      walletAddress: data.address
    }));

    updateStatus("Logged in with deployment wallet! Redirecting...");

    setTimeout(() => {
      window.location.href = "send.html";
    }, 1000);

  } catch (error) {
    console.error("Deployment wallet error:", error);
    updateStatus(`${error.message}`, true);
    deploymentWalletButton.disabled = false;
  }
});

// Regular login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    loginButton.disabled = true;
    updateStatus("⏳ Logging in...");

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Store user session
    sessionStorage.setItem("plasmaUser", JSON.stringify(data.user));
    sessionStorage.setItem("plasmaPrivateKey", data.privateKey);

    updateStatus("✅ Login successful! Redirecting...");

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (error) {
    console.error("❌ Login error:", error);
    updateStatus(`❌ ${error.message}`, true);
  } finally {
    loginButton.disabled = false;
  }
});
