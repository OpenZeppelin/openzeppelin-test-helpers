const { BigNumber } = require('./setup');

module.exports = {
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  MAX_UINT256: new BigNumber(2).pow(new BigNumber(256)).sub(new BigNumber(1)),
};
