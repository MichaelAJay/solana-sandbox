const tx = {
  blockTime: 1736814432,
  meta: {
    computeUnitsConsumed: 17541,
    err: null,
    fee: 5000,
    innerInstructions: [
    ],
    logMessages: [
      "Program 11111111111111111111111111111111 invoke [1]",
      "Program 11111111111111111111111111111111 success",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr invoke [1]",
      "Program log: Signed by 5DWwsVC2VctywELs1fT4ULTPZPWGymChQczdZzm2JLir",
      "Program log: Memo (len 7): \"my_memo\"",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr consumed 17391 of 399850 compute units",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr success",
    ],
    postBalances: [
      18046429120,
      16550000000,
      1,
      521498880,
    ],
    postTokenBalances: [
    ],
    preBalances: [
      18146434120,
      16450000000,
      1,
      521498880,
    ],
    preTokenBalances: [
    ],
    rewards: [
    ],
    status: {
      Ok: null,
    },
  },
  slot: 353931720,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: {
            _bn: {
              negative: 0,
              words: [
                26446495,
                21869000,
                18167742,
                55301958,
                24673603,
                22256718,
                24992268,
                11824145,
                64476902,
                1026276,
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
                22588903,
                22499962,
                60363496,
                24401527,
                49353432,
                24474265,
                11512911,
                6589027,
                41413248,
                2888620,
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
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ],
              length: 1,
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
      ],
      instructions: [
        {
          parsed: {
            info: {
              destination: "CsEMb5UiVdQ6HS1YYAm87xM5x4o2Njy3YrTBYcyWLHot",
              lamports: 100000000,
              source: "5DWwsVC2VctywELs1fT4ULTPZPWGymChQczdZzm2JLir",
            },
            type: "transfer",
          },
          program: "system",
          programId: {
            _bn: {
              negative: 0,
              words: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
              ],
              length: 1,
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
      recentBlockhash: "AHJKhmnqi14tULp5wiorRyz7CHJ3uMh85yCuMXbP9hz5",
    },
    signatures: [
      "2BV6kZozn6na7i2ohBrPKwDnKpeH2vbKeEiDbtyBeE2XhzuiQcAigEjRNBFmFWovez94SfGVRa2ngCt1gntKU4Ru",
    ],
  },
}

const { instructions } = tx.transaction.message;
const transferInstruction = instructions.find(instruction => typeof instruction?.parsed?.type === 'string' && instruction.parsed.type.toLowerCase().includes('transfer'));
