const { ethers } = require("ethers");

const PHAROS_RPC = "https://rpc.pharos.xyz";
const PHAROS_CHAIN_ID = 1672;
const PHAROS_EXPLORER = "https://pharosscan.xyz";
const PHAROS_CURRENCY = "PROS";

async function getTransactionHistory(address) {
  if (!ethers.isAddress(address)) {
    console.log("❌ Invalid address. Must start with 0x and be 42 characters.");
    return;
  }

  console.log("📜 Fetching transaction history for:", address);
  console.log("🌐 Connecting to Pharos Mainnet...\n");

  const provider = new ethers.JsonRpcProvider(PHAROS_RPC, {
    chainId: PHAROS_CHAIN_ID,
    name: "pharos-mainnet",
  });

  // Get basic wallet info
  const [txCount, balance, latestBlock] = await Promise.all([
    provider.getTransactionCount(address),
    provider.getBalance(address),
    provider.getBlockNumber(),
  ]);

  const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(6);

  // Scan only last 20 blocks — fast!
  const SCAN_BLOCKS = 20;
  const fromBlock = Math.max(0, latestBlock - SCAN_BLOCKS);

  console.log(`🔍 Scanning last ${SCAN_BLOCKS} blocks...\n`);

  const transactions = [];

  const blockPromises = [];
  for (let i = fromBlock; i <= latestBlock; i++) {
    blockPromises.push(provider.getBlock(i, true));
  }

  const blocks = await Promise.all(blockPromises);

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
          block: block.number,
          timestamp: new Date(block.timestamp * 1000).toLocaleString(),
          direction: tx.from?.toLowerCase() === address.toLowerCase() ? "OUT" : "IN",
        });
      }
    }
  }

  // Print result
  console.log("═══════════════════════════════════");
  console.log("   PHAROS TRANSACTION HISTORY      ");
  console.log("═══════════════════════════════════");
  console.log(`📬 Address     : ${address}`);
  console.log(`💰 Balance     : ${formattedBalance} ${PHAROS_CURRENCY}`);
  console.log(`📊 Total Txs   : ${txCount}`);
  console.log(`📦 Scanned     : Block ${fromBlock} → ${latestBlock}`);
  console.log(`🔗 Explorer    : ${PHAROS_EXPLORER}/address/${address}`);
  console.log("───────────────────────────────────");

  if (transactions.length === 0) {
    console.log("   No transactions found in the last 20 blocks.");
    console.log(`   Try the explorer for full history:`);
    console.log(`   ${PHAROS_EXPLORER}/address/${address}`);
  } else {
    console.log(`   Found ${transactions.length} transaction(s):\n`);
    transactions.slice(0, 5).forEach((tx, index) => {
      const shortHash = tx.hash.slice(0, 10) + "..." + tx.hash.slice(-6);
      const shortFrom = tx.from.slice(0, 6) + "..." + tx.from.slice(-4);
      const shortTo = typeof tx.to === "string" && tx.to.startsWith("0x")
        ? tx.to.slice(0, 6) + "..." + tx.to.slice(-4)
        : tx.to;
      const arrow = tx.direction === "OUT" ? "📤 SENT" : "📥 RECEIVED";

      console.log(`   [${index + 1}] ${arrow}`);
      console.log(`       Hash : ${shortHash}`);
      console.log(`       From : ${shortFrom}`);
      console.log(`       To   : ${shortTo}`);
      console.log(`       Value: ${tx.value} ${PHAROS_CURRENCY}`);
      console.log(`       Block: ${tx.block}`);
      console.log(`       Time : ${tx.timestamp}`);
      console.log("");
    });
  }

  console.log("═══════════════════════════════════");
}

const address = process.argv[2];
if (!address) {
  console.log("Usage: node scripts/tx-history.js <wallet_address>");
} else {
  getTransactionHistory(address).catch(console.error);
}