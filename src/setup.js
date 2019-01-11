const chai = require('chai');

const BN = web3.utils.BN;

const should = chai
  .use(require('chai-bn')(BN))
  .should();

module.exports = {
  BN,
  expect: chai.expect,
  should,
};
