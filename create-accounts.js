const { 
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} = require("@solana/web3.js");
const { appendFileSync } = require('fs');
const path = require('path');
const { connectionUrl } = require('./constants');

const args = process.argv.slice(2);

// Default false to avoid common 429 error. Setting to true will seed the account with SOL. If set to false, use faucet: https://faucet.solana.com 
// Setting to true should be fine for local validator
const createAccount = args[1] === 'true';
const connection = new Connection(connectionUrl);

const createKeypair = async () => {
  const newAccountKeypair = Keypair.generate();

  if (createAccount) {
    const fromKeypair = Keypair.generate();

    let parsedAirdropAmt = parseFloat(args[2]);
    if (isNaN(parsedAirdropAmt)) {
      parsedAirdropAmt = 5;
    }
  
    // Airdrop SOL for transferring lamports to the created account
    const airdropSignature = await connection.requestAirdrop(
      fromKeypair.publicKey,
      (parsedAirdropAmt + 1) * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction({ signature: airdropSignature });

    const createAccountTransaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: fromKeypair.publicKey,
        newAccountPubkey: newAccountKeypair.publicKey,
        lamports: parsedAirdropAmt * LAMPORTS_PER_SOL,
        space: 0,
        programId: SystemProgram.programId
      })
    );
    await sendAndConfirmTransaction(connection, createAccountTransaction, [
      fromKeypair,
      newAccountKeypair
    ]);
  }

  return newAccountKeypair;
}

(async () => {
  try {
    // Confirm connection
    await connection.getVersion();
    console.log('Connection established');

    const actors = ['payer', 'receiver'];

    for (const actor of actors) {
      const keypair = await createKeypair();
      const secretKey = JSON.stringify(Array.from(keypair.secretKey));
      writeLineOut('your-secret-keys.js',`const ${actor} = ${secretKey}`);
      writeLineOut('your-sol-addresses.txt', `${actor}: ${keypair.publicKey.toString()}`);
    }

    writeLineOut('your-secret-keys.js', `module.exports = { ${actors.join(',')} }`);
    console.log("Job's done");
    console.log('Check yoursecret-keys.js and your-sol-addresses.txt.')
  } catch (err) {
    console.error(err);
    throw err;
  }
})();

// Helpers
/**
 * @param {string} file
 * @param {string} line 
 */
const writeLineOut = (file, line) => {
  const filePath = path.join(__dirname, file);
  appendFileSync(filePath, `${line}\n`);
};