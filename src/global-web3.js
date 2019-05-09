let globalWeb3;

function setWeb3(web3) {
  if (globalWeb3 !== undefined) {
    throw new Error('Web3 instance has already been injected');
  }

  globalWeb3 = web3;
}

function getWeb3() {
  if (globalWeb3 === undefined) {
    if (typeof web3 !== 'undefined') {
      // if there is a global web3 instance we use it
      setWeb3(web3);
    } else {
      throw new Error(
        `No Web3 instance can be found. Please manually inject one: require('openzeppelin-test-helpers/inject-web3')(web3)`);
    }
  }

  return globalWeb3;
}

module.exports = {
  setWeb3,
  getWeb3,
};
