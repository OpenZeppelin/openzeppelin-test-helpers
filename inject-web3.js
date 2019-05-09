const { setWeb3 } = require('./src/global-web3');

module.exports = function (web3) {
  // [TODO] check version
  setWeb3(web3);

  return require('./index.js');
};
