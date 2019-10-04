require('../configure')();

const web3 = require('./config/web3').getWeb3();
require('@openzeppelin/contract-loader/lib/configure').set(web3);

const { load } = require('@openzeppelin/contract-loader');

const chai = require('chai');
const BN = web3.utils.BN;

chai.use(require('chai-bn')(BN));

module.exports = {
  web3,
  BN,
  load,
};
