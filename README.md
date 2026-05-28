# Pharos Wallet Analyzer — Agent Skill

An AI Agent Skill for the Pharos Agent Centre that enables agents to analyze
wallets and decode transactions on the Pharos Network using natural language.

---

## Skill Name
`pharos-wallet-analyzer`

## Short Description
Lets an AI agent inspect any Pharos wallet or transaction hash and return a
clean, human-readable analysis — including native balance, transaction count,
transaction type, gas cost, and risk signals.

---

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

---

## How to Use

### 1. Clone the repo
git clone https://github.com/Cassichukwu/pharos-wallet-analyzer.git
cd pharos-wallet-analyzer

### 2. Install dependencies
npm install

### 3. Analyze a wallet
node scripts/analyze-wallet.js 0xYourWalletAddress

### 4. Explain a transaction
node scripts/explain-tx.js 0xYourTxHash

---

## Example Output

### Wallet Report
===================================
        PHAROS WALLET REPORT
===================================
Address      : 0xd8dA...6045
Balance      : 0.277844 PROS
Transactions : 0
Is Contract  : No
Risk Signals :
   -> Empty wallet — no transactions yet
===================================

### Transaction Report
===================================
    PHAROS TRANSACTION REPORT
===================================
Status   : Success
Block    : 8483391
From     : 0x6B16...5555
To       : 0x530D...b147
Value    : 0.000000 PROS
Type     : Contract Interaction
Gas Cost : 0.00035902 PROS

What happened:
  0x6B16...5555 interacted with 0x530D...b147 on Pharos.
===================================

---

## Network Details
- Network : Pharos Pacific Ocean Mainnet
- Chain ID : 1672
- RPC URL  : https://rpc.pharos.xyz
- Explorer : https://pharosscan.xyz
- Currency : PROS

---

## Tech Stack
- JavaScript (Node.js)
- ethers.js v6

---

## Dependencies
- ethers ^6.11.1

---

## Notes
- No API key required
- Works with any valid Pharos mainnet wallet address or transaction hash
- All output is human-readable plain text