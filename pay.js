const { connectionUrl } = require('./constants');
const { Connection, Keypair, Transaction, TransactionInstruction, sendAndConfirmTransaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { payer: payerSecretKey, receiver: receiverSecretKey } = require('./your-secret-keys');
const { createTransferCheckedInstruction, createTransferInstruction, ASSOCIATED_TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const mintAddresses = require('./mint-addresses');

const args = process.argv.slice(2);
const [currency, amtArg, invoiceId, skipMemoArg] = args;
const validCurrencies = ['SOL', ...Object.keys(mintAddresses)];

if (!validCurrencies.includes(currency)) {
    console.error(`First arg should be "SOL" or an expected token name - ${Object.keys(mintAddresses).join(', ')}`);
    process.exit(1);
};

if (isNaN(amtArg) || amtArg < 0) {
    console.error('amt arg be be included and be positive');
    process.exit(1);
}
const decimals = 6;
const connection = new Connection(connectionUrl);
const memo = invoiceId || 'invalid_memo';
const payer = Keypair.fromSecretKey(Uint8Array.from(payerSecretKey));
const receiver = Keypair.fromSecretKey(Uint8Array.from(receiverSecretKey));
const skipMemo = skipMemoArg === '--skipMemo';

const paySol = async () => {
    const amt = parseFloat(amtArg);
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: receiver.publicKey,
            lamports: amt
        })
    );
    if (!skipMemo) {
        transferTransaction.add(
            new TransactionInstruction({
                keys: [
                    { pubkey: payer.publicKey, isSigner: true, isWritable: true }
                ],
                data: Buffer.from(memo, 'utf-8'),
                programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
            })
        );
    }
    const signature = await sendAndConfirmTransaction(connection, transferTransaction, [payer]);
    return signature;
};
const paySpl = async () => {
    const amt = parseFloat(amtArg) * 10 ** decimals; // decimals should match token mint's decimals - 6 for USDC & USDT
    const mintAddress = mintAddresses[currency];
    if (!mintAddress) {
        throw new Error(`Could not find mint address for ${currency}`);
    }
    const mintPublicKey = new PublicKey(mintAddress);
    const fromAtaPublicKey = await getAtaPublicKey(payer.publicKey, mintPublicKey);
    // console.log('fromAtaPublicKey', fromAtaPublicKey);
    const toAtaPublicKey = await getAtaPublicKey(receiver.publicKey, mintPublicKey);
    if (!(fromAtaPublicKey && toAtaPublicKey)) {
        throw new Error(`Public keys not found for ${currency}`);
    };

    // Creates TransferChecked instruction with programAddress 'Tokenkeg...'
    const tx = new Transaction().add(
        createTransferCheckedInstruction(
            fromAtaPublicKey,
            mintPublicKey,
            toAtaPublicKey,
            payer.publicKey, // from's owner
            // amt,
            amtArg,
            decimals
        )
    );
    // const tx = new Transaction().add(
    //     createTransferInstruction(
    //         fromAtaPublicKey,
    //         toAtaPublicKey,
    //         payer.publicKey,
    //         amt,
    //         [],
    //         ASSOCIATED_TOKEN_PROGRAM_ID
    //     )
    // )

    if (!skipMemo) {
        tx.add(
            new TransactionInstruction({
                keys: [
                    { pubkey: payer.publicKey, isSigner: true, isWritable: true }
                ],
                data: Buffer.from(memo, 'utf-8'),
                programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
            })
        );
    }
    const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
    return signature;

    /**
     * 
     * @param {PublicKey} ownerPublicKey 
     * @param {PublicKey} mintPublicKey 
     */
    async function getAtaPublicKey(ownerPublicKey, mintPublicKey) {
        const result = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, { mint: mintPublicKey });

        const potentialErrorString = JSON.stringify({ owner: ownerPublicKey.toString(), mint: mintPublicKey.toString() });
        if (!(Array.isArray(result.value) && result.value.length === 1)) {
            console.error('Unexpected result for ata account retrieval', potentialErrorString);
            process.exit(1);
        }
        if (!(result.value[0].pubkey instanceof PublicKey)) {
            console.error('Unexpected result for ata pubkey', potentialErrorString);
            process.exit(1);
        }
        return result.value[0].pubkey;
    }
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
