require('../configure')();

const web3 = require('./configure-web3').getWeb3();

const chai = require('chai');
const BN = web3.utils.BN;

chai.use(require('chai-bn')(BN));

module.exports = {
  web3,
  BN,
};
