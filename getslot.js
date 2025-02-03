const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction, clusterApiUrl } = require("@solana/web3.js");

const connectionString = clusterApiUrl('devnet');
console.log(connectionString);
// const connectionString = 'http://localhost:8899';
const connection = new Connection(connectionString);

async function main() {
  const slot = await connection.getSlot();
  console.log(slot);
}

main().catch(err => { console.error(err) });