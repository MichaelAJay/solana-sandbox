const { Connection, clusterApiUrl, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction } = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl('devnet'));

const acceptanceKeyString = 'CsEMb5UiVdQ6HS1YYAm87xM5x4o2Njy3YrTBYcyWLHot';
/** @type {Iterable<number>} */
const payingSecretKey = [];

const acceptancePublicKey = new PublicKey(acceptanceKeyString);
const payingKeypair = Keypair.fromSecretKey(Uint8Array.from(payingSecretKey));

const lamportsToSend = 0.25 * LAMPORTS_PER_SOL;
const memo = 'my_memo';

async function main() {
  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payingKeypair.publicKey,
      toPubkey: acceptancePublicKey,
      lamports: lamportsToSend
    })
  );

  transferTransaction.add(
    new TransactionInstruction({
      keys: [
        { pubkey: payingKeypair.publicKey, isSigner: true, isWritable: true },
      ],
      data: Buffer.from(memo, 'utf-8'),
      programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
    })
  );
  
  const signature = await sendAndConfirmTransaction(connection, transferTransaction, [payingKeypair]);
  console.log(signature);
}

main().catch(err => { console.error(err) });