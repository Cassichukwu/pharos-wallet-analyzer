const { ethers } = require("ethers");

const PHAROS_RPC = "https://rpc.pharos.xyz";
const PHAROS_CHAIN_ID = 1672;
const PHAROS_EXPLORER = "https://pharosscan.xyz";
const PHAROS_CURRENCY = "PROS";

async function getGasInfo() {
  const provider = new ethers.JsonRpcProvider(PHAROS_RPC, {
    chainId: PHAROS_CHAIN_ID,
    name: "pharos-mainnet",
  });

  const [feeData, blockNumber] = await Promise.all([
    provider.getFeeData(),
    provider.getBlockNumber(),
  ]);

  const gasPriceGwei = parseFloat(ethers.formatUnits(feeData.gasPrice, "gwei")).toFixed(4);

  const SIMPLE_TRANSFER_GAS = 21000n;
  const TOKEN_TRANSFER_GAS = 65000n;
  const CONTRACT_INTERACTION_GAS = 100000n;

  const simpleCost = parseFloat(ethers.formatEther(feeData.gasPrice * SIMPLE_TRANSFER_GAS)).toFixed(8);
  const tokenCost = parseFloat(ethers.formatEther(feeData.gasPrice * TOKEN_TRANSFER_GAS)).toFixed(8);
  const contractCost = parseFloat(ethers.formatEther(feeData.gasPrice * CONTRACT_INTERACTION_GAS)).toFixed(8);

  const gasPriceNum = parseFloat(gasPriceGwei);
  let networkStatus = "";
  if (gasPriceNum < 1) networkStatus = "very_cheap";
  else if (gasPriceNum < 10) networkStatus = "normal";
  else if (gasPriceNum < 50) networkStatus = "moderate";
  else networkStatus = "expensive";

  const result = {
    success: true,
    skill: "pharos-wallet-analyzer",
    action: "gas-tracker",
    data: {
      latestBlock: blockNumber,
      gasPriceGwei: gasPriceGwei,
      networkStatus: networkStatus,
      estimatedCosts: {
        simpleTransfer: { gas: 21000, cost: simpleCost, currency: PHAROS_CURRENCY },
        tokenTransfer: { gas: 65000, cost: tokenCost, currency: PHAROS_CURRENCY },
        contractCall: { gas: 100000, cost: contractCost, currency: PHAROS_CURRENCY },
      },
      explorerUrl: PHAROS_EXPLORER,
      network: "Pharos Pacific Ocean Mainnet",
      chainId: PHAROS_CHAIN_ID,
    },
    timestamp: new Date().toISOString()
  };

  console.log(JSON.stringify(result, null, 2));
}

getGasInfo().catch(console.error);