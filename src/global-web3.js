const semver = require('semver');

let globalWeb3;

function setWeb3 (web3) {
  if (globalWeb3 !== undefined) {
    if (globalWeb3 === web3) {
      return;
    } else {
      throw new Error('A different Web3 instance has already been injected');
    }
  }

  // this could be taken from package.dependencies in the future
  const requiredVersion = '1.0.0-beta.37';

  if (!semver.satisfies(web3.version, requiredVersion)) {
    throw new Error(`web3@${web3.version} detected, incompatible with requirement of web3@${requiredVersion}`
    );
  }

  globalWeb3 = web3;
}

function getWeb3 () {
  if (globalWeb3 === undefined) {
    if (typeof web3 !== 'undefined') {
      // if there is a global web3 instance we use it
      setWeb3(web3);
    } else {
      // eslint-disable-next-line max-len
      throw new Error('No Web3 instance can be found. Please manually inject one: require(\'openzeppelin-test-helpers/inject-web3\')(web3)');
    }
  }

  return globalWeb3;
}

module.exports = {
  setWeb3,
  getWeb3,
};
