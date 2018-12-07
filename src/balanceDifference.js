async function balanceDifference (account, promiseFunc) {
  const balanceBefore = web3.eth.getBalance(account);
  await promiseFunc();
  const balanceAfter = web3.eth.getBalance(account);
  return balanceAfter.sub(balanceBefore);
}

module.exports = balanceDifference;
