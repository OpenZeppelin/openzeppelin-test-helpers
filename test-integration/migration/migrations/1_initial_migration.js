const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);

  try {
    require('openzeppelin-test-helpers/inject-web3')(web3);

    console.error('Successfully injected Web3 instance');
  } catch (e) {
    throw new Error(`Could not inject Web3 instance.\n${e}`);
  }
};
