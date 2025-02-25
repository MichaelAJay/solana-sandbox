const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction, clusterApiUrl } = require("@solana/web3.js");
const { payer: payingPrivateKey } = require("./payer-devnet-keypair");
const { createTransferInstruction } = require("@solana/spl-token");
const { connectionUrl } = require("./constants");

const args = process.argv.slice(2);
const [amtArg, invoiceId] = args;
if (isNaN(amtArg)) {
  console.error('amt arg must be included: pay.js <amt> <[invoiceId]>')
}
// Note: amt should be multiplied by 10^x, where x is the number of decimals that the token mint has
const amt = parseFloat(amtArg) * 10 ** 6;
const connection = new Connection(connectionUrl);
const acceptanceAtaKeyString = 'HKe9LCVxFKyxksiMXQonLt18WG8zoj27bJoBF7vgEtDh';
const sendingAtaKeyString = '4Y1pazpc98QEiAJ6KzDLAeUGuZ3HhtPbKbrcx3kRB4Es'; // should be derived from payingKeypair in token-proxy script/mint_info.txt

const payingSecretKey = payingPrivateKey; // Update with *_payer_secret_key.js - generated using create-private-key.js
const acceptanceAtaPublicKey = new PublicKey(acceptanceAtaKeyString);
const sendingAtaPublicKey = new PublicKey(sendingAtaKeyString);
const payingKeypair = Keypair.fromSecretKey(Uint8Array.from(payingSecretKey));
const memo = invoiceId || 'my_memo';

async function main() {
  const timeA = (new Date()).getTime();
  const transferTransaction = new Transaction().add(
    createTransferInstruction(
      sendingAtaPublicKey,
      acceptanceAtaPublicKey,
      payingKeypair.publicKey,
      amt
    )
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