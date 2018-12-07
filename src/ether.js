const { BigNumber } = require('./setup');

function ether (n) {
  return new BigNumber(web3.toWei(n, 'ether'));
}

module.exports = ether;
