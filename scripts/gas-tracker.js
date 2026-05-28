const { ethers } = require("ethers");

const PHAROS_RPC = "https://rpc.pharos.xyz";
const PHAROS_CHAIN_ID = 1672;
const PHAROS_EXPLORER = "https://pharosscan.xyz";
const PHAROS_CURRENCY = "PROS";

async function getGasInfo() {
  console.log("⛽ Fetching Pharos Mainnet Gas Info...\n");

  const provider = new ethers.JsonRpcProvider(PHAROS_RPC, {
    chainId: PHAROS_CHAIN_ID,
    name: "pharos-mainnet",
  });

  // Fetch gas price and latest block
  const [feeData, blockNumber] = await Promise.all([
    provider.getFeeData(),
    provider.getBlockNumber(),
  ]);

  // Format gas prices
  const gasPriceGwei = parseFloat(ethers.formatUnits(feeData.gasPrice, "gwei")).toFixed(4);
  const gasPriceWei = feeData.gasPrice.toString();

  // Estimate costs for common transaction types
  const SIMPLE_TRANSFER_GAS = 21000n;
  const TOKEN_TRANSFER_GAS = 65000n;
  const CONTRACT_INTERACTION_GAS = 100000n;

  const simpleCost = parseFloat(ethers.formatEther(feeData.gasPrice * SIMPLE_TRANSFER_GAS)).toFixed(8);
  const tokenCost = parseFloat(ethers.formatEther(feeData.gasPrice * TOKEN_TRANSFER_GAS)).toFixed(8);
  const contractCost = parseFloat(ethers.formatEther(feeData.gasPrice * CONTRACT_INTERACTION_GAS)).toFixed(8);

  // Gas speed recommendation
  let speed = "";
  const gasPriceNum = parseFloat(gasPriceGwei);
  if (gasPriceNum < 1) {
    speed = "🟢 Very Cheap — Great time to transact!";
  } else if (gasPriceNum < 10) {
    speed = "🟡 Normal — Good time to transact";
  } else if (gasPriceNum < 50) {
    speed = "🟠 Moderate — Consider waiting";
  } else {
    speed = "🔴 Expensive — Network is congested";
  }

  // Print result
  console.log("═══════════════════════════════════");
  console.log("     PHAROS GAS TRACKER REPORT     ");
  console.log("═══════════════════════════════════");
  console.log(`📦 Latest Block   : ${blockNumber}`);
  console.log(`⛽ Gas Price      : ${gasPriceGwei} Gwei`);
  console.log(`🔢 Gas Price (Wei): ${gasPriceWei}`);
  console.log(`\n💸 Estimated Transaction Costs:`);
  console.log(`   → Simple Transfer  : ${simpleCost} ${PHAROS_CURRENCY}`);
  console.log(`   → Token Transfer   : ${tokenCost} ${PHAROS_CURRENCY}`);
  console.log(`   → Contract Call    : ${contractCost} ${PHAROS_CURRENCY}`);
  console.log(`\n📊 Network Status : ${speed}`);
  console.log(`🔗 Explorer       : ${PHAROS_EXPLORER}`);
  console.log("═══════════════════════════════════");
}

getGasInfo().catch(console.error);