To pay SOL, USDC_sol, or USDT_sol:

0) Update the imported payer and receiver - but make sure each maintains that name:
const { <yourPayerKey>: payer }  = require('./your-payer-secret-key');
const { <yourReceiverKey>: receiver } = require('./your-receiver-secret-key');

1) Run pay.js <currency> <amt> <invoiceId>
currency should be in 'SOL', 'USDC_sol', 'USDT_sol'
amt should be a positive number
invoiceId should be an externId