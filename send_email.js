// Email Service for Plasma Escrow Links
// This is a Node.js backend service that sends claim links via email

import "dotenv/config";
import { Resend } from "resend";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template for claim links
function generateEmailHTML(recipientName, amount, claimUrl, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .amount {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .message {
          background: white;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
          font-style: italic;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎁 You've Received Crypto!</h1>
        </div>
        <div class="content">
          <p>Hi${recipientName ? " " + recipientName : ""}!</p>

          <p>Great news! Someone has sent you crypto on the Plasma network.</p>

          <div class="amount">💰 ${amount} XPL</div>

          ${message ? `<div class="message">"${message}"</div>` : ''}

          <p>Click the button below to claim your funds:</p>

          <a href="${claimUrl}" class="button">Claim My Crypto</a>

          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <code>${claimUrl}</code>
          </p>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            <strong>Don't have a wallet?</strong> No problem! You can create one when you claim.
          </p>

          <div class="footer">
            <p>This is a secure escrow link powered by Plasma blockchain.</p>
            <p>© 2026 Plasma - Your funds are safe and waiting for you!</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// API endpoint to send claim email
app.post("/api/send-email", async (req, res) => {
  try {
    const { email, claimUrl, amount, message, recipientName } = req.body;

    if (!email || !claimUrl || !amount) {
      return res.status(400).json({
        error: "Missing required fields: email, claimUrl, amount"
      });
    }

    const result = await resend.emails.send({
      from: "Plasma Wallet <onboarding@resend.dev>", // Update with your verified domain
      to: email,
      subject: `🎁 You've received ${amount} XPL!`,
      html: generateEmailHTML(recipientName, amount, claimUrl, message)
    });

    console.log("✅ Email sent successfully:", result);

    res.json({
      success: true,
      messageId: result.id
    });

  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res.status(500).json({
      error: "Failed to send email",
      details: error.message
    });
  }
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "plasma-email-service" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`📧 Email service running on port ${PORT}`);
  console.log(`✅ Ready to send escrow claim links`);
});

// For testing purposes - send a test email
if (process.argv[2] === "test") {
  const testEmail = process.argv[3] || "test@example.com";
  const testUrl = "http://localhost:8000/claim.html#secret=0x123...";

  fetch(`http://localhost:${PORT}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      claimUrl: testUrl,
      amount: "0.01",
      message: "This is a test!"
    })
  })
  .then(res => res.json())
  .then(data => console.log("Test result:", data))
  .catch(err => console.error("Test failed:", err));
}
