const { Keypair } = require("@solana/web3.js");

/**
 * This file is used to generate the public key/private key pair to act as the SYSTEM wallet for dev environment
 * The filepath for the private key is root/.config/solana/id.json
 * Obviously, since this is for development purposes, this private key doesn't necessarily have to be secured, but NEVER share private keys for mainnet environments
 * 
 * Once you have the output from this file, create an Account record through the Prisma Studio UI.
 * Set the label to "SYSTEM" and paste these values in.
 */

// Your private key here
const id = [];

const keypair = Keypair.fromSecretKey(Uint8Array.from(id));
console.log({publicKey: keypair.publicKey.toString(), secretKey: Buffer.from(keypair.secretKey).toString('hex')});