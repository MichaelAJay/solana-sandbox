// const secretkeysfile = './int-tests-secret-keys.js';
// const secretkeysfile = './sol-pkg-help-privates.js';
const secretkeysfile = './your-secret-keys.js';

const { Keypair } = require("@solana/web3.js");
const { payer: id } = require(secretkeysfile);
const bs58 = require('bs58').default;

const keypair = Keypair.fromSecretKey(Uint8Array.from(id));
// console.log({publicKey: keypair.publicKey.toString(), secretKey: Buffer.from(keypair.secretKey).toString('hex')});
console.log({
    publicKey: keypair.publicKey.toString(),
    secretKey: bs58.encode(keypair.secretKey.slice(0, 32))
    // secretKey: bs58.encode(keypair.secretKey)
})