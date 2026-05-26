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
- Fetch native PHRS balance
- Count total transactions
- Detect if the address is a smart contract
- Flag risk signals (new wallet, large balance, empty wallet)

### Transaction Explanation
Given a transaction hash, the agent can:
- Fetch full transaction details
- Detect transaction type (transfer, swap, approval, contract deploy, etc.)
- Report gas cost in PHRS
- Produce a plain-English explanation of what happened

---

## How to Use

### 1. Clone the repo
git clone https://github.com/YOURUSERNAME/pharos-wallet-analyzer.git
cd pharos-wallet-analyzer

### 2. Install dependencies
npm install

### 3. Analyze a wallet
node scripts/analyze-wallet.js 0xYourWalletAddressHere

### 4. Explain a transaction
node scripts/explain-tx.js 0xYourTxHashHere

---

## Example Output

### Wallet Report
===================================
        PHAROS WALLET REPORT
===================================
Address      : 0xd8dA...6045
Balance      : 0.277844 PHRS
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
Block    : 22719992
From     : 0x6876...C3cB
To       : 0x74cc...98e7
Value    : 0.010000 PHRS
Type     : Native Token Transfer
Gas Cost : 0.00021000 PHRS

What happened:
  0x6876...C3cB sent 0.010000 PHRS to 0x74cc...98e7.
===================================

---

## Network Details
- Network : Pharos Atlantic Testnet
- Chain ID : 688689
- RPC URL  : https://atlantic.dplabs-internal.com
- Explorer : https://atlantic.pharosscan.xyz
- Currency : PHRS

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
- Works with any valid Pharos testnet wallet address or transaction hash
- All output is human-readable plain text