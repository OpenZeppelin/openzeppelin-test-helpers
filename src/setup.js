const chai = require('chai');
const semver = require('semver');

// Different web3 versions store the version string in different places
const web3Version = web3.version.api || web3.version;

const BigNumber = semver.satisfies(web3Version, '<1.0.0') ? web3.BigNumber : web3.utils.BN;

const should = chai
  .use(require('chai-bignumber')(BigNumber))
  .should();

module.exports = {
  BigNumber,
  should,
};
