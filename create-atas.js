const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { connectionUrl, stableCoins } = require('./constants');
const { createAssociatedTokenAccount, createMint, mintToChecked } = require('@solana/spl-token');
const { appendFileSync } = require('fs');
const path = require('path');

// Change the line below to match const { <yourname>_secretKey: payingPrivateKey } = require('./<yourname>_payer_secret_key');
const { test_secretKey: payingPrivateKey } = require('./test_payer_secret_key');
 
const tokenDecimals = 6; // Should be 6 for USDC & USDT proxies
const tokensToMint = 10 ** tokenDecimals;

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
 * @param {Keypair} ownerAndFeePayer 
 * @returns {Promise<PublicKey>}
 */
const createTokenAccount = async (mintPublicKey, ownerAndFeePayer) => {
    const ataPublicKey = await createAssociatedTokenAccount(
        connection,
        ownerAndFeePayer,
        mintPublicKey,
        ownerAndFeePayer.publicKey
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
        const keypair = Keypair.fromSecretKey(Uint8Array.from(payingPrivateKey));
        writeLineOut('your-addresses.txt', `SOL: ${keypair.publicKey.toString()}`);

        await Promise.all(stableCoins.map(async (currency) => {
            const mintPublicKey = await createTokenMint(keypair);
            writeLineOut('mint-addresses.txt', `${currency}: ${mintPublicKey.toString()}`);

            const ataPublicKey = await createTokenAccount(mintPublicKey, keypair);
            writeLineOut('your-addresses.txt', `${currency}: ${ataPublicKey.toString()}`);

            // Note - third arg should be derived from second arg, as is done above - don't change that
            await mintTokens(mintPublicKey, keypair, ataPublicKey);
        }));
        console.log('Complete');
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