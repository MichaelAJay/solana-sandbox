1) npm install (I'm using Node verison 20.13.1)
2) node create-secret-key.js <yourname>
3) See console log - output is wallet address
4) Go to faucet.solana.com and add your wallet address. Airdrop yourself 5 SOL two times
NOTE: If you don't do this, then you'll get an error when you run create-atas.js, it will look like this:
Message: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.. 

5) Open create-atas.js
  - Change the line specied in the imports to match the <yourname> arg provided in step 2 above
6) node create-atas.js
Note: This has failed for me before, and then immediately succeeded on a rerun.
7) Open your-addresses.txt
8) Confirm addresses
- Goto solscan.io
- Switch to devnet
- Ensure the following
-- SOL address exists
-- Each SPL ATA (e.g. USDC, USDT) & their owner is SOL address