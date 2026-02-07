@echo off
REM Simplified EscrowLinks Deployment Script for Windows

echo ========================================
echo    Plasma Escrow Links Deployment
echo ========================================
echo.

REM Check environment variables
if "%RPC_URL%"=="" (
    echo Error: RPC_URL environment variable not set
    echo Please set it with: set RPC_URL=https://testnet-rpc.plasma.to
    exit /b 1
)

if "%PRIVATE_KEY%"=="" (
    echo Error: PRIVATE_KEY environment variable not set
    echo Please set it with: set PRIVATE_KEY=0x...
    exit /b 1
)

echo RPC URL: %RPC_URL%
echo.

REM Deploy the contract
echo Deploying EscrowLinks contract...
forge script script/DeployEscrowLinks.s.sol:DeployEscrowLinks --rpc-url %RPC_URL% --private-key %PRIVATE_KEY% --broadcast

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Please check the broadcast/ directory for your deployed contract address.
echo.
echo Next steps:
echo 1. Find the contract address in broadcast/DeployEscrowLinks.s.sol/*/run-latest.json
echo 2. Update the following files with your contract address:
echo    - config.js (line 10)
echo    - send.js (line 11)
echo    - claim.js (line 10)
echo 3. Start a local web server and test the flow
echo.
pause
