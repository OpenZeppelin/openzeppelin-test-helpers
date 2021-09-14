const { BN } = require('./src/setup');

module.exports = {
  BN,
  get farm () { return require('./src/farm'); },
  get dex () { return require('./src/dex'); },
};
