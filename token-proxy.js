const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");
// const { payingPrivateKey } = require("./private_constants");
const { payer: payingPrivateKey } = require('./payer-devnet-keypair');
const { createMint, createAssociatedTokenAccount, mintToChecked, getOrCreateAssociatedTokenAccount } = require("@solana/spl-token");
const { appendFileSync } = require('fs');
const path = require('path');
const { solAcceptanceKeyString, connectionUrl } = require("./constants");

const env = {
  tokenDecimals: 6,
  tokensToMint: 10 ** 6,
  receiverPublicKeyString: solAcceptanceKeyString
};

const { tokenDecimals, tokensToMint, receiverPublicKeyString } = env;
const connection = new Connection(connectionUrl);
const feePayer = Keypair.fromSecretKey(Uint8Array.from(payingPrivateKey));
const mintAuthority = feePayer;
const mintAuthorityPublicKey = mintAuthority.publicKey;
const invoicePayerPublicKey = feePayer.publicKey;
const senderSolPublicKey = invoicePayerPublicKey;
const receiverSolPublicKey = new PublicKey(receiverPublicKeyString); // For acceptance monitoring

const createTokenMint = async () => {
  try {
    console.log('Starting createTokenMint');
    const mintPublicKey = await createMint(
      connection,
      feePayer, // fee payer
      mintAuthorityPublicKey, // mint authority
      null, // freeze authority - IMMUTABLE
      tokenDecimals // decimals
    );
    console.log('Mint created');
    return mintPublicKey;
  } catch (err) {
    console.error('err', err);
    throw err;
  }
};

/**
 * Deterministically derives ata account from SOL account input
 * @param {PublicKey} mintPublicKey
 * @param {PublicKey} ownerPublicKey - SOL account from which the ata is derived
 */
const createTokenAccount = async (mintPublicKey, ownerPublicKey) => {
  const ataPublicKey = await createAssociatedTokenAccount(
    connection,
    feePayer,
    mintPublicKey,
    ownerPublicKey
  );
  return ataPublicKey;
};
/**
 * 
 * @param {PublicKey} mintPublicKey 
 * @param {PublicKey} ataPublicKey
 */
const mintTokens = async (mintPublicKey, ataPublicKey) => {
  const txhash = await mintToChecked(
    connection,
    feePayer,
    mintPublicKey,
    ataPublicKey,
    feePayer,
    tokensToMint * (10 ** tokenDecimals),
    tokenDecimals
  );
  return txhash;
};

(async () => {
  try {
    // Confirm connection
    const nodeVersion = await connection.getVersion();
    console.log('Connection is live', nodeVersion);

    // confirm feePayer has sufficient funds
    const payingAccountBalance = await connection.getBalance(feePayer.publicKey);
    console.log(payingAccountBalance);
    // Arbitrary amount to 
    if (payingAccountBalance < 5) {
      // Will error if not on local
      await airdropSol(feePayer.publicKey);
    }

    console.time('createTokenMint');
    const mintPublicKey = await createTokenMint();
    console.timeEnd('createTokenMint');
    writeLineOut(`mintPublicKey ${mintPublicKey.toBase58()}`);

    // Create deterministic ata address from SOL acceptance address
    console.log('fiddin receiver ata public key');
    const receiverAtaPublicKey = await createTokenAccount(mintPublicKey, receiverSolPublicKey);
    writeLineOut('### Proxy receiver address for an SPL (e.g. USDC): ###');
    writeLineOut(`ataPublicKey (receiver) ${receiverAtaPublicKey.toBase58()}`);

    /**
     * Payer directly receives tokensToMint tokens
    */
   console.log('fiddin payer ata public key');
    const payerAtaPublicKey = await createTokenAccount(mintPublicKey, senderSolPublicKey);
    writeLineOut(`ataPublicKey (payer) ${payerAtaPublicKey.toBase58()}`);
    console.log('fiddin mint tokens');
    const mintTokenTxHash = await mintTokens(mintPublicKey, payerAtaPublicKey);
    writeLineOut(`txhash ${mintTokenTxHash}`);

    console.log('Success! Open mint_info.txt');
  } catch (err) {
    console.error(err);
    throw err;
  }
})();

// Helpers
/**
 * 
 * @param {string} line 
 */
const writeLineOut = (line) => {
  const filePath = path.join(__dirname, 'mint_info.txt');
  appendFileSync(filePath, `${line}\n`);
};

/**
 * Airdrop 
 * @param {PublicKey} target 
 * @throws {Error} If the airdrop fails (e.g. connection not to local) 
 */
const airdropSol = async (target) => {
  const airdropSignature = await connection.requestAirdrop(target, 5 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSignature);
};