const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { connectionUrl } = require('./constants');
const { createAssociatedTokenAccount, createMint, mintToChecked } = require('@solana/spl-token');
const { appendFileSync } = require('fs');
const path = require('path');

const { payer, receiver } = require('./your-secret-keys.js');
 
const tokenDecimals = 6; // Should be 6 for USDC & USDT proxies
const tokensToMint = 10 ** tokenDecimals;
const stableCoins = ['USDC_sol', 'USDT_sol'];

// Create connection
const connection = new Connection(connectionUrl);

/**
 * 
 * @param {Keypair} keypair
 * @returns {Promise<PublicKey>}
 */
const createTokenMint = async (keypair) => {
    const mintPublicKey = await createMint(
        connection,
        keypair, // fee payer
        keypair.publicKey, // mint authority
        null, // freeze authority
        tokenDecimals
    );
    return mintPublicKey;
}

/**
 * Determinstically derives ata account from SOL account
 * @param {PublicKey} mintPublicKey 
 * @param {Keypair} owner
 * @param {Keypair} feePayer
 * @returns {Promise<PublicKey>}
 */
const createTokenAccount = async (mintPublicKey, owner, feePayer) => {
    const ataPublicKey = await createAssociatedTokenAccount(
        connection,
        feePayer,
        mintPublicKey,
        owner.publicKey
    );
    return ataPublicKey;
}

/**
 * @param {PublicKey} mintPublicKey
 * @param {Keypair} keypair - owner of mint, and fee payer
 * @param {PublicKey} ataPublicKey - recipient of tokens - SHOULD BE DERIVED FROM keypair
 */
const mintTokens = async (mintPublicKey, keypair, ataPublicKey) => {
    return await mintToChecked(
        connection,
        keypair, // fee payer
        mintPublicKey,
        ataPublicKey,
        keypair, //minting authority
        tokensToMint * (10 ** tokenDecimals),
        tokenDecimals
    )
}

(async () => {
    try {
        // Confirm connection
        await connection.getVersion();
        console.log('Connection is live');

        // Create keypair for creating & owning mints, creating token accounts & acceptance
        const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(payer));
        const receiverKeypair = Keypair.fromSecretKey(Uint8Array.from(receiver));
        writeLineOut('your-addresses.txt', `SOL: ${payerKeypair.publicKey.toString()} (payer)`);
        writeLineOut('your-addresses.txt', `SOL: ${receiverKeypair.publicKey.toString()} (receiver)`)

        const currenciesToExport = []; // from mint-addresses.js module exports
        await Promise.all(stableCoins.map(async (currency) => {
            const mintPublicKey = await createTokenMint(payerKeypair);
            // writeLineOut('mint-addresses.txt', `${currency}: ${mintPublicKey.toString()}`);
            writeLineOut('mint-addresses.js', `const ${currency} = '${mintPublicKey.toString()}'`);
            currenciesToExport.push(currency);

            const actors = ['payer', 'receiver'];
            for (const actor of actors) {
                const owner = actor === 'payer' ? payerKeypair : receiverKeypair;

                const ataPublicKey = await createTokenAccount(mintPublicKey, owner, payerKeypair);
                writeLineOut('your-addresses.txt', `${currency}: ${ataPublicKey.toString()} (${actor})`);
                // Note - third arg should be derived from second arg, as is done above - don't change that
                if (actor === 'payer') {
                    await mintTokens(mintPublicKey, payerKeypair, ataPublicKey);
                }
            }
        }));
        writeLineOut('mint-addresses.js', `module.exports = { ${currenciesToExport.join(', ')} }`)
        console.log("Job's done");
        console.log('Checkout mint-addresses.js and your-addresses.txt')
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

/**
 * 
 * @param {string} file
 * @param {string} line
 */
const writeLineOut = (file, line) => {
    const filePath = path.join(__dirname, file);
    appendFileSync(filePath, `${line}\n`);
}