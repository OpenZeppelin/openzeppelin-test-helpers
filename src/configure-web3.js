const Web3 = require('web3');

let internalWeb3 = new Web3();

function setWeb3Provider (provider) {
  internalWeb3.setProvider(provider);
}

function getWeb3 () {
  if (internalWeb3.currentProvider === null) {
    throw new Error('web3 provider 0is not configured');
  }

  return internalWeb3;
}

module.exports = {
  setWeb3Provider,
  getWeb3,
};
