# Skill: pharos-wallet-analyzer

## Overview
This skill enables AI agents to interact with the Pharos Network blockchain.
It provides wallet analysis, transaction decoding, live gas tracking and
transaction history — all through simple natural language commands.

## Skill API

### 1. analyze-wallet
**Trigger phrases:**
- "analyze wallet 0x..."
- "check balance of 0x..."
- "what is in this wallet 0x..."
- "is this wallet safe 0x..."

**Command:**
node scripts/analyze-wallet.js <wallet_address>

**Returns:**
- Native PROS balance
- Total transaction count
- Smart contract detection
- Risk signals

---

### 2. explain-tx
**Trigger phrases:**
- "explain transaction 0x..."
- "what happened in this tx 0x..."
- "decode this transaction 0x..."

**Command:**
node scripts/explain-tx.js <tx_hash>

**Returns:**
- Transaction status (success/failed)
- Transaction type (transfer, swap, approval, etc.)
- Gas cost in PROS
- Plain English explanation

---

### 3. gas-tracker
**Trigger phrases:**
- "what is the current gas price on Pharos"
- "how much does a transaction cost on Pharos"
- "is it cheap to transact on Pharos right now"

**Command:**
node scripts/gas-tracker.js

**Returns:**
- Live gas price in Gwei
- Estimated cost for simple transfer
- Estimated cost for token transfer
- Estimated cost for contract call
- Network status (cheap/normal/moderate/expensive)

---

### 4. tx-history
**Trigger phrases:**
- "show transaction history for 0x..."
- "what has this wallet been doing 0x..."
- "recent transactions for 0x..."

**Command:**
node scripts/tx-history.js <wallet_address>

**Returns:**
- Recent sent and received transactions
- Block number and timestamp
- Transaction value in PROS
- Explorer links

---

## Architecture

User / AI Agent
      |
      v
pharos-wallet-analyzer (Skill)
      |
      |-- analyze-wallet.js
      |-- explain-tx.js
      |-- gas-tracker.js
      |-- tx-history.js
            |
            v
     ethers.js v6 (RPC Client)
            |
            v
     Pharos Mainnet RPC
     https://rpc.pharos.xyz
            |
            v
     Pharos Pacific Ocean Mainnet
     Chain ID: 1672

## Network
- Network : Pharos Pacific Ocean Mainnet
- Chain ID : 1672
- RPC URL  : https://rpc.pharos.xyz
- Explorer : https://pharosscan.xyz
- Currency : PROS

## Requirements
- Node.js >= 18
- ethers ^6.11.1

## Installation
git clone https://github.com/Cassichukwu/pharos-wallet-analyzer.git
cd pharos-wallet-analyzer
npm install