const { BN } = require('./setup');

async function balanceCurrent (account) {
  return new BN(await web3.eth.getBalance(account));
}

async function balanceDifference (account, promiseFunc) {
  const balanceBefore = new BN(await web3.eth.getBalance(account));
  await promiseFunc();
  const balanceAfter = new BN(await web3.eth.getBalance(account));
  return balanceAfter.sub(balanceBefore);
}

module.exports = {
  current: balanceCurrent,
  difference: balanceDifference,
};
