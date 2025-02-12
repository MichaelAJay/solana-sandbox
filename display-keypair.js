const { Keypair } = require("@solana/web3.js");
const { test_secretKey: id } = require('./test_payer_secret_key');

const keypair = Keypair.fromSecretKey(Uint8Array.from(id));
console.log({publicKey: keypair.publicKey.toString(), secretKey: Buffer.from(keypair.secretKey).toString('hex')});