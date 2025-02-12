1) npm install (I'm using Node verison 20.13.1)
2) node create-accounts.js

## Should have two files: ##
#your-secret-keys.js#
const payer = <number[]>
const receiver = <number[]>
module.exports = { payer, receiver }

#your-sol-addresses.txt#
payer: <base58string>
receiver: <base58string>


3) 
NOTE: If you don't do this, then you'll get an error when you run create-atas.js, it will look like this:
Message: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.. 
SECOND NOTE: There is an 8 hour cooldown BY IP - so make sure you INITIALIZE BOTH addresses by sending to each.
Go to faucet.solana.com and add your wallet addresses from #your-sol-addresses.txt#. 

Read the two notes above, then airdrop 5 SOL to each of your addresses to initialize them.
If you accidentally use up all your airdrops, make sure each has been sent a small amount of SOL (0.01 is plenty). Use the sol-transfer-utility.js script.

4) node create-atas.js
Note: This has failed for me before, and then immediately succeeded on a rerun.
Second note: this one can take up to a few minutes to run.
5) Open your-addresses.txt
6) Confirm addresses
- Goto solscan.io
- Switch to devnet
- Ensure the following
-- SOL addresses exists
-- Each SPL ATA (e.g. USDC, USDT) & their owner is respective SOL address
-- Each SPL ATA also corresponds to the correct mint (SPL Token Address)
-- Your payer SPL ATAs should each have 1M tokens from each token account.