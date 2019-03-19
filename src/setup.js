const chai = require('chai');
const BN = web3.utils.BN;

chai.use(require('chai-bn')(BN));

module.exports = {
  BN,
};
