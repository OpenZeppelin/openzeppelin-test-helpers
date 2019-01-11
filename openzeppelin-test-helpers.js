const { BN, expect, should } = require('./src/setup');

module.exports = {
  balance: require('./src/balance'),
  BN,
  constants: require('./src/constants'),
  ether: require('./src/ether'),
  expect,
  expectEvent: require('./src/expectEvent'),
  makeInterfaceId: require('./src/makeInterfaceId'),
  send: require('./src/send'),
  should,
  shouldFail: require('./src/shouldFail'),
  time: require('./src/time'),
};
