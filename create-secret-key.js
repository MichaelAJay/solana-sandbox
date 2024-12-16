const { 
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} = require("@solana/web3.js");
const { writeFileSync } = require('fs');

const args = process.argv.slice(2);

/**
 * DO NOT USE ON MAINNET
 */
// const connectionUrl = 'http://127.0.0.1:8899'; // local
const connectionUrl = clusterApiUrl('devnet'); // devnet
const fileName = args[0]|| 'primary_payer';
// Default false to avoid common 429 error. Setting to true will seed the account with SOL. If set to false, use faucet: https://faucet.solana.com 
// Setting to true should be fine for local validator
const createAccount = args[1] === 'true';

(async () => {
  try {
    const connection = new Connection(connectionUrl);
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

    /**
     * DO NOT USE ON MAINNET
     * IF YOU USE ON MAINNET, YOU COULD LEAK A LIVE SECRET KEY
     */
    const secretKey = JSON.stringify(Array.from(newAccountKeypair.secretKey));
    writeFileSync(`${fileName}_payer_secret_key.js`, `export const ${fileName}_secretKey = ${secretKey};`)
    console.log(createAccount ? 'account created' : 'keypair created', newAccountKeypair.publicKey.toString());
  } catch (err) {
    console.error(err);
    throw err;
  }
})();