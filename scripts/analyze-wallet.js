const { ethers } = require("ethers");

const PHAROS_RPC = "https://atlantic.dplabs-internal.com";
const PHAROS_CHAIN_ID = 688689;
const PHAROS_EXPLORER = "https://testnet.pharosscan.xyz";
const PHAROS_CURRENCY = "PHRS";

async function analyzeWallet(address) {
  if (!ethers.isAddress(address)) {
    console.log("❌ Invalid address.");
    return;
  }

  console.log("🔍 Analyzing wallet:", address);
  console.log("🌐 Connecting to Pharos Testnet...\n");

  const provider = new ethers.JsonRpcProvider(PHAROS_RPC, {
    chainId: PHAROS_CHAIN_ID,
    name: "pharos-testnet",
  });

  const balanceWei = await provider.getBalance(address);
  const txCount = await provider.getTransactionCount(address);
  const code = await provider.getCode(address);
  const isContract = code !== "0x";
  const balance = parseFloat(ethers.formatEther(balanceWei)).toFixed(6);

  const risks = [];
  if (txCount === 0) risks.push("📭 Empty wallet — no transactions yet");
  if (txCount > 0 && txCount < 5) risks.push("🆕 New wallet — less than 5 transactions");
  if (parseFloat(balance) > 10000) risks.push("💰 Large balance detected");
  if (isContract) risks.push("🤖 This is a smart contract");
  if (risks.length === 0) risks.push("✅ No risk signals detected");

  console.log("═══════════════════════════════════");
  console.log("        PHAROS WALLET REPORT       ");
  console.log("═══════════════════════════════════");
  console.log(`📬 Address     : ${address}`);
  console.log(`💰 Balance     : ${balance} ${PHAROS_CURRENCY}`);
  console.log(`📊 Transactions: ${txCount}`);
  console.log(`🤖 Is Contract : ${isContract ? "Yes" : "No"}`);
  console.log(`🔗 Explorer    : ${PHAROS_EXPLORER}/address/${address}`);
  console.log("\n⚠️  Risk Signals:");
  risks.forEach((r) => console.log("   →", r));
  console.log("═══════════════════════════════════");
}

const address = process.argv[2];
if (!address) {
  console.log("Usage: node scripts/analyze-wallet.js <wallet_address>");
} else {
  analyzeWallet(address).catch(console.error);
}