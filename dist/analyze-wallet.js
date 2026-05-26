"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
// Pharos Network Config
const PHAROS_RPC = "https://testnet.dplabs-internal.com";
const PHAROS_CHAIN_ID = 688688;
const PHAROS_EXPLORER = "https://testnet.pharosscan.xyz";
const PHAROS_CURRENCY = "PHRS";
async function analyzeWallet(address) {
    // Validate address
    if (!ethers_1.ethers.isAddress(address)) {
        console.log("❌ Invalid address. Must start with 0x and be 42 characters.");
        return;
    }
    console.log("🔍 Analyzing wallet:", address);
    console.log("🌐 Connecting to Pharos Testnet...\n");
    // Connect to Pharos
    const provider = new ethers_1.ethers.JsonRpcProvider(PHAROS_RPC, {
        chainId: PHAROS_CHAIN_ID,
        name: "pharos-testnet",
    });
    // Fetch data
    const balanceWei = await provider.getBalance(address);
    const txCount = await provider.getTransactionCount(address);
    const code = await provider.getCode(address);
    const isContract = code !== "0x";
    // Format balance
    const balance = parseFloat(ethers_1.ethers.formatEther(balanceWei)).toFixed(6);
    // Risk signals
    const risks = [];
    if (txCount === 0)
        risks.push("📭 Empty wallet — no transactions yet");
    if (txCount > 0 && txCount < 5)
        risks.push("🆕 New wallet — less than 5 transactions");
    if (parseFloat(balance) > 10000)
        risks.push("💰 Large balance detected");
    if (isContract)
        risks.push("🤖 This is a smart contract, not a regular wallet");
    if (risks.length === 0)
        risks.push("✅ No risk signals detected");
    // Print result
    console.log("═══════════════════════════════════");
    console.log("        PHAROS WALLET REPORT");
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
// Get address from command line
const address = process.argv[2];
if (!address) {
    console.log("Usage: npx ts-node scripts/analyze-wallet.ts <wallet_address>");
}
else {
    analyzeWallet(address).catch(console.error);
}
