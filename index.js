const { BN } = require('./src/setup');

module.exports = {
  balance: require('./src/balance'),
  BN,
  constants: require('./src/constants'),
  ether: require('./src/ether'),
  expectEvent: require('./src/expectEvent'),
  makeInterfaceId: require('./src/makeInterfaceId'),
  send: require('./src/send'),
  expectFailure: require('./src/expectFailure'),
  singletons: require('./src/singletons'),
  time: require('./src/time'),
};
