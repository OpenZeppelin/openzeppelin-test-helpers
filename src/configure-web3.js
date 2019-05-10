const semver = require('semver');

let globalWeb3;

function setWeb3 (web3) {
  if (globalWeb3 !== undefined) {
    if (globalWeb3 === web3) {
      return;
    } else {
      throw new Error('web3 is already configured');
    }
  }

  // this could be taken from package.dependencies in the future
  const requiredVersion = '1.0.0-beta.37';

  if (!semver.satisfies(web3.version, requiredVersion)) {
    throw new Error(`web3@${web3.version} detected, incompatible with requirement of web3@${requiredVersion}`);
  }

  globalWeb3 = web3;
}

function getWeb3 () {
  if (globalWeb3 === undefined) {
    throw new Error('web3 is not configured');
  }

  return globalWeb3;
}

module.exports = {
  setWeb3,
  getWeb3,
};
