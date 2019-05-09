const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);

  try {
    require('openzeppelin-test-helpers/inject-web3')(web3);
    console.error('Successfully injected web3 instance');
  } catch (e) {
    throw new Error('Could not inject web3 instance');
  }
};
