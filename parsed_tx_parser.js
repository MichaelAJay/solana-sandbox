const { PublicKey, Connection } = require("@solana/web3.js");
const { connectionUrl } = require("./constants");

const tx = {
  blockTime: 1736538875,
  meta: {
    computeUnitsConsumed: 22059,
    err: null,
    fee: 5000,
    innerInstructions: [
    ],
    logMessages: [
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: Transfer",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4644 of 400000 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr invoke [1]",
      "Program log: Signed by 62xnV1uyLB4Y1aVPj7iRfQjLzACxq58qvQP6Py7K3bV1",
      "Program log: Memo (len 7): \"my_memo\"",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr consumed 17415 of 395356 compute units",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr success",
    ],
    postBalances: [
      4987383080,
      2039280,
      2039280,
      521498880,
      934087680,
    ],
    postTokenBalances: [
      {
        accountIndex: 1,
        mint: "68gvqbgvw9Lq4GSjPShcGoz7eGZoQfCEzzSgzsNToJge",
        owner: "62xnV1uyLB4Y1aVPj7iRfQjLzACxq58qvQP6Py7K3bV1",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "999979999990",
          decimals: 6,
          uiAmount: 999979.99999,
          uiAmountString: "999979.99999",
        },
      },
      {
        accountIndex: 2,
        mint: "68gvqbgvw9Lq4GSjPShcGoz7eGZoQfCEzzSgzsNToJge",
        owner: "CsEMb5UiVdQ6HS1YYAm87xM5x4o2Njy3YrTBYcyWLHot",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "20000010",
          decimals: 6,
          uiAmount: 20.00001,
          uiAmountString: "20.00001",
        },
      },
    ],
    preBalances: [
      4987388080,
      2039280,
      2039280,
      521498880,
      934087680,
    ],
    preTokenBalances: [
      {
        accountIndex: 1,
        mint: "68gvqbgvw9Lq4GSjPShcGoz7eGZoQfCEzzSgzsNToJge",
        owner: "62xnV1uyLB4Y1aVPj7iRfQjLzACxq58qvQP6Py7K3bV1",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "999989999990",
          decimals: 6,
          uiAmount: 999989.99999,
          uiAmountString: "999989.99999",
        },
      },
      {
        accountIndex: 2,
        mint: "68gvqbgvw9Lq4GSjPShcGoz7eGZoQfCEzzSgzsNToJge",
        owner: "CsEMb5UiVdQ6HS1YYAm87xM5x4o2Njy3YrTBYcyWLHot",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "10000010",
          decimals: 6,
          uiAmount: 10.00001,
          uiAmountString: "10.00001",
        },
      },
    ],
    rewards: [
    ],
    status: {
      Ok: null,
    },
  },
  slot: 353204224,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: {
            _bn: {
              negative: 0,
              words: [
                6631504,
                29222240,
                22299385,
                34317411,
                10600450,
                21454886,
                3500907,
                63459769,
                54549325,
                1225413,
                0,
              ],
              length: 10,
              red: null,
            },
          },
          signer: true,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: {
            _bn: {
              negative: 0,
              words: [
                59223680,
                4571748,
                8119306,
                19376484,
                14383989,
                52855282,
                53685488,
                41374557,
                39394304,
                860479,
                0,
              ],
              length: 10,
              red: null,
            },
          },
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: {
            _bn: {
              negative: 0,
              words: [
                3534628,
                46704909,
                48702095,
                59685526,
                12386216,
                37296095,
                26355609,
                387490,
                27188769,
                3973212,
                0,
              ],
              length: 10,
              red: null,
            },
          },
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: {
            _bn: {
              negative: 0,
              words: [
                17122445,
                65671184,
                62398017,
                58126922,
                8140213,
                3575327,
                38700822,
                8657204,
                56269097,
                86676,
                0,
              ],
              length: 10,
              red: null,
            },
          },
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: {
            _bn: {
              negative: 0,
              words: [
                50266281,
                54354271,
                58266536,
                62225772,
                1881221,
                62578283,
                12457068,
                42356583,
                48355173,
                112509,
                0,
              ],
              length: 10,
              red: null,
            },
          },
          signer: false,
          source: "transaction",
          writable: false,
        },
      ],
      instructions: [
        {
          parsed: {
            info: {
              amount: "10000000",
              authority: "62xnV1uyLB4Y1aVPj7iRfQjLzACxq58qvQP6Py7K3bV1",
              destination: "HKe9LCVxFKyxksiMXQonLt18WG8zoj27bJoBF7vgEtDh",
              source: "4Y1pazpc98QEiAJ6KzDLAeUGuZ3HhtPbKbrcx3kRB4Es",
            },
            type: "transfer",
          },
          program: "spl-token",
          programId: {
            _bn: {
              negative: 0,
              words: [
                50266281,
                54354271,
                58266536,
                62225772,
                1881221,
                62578283,
                12457068,
                42356583,
                48355173,
                112509,
                0,
              ],
              length: 10,
              red: null,
            },
          },
          stackHeight: null,
        },
        {
          parsed: "my_memo",
          program: "spl-memo",
          programId: {
            _bn: {
              negative: 0,
              words: [
                17122445,
                65671184,
                62398017,
                58126922,
                8140213,
                3575327,
                38700822,
                8657204,
                56269097,
                86676,
                0,
              ],
              length: 10,
              red: null,
            },
          },
          stackHeight: null,
        },
      ],
      recentBlockhash: "GQxVciJawRBEexkKVv8dfqNkURhVWDrKtkZz2j8znq6s",
    },
    signatures: [
      "2WBgkkP42dUPQxJqDwqe9LZDcFySBhGbmL94oUqYmDGsswR38HgiVQAFL34zaZrB3Dj6x4ZV8uVULGUHbQXXpD3h",
    ],
  },
}

