const { Connection } = require("@solana/web3.js");
const { connectionUrl } = require("./constants");

const connection = new Connection(connectionUrl);

const main = async () => {
  const transactions = await connection.getTransactions(['2BV6kZozn6na7i2ohBrPKwDnKpeH2vbKeEiDbtyBeE2XhzuiQcAigEjRNBFmFWovez94SfGVRa2ngCt1gntKU4Ru']);
  console.log(JSON.stringify(transactions[0]));
}

(async () => {
  await main();
})()