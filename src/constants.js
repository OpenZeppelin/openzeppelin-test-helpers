const { BN } = require('./setup');

module.exports = {
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  MAX_UINT256: new BN(2).pow(new BN(256)).sub(new BN(1)),
};
