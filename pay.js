const { Connection, clusterApiUrl, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction } = require("@solana/web3.js");
const { payingPrivateKey } = require("./private_constants");

const args = process.argv.slice(2);
const [amtArg, invoiceId] = args;
if (isNaN(amtArg)) {
  console.error('amt arg must be included: pay.js <amt> <[invoiceId]>')
}
const amt = parseFloat(amtArg);
// const connectionString = clusterApiUrl('devnet');
const connectionString = 'http://localhost:8899';
const connection = new Connection(connectionString);
const acceptanceKeyString = 'CsEMb5UiVdQ6HS1YYAm87xM5x4o2Njy3YrTBYcyWLHot';


/** @type {Iterable<number>} */
const payingSecretKey = payingPrivateKey; // Update with *_payer_secret_key.js - generated using create-private-key.js

const acceptancePublicKey = new PublicKey(acceptanceKeyString);
const payingKeypair = Keypair.fromSecretKey(Uint8Array.from(payingSecretKey));

const lamportsToSend = amt * LAMPORTS_PER_SOL;
const memo = invoiceId || 'my_memo';

async function main() {
  const timeA = (new Date()).getTime();
  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payingKeypair.publicKey,
      toPubkey: acceptancePublicKey,
      lamports: lamportsToSend
    })
  );
  const timeB = (new Date()).getTime();
  console.log(`Transfer instruction 1 takes ${timeB - timeA} ms`);

  transferTransaction.add(
    new TransactionInstruction({
      keys: [
        { pubkey: payingKeypair.publicKey, isSigner: true, isWritable: true },
      ],
      data: Buffer.from(memo, 'utf-8'),
      programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
    })
  );
  const timeC = (new Date()).getTime();
  console.log(`Transfer instruction 2 takes ${timeC - timeB} ms`);
  const signature = await sendAndConfirmTransaction(connection, transferTransaction, [payingKeypair]);
  console.log(signature, `took ${(new Date()).getTime() - timeC} ms`);
}

main().catch(err => { console.error(err) });