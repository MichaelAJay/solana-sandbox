const { Connection } = require("@solana/web3.js");
const { connectionUrl } = require("./constants");

const connection = new Connection(connectionUrl);
(async () => {
  try {
    const transactions = await connection.getParsedTransactions([]);
    console.log('Method ran', transactions);
  } catch (err) {
    console.error(err);
    console.error('Exiting');
    process.exit(1);
  }
})();