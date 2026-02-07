#!/bin/bash
# Simplified EscrowLinks Deployment Script

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Plasma Escrow Links Deployment      ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check environment variables
: "${RPC_URL:?Please set RPC_URL environment variable}"
: "${PRIVATE_KEY:?Please set PRIVATE_KEY environment variable}"

echo -e "${YELLOW}RPC URL:${NC} $RPC_URL"
echo ""

# Deploy the contract
echo -e "${YELLOW}Deploying EscrowLinks contract...${NC}"
forge script script/DeployEscrowLinks.s.sol:DeployEscrowLinks \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  --silent

# Find the latest broadcast json
RUN_JSON="$(ls -t broadcast/DeployEscrowLinks.s.sol/*/run-latest.json 2>/dev/null | head -n 1)"

if [ -z "$RUN_JSON" ]; then
  echo -e "${YELLOW}Warning: Could not find broadcast json. Contract deployed but address extraction failed.${NC}"
  echo -e "${YELLOW}Please check broadcast/ directory for the contract address.${NC}"
  exit 1
fi

# Extract contract address
ESCROW_ADDRESS=$(python3 - "$RUN_JSON" <<'PY'
import json, sys
try:
    j = json.load(open(sys.argv[1]))
    for tx in j.get("transactions", []):
        addr = tx.get("contractAddress")
        if addr:
            print(addr)
            break
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
PY
)

if [ -z "$ESCROW_ADDRESS" ]; then
  echo -e "${YELLOW}Warning: Could not extract contract address from broadcast json.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
echo ""
echo -e "${GREEN}Contract Address:${NC} ${ESCROW_ADDRESS}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update the contract address in the following files:"
echo "   - config.js (line 10)"
echo "   - send.js (line 11)"
echo "   - claim.js (line 10)"
echo ""
echo "2. Replace 'YOUR_DEPLOYED_CONTRACT_ADDRESS' with:"
echo -e "   ${GREEN}${ESCROW_ADDRESS}${NC}"
echo ""
echo "3. Start a local web server and test the flow"
echo ""

# Optionally update config files automatically (requires sed)
read -p "Would you like to automatically update the config files? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Updating config files...${NC}"

  # Update config.js
  sed -i "s/YOUR_DEPLOYED_CONTRACT_ADDRESS/${ESCROW_ADDRESS}/g" config.js 2>/dev/null && \
    echo -e "${GREEN}✅ Updated config.js${NC}" || \
    echo -e "${YELLOW}⚠️  Could not update config.js (use sed or manually edit)${NC}"

  # Update send.js
  sed -i "s/YOUR_DEPLOYED_CONTRACT_ADDRESS/${ESCROW_ADDRESS}/g" send.js 2>/dev/null && \
    echo -e "${GREEN}✅ Updated send.js${NC}" || \
    echo -e "${YELLOW}⚠️  Could not update send.js (use sed or manually edit)${NC}"

  # Update claim.js
  sed -i "s/YOUR_DEPLOYED_CONTRACT_ADDRESS/${ESCROW_ADDRESS}/g" claim.js 2>/dev/null && \
    echo -e "${GREEN}✅ Updated claim.js${NC}" || \
    echo -e "${YELLOW}⚠️  Could not update claim.js (use sed or manually edit)${NC}"

  echo ""
  echo -e "${GREEN}✅ Configuration complete!${NC}"
  echo ""
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
