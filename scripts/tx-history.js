const { ethers } = require("ethers");

const PHAROS_RPC = "https://rpc.pharos.xyz";
const PHAROS_CHAIN_ID = 1672;
const PHAROS_EXPLORER = "https://pharosscan.xyz";
const PHAROS_CURRENCY = "PROS";

async function getTransactionHistory(address) {
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

  const [latestBlock, txCount, balance] = await Promise.all([
    provider.getBlockNumber(),
    provider.getTransactionCount(address),
    provider.getBalance(address),
  ]);

  const SCAN_BLOCKS = 20;
  const fromBlock = Math.max(0, latestBlock - SCAN_BLOCKS);

  const blockPromises = [];
  for (let i = fromBlock; i <= latestBlock; i++) {
    blockPromises.push(provider.getBlock(i, true));
  }

  const blocks = await Promise.all(blockPromises);
  const transactions = [];

  for (const block of blocks) {
    if (!block || !block.transactions) continue;
    for (const tx of block.transactions) {
      if (
        tx.from?.toLowerCase() === address.toLowerCase() ||
        tx.to?.toLowerCase() === address.toLowerCase()
      ) {
        transactions.push({
          hash: tx.hash,
          from: tx.from,
          to: tx.to || "Contract Deployment",
          value: parseFloat(ethers.formatEther(tx.value)).toFixed(6),
          currency: PHAROS_CURRENCY,
          block: block.number,
          timestamp: new Date(block.timestamp * 1000).toISOString(),
          direction: tx.from?.toLowerCase() === address.toLowerCase() ? "OUT" : "IN",
          explorerUrl: PHAROS_EXPLORER + "/tx/" + tx.hash,
        });
      }
    }
  }

  const result = {
    success: true,
    skill: "pharos-wallet-analyzer",
    action: "tx-history",
    data: {
      address: address,
      balance: parseFloat(ethers.formatEther(balance)).toFixed(6),
      currency: PHAROS_CURRENCY,
      totalTransactions: txCount,
      scannedBlocks: { from: fromBlock, to: latestBlock },
      recentTransactions: transactions.slice(0, 5),
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
    error: "Missing argument. Usage: node scripts/tx-history.js <wallet_address>"
  }));
} else {
  getTransactionHistory(address).catch(console.error);
}