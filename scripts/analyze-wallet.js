const { ethers } = require("ethers");

const PHAROS_RPC = "https://rpc.pharos.xyz";
const PHAROS_CHAIN_ID = 1672;
const PHAROS_EXPLORER = "https://pharosscan.xyz";
const PHAROS_CURRENCY = "PROS";

async function analyzeWallet(address) {
  if (!ethers.isAddress(address)) {
    console.log(JSON.stringify({
      success: false,
      error: "Invalid address. Must start with 0x and be 42 characters."
    }));
    return;
  }

  const provider = new ethers.JsonRpcProvider(PHAROS_RPC, {
    chainId: PHAROS_CHAIN_ID,
    name: "pharos-mainnet",
  });

  const balanceWei = await provider.getBalance(address);
  const txCount = await provider.getTransactionCount(address);
  const code = await provider.getCode(address);
  const isContract = code !== "0x";
  const balance = parseFloat(ethers.formatEther(balanceWei)).toFixed(6);

  const risks = [];
  if (txCount === 0) risks.push("Empty wallet — no transactions yet");
  if (txCount > 0 && txCount < 5) risks.push("New wallet — less than 5 transactions");
  if (parseFloat(balance) > 10000) risks.push("Large balance detected");
  if (isContract) risks.push("This is a smart contract");
  if (risks.length === 0) risks.push("No risk signals detected");

  const result = {
    success: true,
    skill: "pharos-wallet-analyzer",
    action: "analyze-wallet",
    data: {
      address: address,
      balance: balance,
      currency: PHAROS_CURRENCY,
      transactionCount: txCount,
      isContract: isContract,
      riskSignals: risks,
      explorerUrl: PHAROS_EXPLORER + "/address/" + address,
      network: "Pharos Pacific Ocean Mainnet",
      chainId: PHAROS_CHAIN_ID,
    },
    timestamp: new Date().toISOString()
  };

  console.log(JSON.stringify(result, null, 2));
}

const address = process.argv[2];
if (!address) {
  console.log(JSON.stringify({
    success: false,
    error: "Missing argument. Usage: node scripts/analyze-wallet.js <wallet_address>"
  }));
} else {
  analyzeWallet(address).catch(console.error);
}