const { transaction, meta } = tx;
const { postBalances, postTokenBalances, preBalances, preTokenBalances } = meta;
const connection = new Connection(connectionUrl);

const getAtaPublicKeyString = async (owner, mint) => {
  console.log('owner', owner, 'mint', mint);
  const { value: parsedTokenAccountsByOwner } =  await connection.getParsedTokenAccountsByOwner(new PublicKey(owner), { mint: new PublicKey(mint) });
  console.log('Parsed token accounts length', parsedTokenAccountsByOwner.length);
  for (const accountInfo of parsedTokenAccountsByOwner) {
    console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
    console.log(`pubkey string: ${accountInfo.pubkey.toString()}`);
    console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
    console.log(
      `owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`,
    );
    console.log(
      `decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`,
    );
    console.log(
      `amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`,
    );
    console.log("====================");
  }
  return parsedTokenAccountsByOwner[0].pubkey.toBase58();
};

const amountParser = async () => {
  // pre & postBalances are number arrays
  // pre & postTokenBalances are object arrays.
  let source, destination, amount;
  for (const preTokenBalance of preTokenBalances) {
    const accountIndex = preTokenBalance.accountIndex;
    console.log('account index', accountIndex);
    const preTokenBalanceUiTokenAmount = preTokenBalance.uiTokenAmount;
    // Find corresponding postTokenBalance
    const correspondingPostTokenBalance = postTokenBalances.find(postTokenBalance => postTokenBalance.accountIndex === accountIndex);
    if (!correspondingPostTokenBalance) {
      throw new Error('No corresponding post token balance')
    }
    const postTokenBalanceUiTokenAmount = correspondingPostTokenBalance.uiTokenAmount;
    const publicKeyString = await getAtaPublicKeyString(preTokenBalance.owner, preTokenBalance.mint);
    // Negative change means send, positive change means receive
    const change = postTokenBalanceUiTokenAmount.uiAmount - preTokenBalanceUiTokenAmount.uiAmount;
    const changeAmount = Math.abs(change);
    if (typeof amount === 'number' && amount !== changeAmount) {
      throw new Error('Non-matching amounts')
    }
    amount = changeAmount;

    // Experimental
    const accountKeys = transaction.message.accountKeys;
    const publicKey = new PublicKey(accountKeys[accountIndex].pubkey._bn);
    console.log('public key to string', publicKey.toString())

    if (change === 0) { continue; }
    else if (change < 0) { 
      if (source) {
        throw new Error('Overwriting source issue');
      }
      source = publicKeyString
      console.log('source', source);
    }
    else {
      if (destination) {
        throw new Error('Overwriting destination issue')
      }
      destination = publicKeyString;
      console.log('destination', destination);
    }
  }
  console.log(JSON.stringify({ source, destination, amount }));
}

const keyChecker = async () => {
  for (const account of transaction.message.accountKeys) {
    const publicKey = new PublicKey(account.pubkey._bn);
    console.log(publicKey.toString());
  }
}

(async () => {
  // await amountParser();
  await keyChecker();
})()
