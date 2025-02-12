const { connectionUrl, stableCoinMintAddresses } = require('./constants');
const { Connection, Keypair, Transaction, TransactionInstruction, sendAndConfirmTransaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { payer: payerSecretKey, receiver: receiverSecretKey } = require('./your-secret-keys');
const { createTransferCheckedInstruction } = require('@solana/spl-token');

const args = process.argv.slice(2);
const [currency, amtArg, invoiceId] = args;
const validCurrencies = ['SOL', ...Object.keys(stableCoinMintAddresses)];

if (!validCurrencies.includes(currency)) {
    console.error(`First arg should be an expected token name - ${Object.keys(stableCoinMintAddresses).join(', ')}`);
    process.exit(1);
};

if (isNaN(amtArg) || amtArg < 0) {
    console.error('amt arg be be included and be positive');
    process.exit(1);
}
const decimals = 6;
const connection = new Connection(connectionUrl);
const memo = invoiceId || 'invalid_memo';
const payer = Keypair.from(Uint8Array.from(payerSecretKey));
const receiver = Keypair.from(Uint8Array.from(receiverSecretKey));

const paySol = async () => {
    const amt = parseFloat(amtArg);
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: receiver.publicKey,
            lamports: amt * LAMPORTS_PER_SOL
        })
    );
    transferTransaction.add(
        new TransactionInstruction({
            keys: [
                { pubkey: payer.publicKey, isSigner: true, isWritable: true }
            ],
            data: Buffer.from(memo, 'utf-8'),
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
        })
    );
    const signature = await sendAndConfirmTransaction(connection, transferTransaction, [payer]);
    return signature;
};
const paySpl = async () => {
    const amt = parseFloat(amtArg) * 10 ** decimals; // decimals should match token mint's decimals - 6 for USDC & USDT
    const mintPublicKey = new PublicKey(stableCoinMintAddresses[currency]);
    const fromAtaPublicKey = (await connection.getParsedTokenAccountsByOwner(payer.publicKey, { mint: mintPublicKey }))[0];
    const toAtaPublicKey = (await connection.getParsedTokenAccountsByOwner(receiver.publicKey, { mint: mintPublicKey }))[0];
    if (!(fromAtaPublicKey && toAtaPublicKey)) {
        throw new Error(`Public keys not found for ${currency}`);
    };

    const tx = new Transaction().add(
        createTransferCheckedInstruction(
            fromAtaPublicKey,
            mintPublicKey,
            toAtaPublicKey,
            payer.publicKey, // from's owner
            amt,
            decimals
        )
    );
    tx.add(
        new TransactionInstruction({
            keys: [
                { pubkey: payer.publicKey, isSigner: true, isWritable: true }
            ],
            data: Buffer.from(memo, 'utf-8'),
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
        })
    );
    const signature = await sendAndConfirmTransaction(connection, transferTransaction, [payer]);
    return signature;
};

(async () => {
    try {
        const signature = await ( currency === 'SOL' ? paySol() : paySpl() );
        console.log('Tx signature', signature);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
