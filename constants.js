const { clusterApiUrl } = require("@solana/web3.js");

// Change this for export - NEVER SET TO MAINNET
const connectionUrl = clusterApiUrl('devnet');

module.exports = {
  connectionUrl,
}