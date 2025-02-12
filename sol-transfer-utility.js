// Import FROM private key & name it 'payer'
const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require('@solana/web3.js');
const { test_secretKey: payer } = require('./test_payer_secret_key');
// Import TO private key & name it 'receiver'
const { receiver } = require('./your-secret-keys');
const { connectionUrl } = require('./constants');


const args = process.argv.slice(2);
const [amtArg] = args;
if (isNaN(amtArg) || amtArg < 0) {
    console.error('amt arg must be included and positive');
    process.exit(1);
}
const amt = parseFloat(amtArg);

const connection = new Connection(connectionUrl);
const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(payer));
const receiverKeypair = Keypair.fromSecretKey(Uint8Array.from(receiver));

(async () => {
    try {
        await connection.getVersion();
        console.log('Connection active');

        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: payerKeypair.publicKey,
                toPubkey: receiverKeypair.publicKey,
                lamports: amt * LAMPORTS_PER_SOL
            })
        )
        const signature = await sendAndConfirmTransaction(connection, transferTransaction, [payerKeypair]);
        console.log("Job's done")
        console.log('Tx signature', signature);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})()