/* global web3 */

const Web3 = require('web3');

const DEFAULT_PROVIDER_URL = 'http://localhost:8545';

const internalWeb3 = new Web3();

function setWeb3Provider (provider) {
  internalWeb3.setProvider(provider);
}

function setDefaultWeb3Provider () {
  // If there is a (truffle-injected) global web3 instance, use that. Otherwise, use the default provider
  if (typeof web3 !== 'undefined') {
    setWeb3Provider(web3.currentProvider);
  } else {
    setWeb3Provider(DEFAULT_PROVIDER_URL);
  }
}

function getWeb3 () {
  if (internalWeb3.currentProvider === null) {
    throw new Error('web3 provider is not configured');
  }

  return internalWeb3;
}

setWeb3Provider.default = setDefaultWeb3Provider;

module.exports = {
  setWeb3Provider,
  getWeb3,
};
