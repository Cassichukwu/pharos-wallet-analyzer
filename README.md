# Pharos Wallet Analyzer — Agent Skill

An AI Agent Skill for the Pharos Agent Centre that enables agents to analyze wallets, decode transactions, track gas prices and view transaction history on the Pharos Network using natural language.

## Skill Name
pharos-wallet-analyzer

## Short Description
Lets an AI agent inspect any Pharos wallet or transaction hash and return a clean, human-readable analysis including native balance, transaction count, transaction type, gas cost, risk signals, live gas prices and transaction history.

## What It Does

### Wallet Analysis
Given a wallet address, the agent can:
- Fetch native PROS balance
- Count total transactions
- Detect if the address is a smart contract
- Flag risk signals (new wallet, large balance, empty wallet)

### Transaction Explanation
Given a transaction hash, the agent can:
- Fetch full transaction details
- Detect transaction type (transfer, swap, approval, contract deploy, etc.)
- Report gas cost in PROS
- Produce a plain-English explanation of what happened

### Gas Tracker
The agent can:
- Fetch live gas price on Pharos Mainnet
- Estimate cost for simple transfer, token transfer and contract call
- Show network status (cheap, normal, moderate, expensive)

### Transaction History
Given a wallet address, the agent can:
- Show recent transactions sent and received
- Display block number, timestamp, value and direction
- Link directly to explorer for full history

## How to Use

1. Clone the repo and install dependencies:
git clone https://github.com/Cassichukwu/pharos-wallet-analyzer.git
cd pharos-wallet-analyzer
npm install

2. Analyze a wallet:
node scripts/analyze-wallet.js 0xYourWalletAddress

3. Explain a transaction:
node scripts/explain-tx.js 0xYourTxHash

4. Check live gas prices:
node scripts/gas-tracker.js

5. View transaction history:
node scripts/tx-history.js 0xYourWalletAddress

## Network Details
- Network : Pharos Pacific Ocean Mainnet
- Chain ID : 1672
- RPC URL  : https://rpc.pharos.xyz
- Explorer : https://pharosscan.xyz
- Currency : PROS

## Tech Stack
- JavaScript (Node.js)
- ethers.js v6

## Dependencies
- ethers 6.11.1

## Notes
- No API key required
- Works with any valid Pharos mainnet wallet address or transaction hash
- All output is human-readable plain text
