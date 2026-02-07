// Plasma Escrow Configuration
export const config = {
  // Network settings
  RPC_URL: "https://testnet-rpc.plasma.to",
  CHAIN_ID: 9746, // Plasma testnet chain ID (correct value)
  NETWORK_NAME: "plasma-testnet",

  // Contract addresses (MUST DEPLOY FIRST)
  ESCROW_CONTRACT_ADDRESS: "0x0000000000000000000000000000000000000000", // Placeholder

  // Default settings
  DEFAULT_TTL: 86400, // 24 hours in seconds

  // Gas payer wallet (for gasless claims)
  // In production, use a relayer service instead of exposing private key
  GAS_PAYER_PRIVATE_KEY: "0xaf09071a6eed1ca9314fb92e3460a1d49fad0caf88f3160184f6789d823eb1ef",

  // Email service (optional)
  EMAIL_API_ENDPOINT: "/api/send-email",

  // App URLs
  BASE_URL: window.location.origin
};

// EscrowLinks contract ABI
export const ESCROW_ABI = [
  "function createLink(bytes32 hash, uint64 ttlSeconds, bytes32 memoHash) external payable",
  "function claim(bytes32 secret, address recipient) external",
  "function cancel(bytes32 hash) external",
  "function getLink(bytes32 hash) external view returns (address sender, uint128 amount, uint64 expiry, bool claimed, bytes32 memoHash)",
  "event LinkCreated(bytes32 indexed hash, address indexed sender, uint256 amount, uint64 expiry, bytes32 indexed memoHash)",
  "event Claimed(bytes32 indexed hash, address indexed recipient, uint256 amount)",
  "event Cancelled(bytes32 indexed hash, address indexed sender, uint256 amount)"
];
