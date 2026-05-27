const { ethers } = require("ethers");

const PHAROS_RPC = "https://rpc.pharos.xyz";
const PHAROS_CHAIN_ID = 1672;
const PHAROS_EXPLORER = "https://pharosscan.xyz";
const PHAROS_CURRENCY = "PROS";

const KNOWN_SELECTORS = {
  "0xa9059cbb": "ERC-20 Token Transfer",
  "0x23b872dd": "ERC-20 Transfer From",
  "0x095ea7b3": "ERC-20 Token Approval",
  "0x40c10f19": "Token Mint",
  "0x42966c68": "Token Burn",
  "0x7ff36ab5": "DEX Swap (ETH to Token)",
  "0x18cbafe5": "DEX Swap (Token to ETH)",
  "0x38ed1739": "DEX Swap (Token to Token)",
  "0xe8e33700": "Add Liquidity to Pool",
  "0xd0e30db0": "Wrap Native Token",
  "0x2e1a7d4d": "Unwrap Native Token",
};

async function explainTransaction(txHash) {
  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    console.log("Invalid transaction hash.");
    return;
  }

  console.log("Looking up transaction:", txHash);
  console.log("Connecting to Pharos Mainnet...\n");

  const provider = new ethers.JsonRpcProvider(PHAROS_RPC, {
    chainId: PHAROS_CHAIN_ID,
    name: "pharos-mainnet",
  });

  const tx = await provider.getTransaction(txHash);

  if (!tx) {
    console.log("Transaction not found on Pharos Mainnet.");
    return;
  }

  const receipt = await provider.getTransactionReceipt(txHash);

  let status = "Pending";
  let gasUsed = "N/A";
  let gasCost = "N/A";

  if (receipt) {
    status = receipt.status === 1 ? "Success" : "Failed";
    gasUsed = receipt.gasUsed.toString();
    if (tx.gasPrice) {
      const gasCostWei = receipt.gasUsed * tx.gasPrice;
      gasCost = parseFloat(ethers.formatEther(gasCostWei)).toFixed(8) + " " + PHAROS_CURRENCY;
    }
  }

  const inputRaw = tx.data || "0x";
  const selector = inputRaw.length >= 10 ? inputRaw.slice(0, 10).toLowerCase() : null;

  let txType = "Native Token Transfer";
  if (tx.to === null) {
    txType = "Contract Deployment";
  } else if (selector && KNOWN_SELECTORS[selector]) {
    txType = KNOWN_SELECTORS[selector];
  } else if (inputRaw !== "0x") {
    txType = "Contract Interaction";
  }

  const value = parseFloat(ethers.formatEther(tx.value)).toFixed(6);
  const shortFrom = tx.from.slice(0, 6) + "..." + tx.from.slice(-4);
  const shortTo = tx.to ? tx.to.slice(0, 6) + "..." + tx.to.slice(-4) : "a new contract";

  let explanation = shortFrom + " interacted with " + shortTo + " on Pharos.";
  if (txType === "Native Token Transfer") {
    explanation = shortFrom + " sent " + value + " " + PHAROS_CURRENCY + " to " + shortTo + ".";
  } else if (txType === "Contract Deployment") {
    explanation = shortFrom + " deployed a new smart contract on Pharos.";
  } else if (txType === "ERC-20 Token Transfer") {
    explanation = shortFrom + " transferred tokens to " + shortTo + ".";
  } else if (txType === "ERC-20 Token Approval") {
    explanation = shortFrom + " approved " + shortTo + " to spend tokens on their behalf.";
  }

  console.log("===================================");
  console.log("    PHAROS TRANSACTION REPORT");
  console.log("===================================");
  console.log("Tx Hash  : " + txHash.slice(0, 20) + "...");
  console.log("Status   : " + status);
  console.log("Block    : " + (tx.blockNumber || "Pending"));
  console.log("From     : " + tx.from);
  console.log("To       : " + (tx.to || "Contract Deployment"));
  console.log("Value    : " + value + " " + PHAROS_CURRENCY);
  console.log("Type     : " + txType);
  console.log("Gas Used : " + gasUsed);
  console.log("Gas Cost : " + gasCost);
  console.log("Explorer : " + PHAROS_EXPLORER + "/tx/" + txHash);
  console.log("\nWhat happened:");
  console.log("  " + explanation);
  console.log("===================================");
}

const txHash = process.argv[2];
if (!txHash) {
  console.log("Usage: node scripts/explain-tx.js <transaction_hash>");
} else {
  explainTransaction(txHash).catch(console.error);
}