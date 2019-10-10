const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);

  try {
    require('@openzeppelin/test-helpers/configure')({ provider: web3.currentProvider, environment: 'truffle' });

    console.error('Successfully configured Web3 instance');
  } catch (e) {
    throw new Error(`Could not configure Web3 instance.\n${e}`);
  }
};
