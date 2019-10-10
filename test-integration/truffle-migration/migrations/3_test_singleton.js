module.exports = async function(deployer, network, accounts) {
  const { singletons } = require('@openzeppelin/test-helpers');

  await singletons.ERC1820Registry(accounts[0]);

  console.error('Successfully deployed the ERC1820 registry');
};
