To pay SOL, USDC_sol, or USDT_sol:

1) Run pay.js <currency> <amt> <invoiceId> <skipMemo>
currency should be in 'SOL', 'USDC_sol', 'USDT_sol'
amt should be a positive number
invoiceId should be an externId

Here's a useful function you can add to your .zshrc or similar.
function payOnSol() {
    local currency=$1 # should be 'SOL', 'USDC_sol', or 'USDT_sol' - will exit otherwise
    local amount=$2 # in lamports if SOL, in "base" currency if SPL (for instance, 10 if sending 10 USDC)
    local memo=$3 # should be an externId - will default to 'invalid_memo' if not included
    local skipMemo=$4 # default false. If included as '--skipMemo', will exclude memo instruction, whether provided in args or not
    node /<your-path-to>/solana-sandbox.pay.js "$currency" "$amount" "$memo" "$skipMemo"
}