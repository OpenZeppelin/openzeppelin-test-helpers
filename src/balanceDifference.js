const { BN } = require('./setup');

async function balanceDifference (account, promiseFunc) {
  const balanceBefore = new BN(await web3.eth.getBalance(account));
  await promiseFunc();
  const balanceAfter = new BN(await web3.eth.getBalance(account));
  return balanceAfter.sub(balanceBefore);
}

module.exports = balanceDifference;
