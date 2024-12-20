const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { payingPrivateKey } = require("./private_constants");
const { createMint, getMint, createAssociatedTokenAccount, mintToChecked } = require("@solana/spl-token");
const { appendFileSync } = require('fs');
const path = require('path');

const env = {
  connectionUrl: '',
  tokenDecimals: 6,
  tokensToMint: 10 ** 6,
  receiverPublicKeyString: ''
};

const { connectionUrl, tokenDecimals, tokensToMint, receiverPublicKeyString } = env;
const connection = new Connection(connectionUrl);
const feePayerAndMintAuthority = Keypair.fromSecretKey(payingPrivateKey);
const invoicePayerPublicKey = feePayerAndMintAuthority.publicKey;
const ataPayerPublicKey = invoicePayerPublicKey;
const ataOwnerPublicKey = new PublicKey(receiverPublicKeyString); // For acceptance monitoring

const createTokenMint = async () => {
  const mint = await createMint(
    connection,
    feePayerAndMintAuthority, // fee payer
    feePayerAndMintAuthority.publicKey, // mint authority
    null, // freeze authority - IMMUTABLE
    tokenDecimals // decimals
  );
  return mint;
};

/**
 * 
 * @param {PublicKey} mintPublicKey
 * @param {PublicKey} ownerPublicKey
 */
const createTokenAccount = async (mintPublicKey, ownerPublicKey) => {
  const ataPublicKey = await createAssociatedTokenAccount(
    connection,
    feePayerAndMintAuthority,
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
    feePayerAndMintAuthority,
    mintPublicKey,
    ataPublicKey,
    feePayerAndMintAuthority,
    tokensToMint * tokenDecimals,
    tokenDecimals
  );
  return txhash;
};

(async () => {
  // Confirm connection
  await connection.getVersion();

  // confirm feePayer has sufficient funds

  const mintPublicKey = await createTokenMint();
  writeLineOut(`mintPublicKey ${mintPublicKey.toBase58()}`);

  const payerAtaPublicKey = await createTokenAccount(mintPublicKey, ataPayerPublicKey);
  writeLineOut(`ataPublicKey (payer) ${payerAtaPublicKey.toBase58()}`);

  const receiverAtaPublicKey = await createTokenAccount(mintPublicKey, receiverAtaPublicKey);
  writeLineOut('### Proxy receiver address for an SPL (e.g. USDC): ###');
  writeLineOut(`ataPublicKey (receiver) ${receiverAtaPublicKey.toBase58()}`);

  /**
   * Payer directly receives tokensToMint tokens
   */
  const mintTokenTxHash = await mintTokens(mintPublicKey, payerAtaPublicKey);
  writeLineOut(`txhash ${mintTokenTxHash}`);

  console.log('Success! Open mint_info.txt');
})();

/**
 * 
 * @param {string} line 
 */
const writeLineOut = (line) => {
  const filePath = path.join(__dirname, 'mint_info.txt');
  appendFileSync(filePath, `${line}`);
};