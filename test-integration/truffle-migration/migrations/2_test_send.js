module.exports = async function(deployer, network, accounts) {
  const { send } = require('openzeppelin-test-helpers');

  await send.ether(accounts[0], accounts[1], 1);

  console.error('Successfully used send helper');
};
