const { clusterApiUrl } = require("@solana/web3.js");

const solAcceptanceKeyString = '';

const connectionString_DEVNET = clusterApiUrl('devnet');
const connectionString_LOCAL = 'http://localhost:8899';
// Change this for export
const connectionUrl = connectionString_DEVNET;
const stableCoins = ['USDC_sol', 'USDT_sol'];

module.exports = {
  solAcceptanceKeyString,
  connectionUrl,
  stableCoins
}