require('./setup');

const ether = require('./ether');
const send = require('./send');

const { ERC1820_REGISTRY_DEPLOY_TX } = require('./data');

async function ERC1820Registry (from) {
  // Read https://eips.ethereum.org/EIPS/eip-1820 for more information as to how the ERC1820 registry is deployed to
  // ensure its address is the same on all chains.

  // 0.08 ether is needed to deploy the registry, and those funds need to be transferred to the account that will deploy
  // the contract.
  await send.ether(from, '0x5808bA8E60E0367C9067b328D75C1f3d29de58cf', ether('0.08'));

  await web3.eth.sendSignedTransaction(ERC1820_REGISTRY_DEPLOY_TX);

  return '0x1820b744B33945482C17Dc37218C01D858EBc714';
}

module.exports = {
  ERC1820Registry,
};
