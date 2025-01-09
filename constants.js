const { clusterApiUrl } = require("@solana/web3.js");

const solAcceptanceKeyString = 'CsEMb5UiVdQ6HS1YYAm87xM5x4o2Njy3YrTBYcyWLHot';

const connectionString_DEVNET = clusterApiUrl('devnet');
const connectionString_LOCAL = 'http://localhost:8899';
// Change this for export
const connectionUrl = connectionString_DEVNET;

module.exports = {
  solAcceptanceKeyString,
  connectionUrl
}