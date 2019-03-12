require('./setup');

const ether = require('./ether');
const send = require('./send');

const {
  ERC1820_REGISTRY_ABI,
  ERC1820_REGISTRY_ADDRESS,
  ERC1820_REGISTRY_BYTECODE,
  ERC1820_REGISTRY_DEPLOY_TX,
} = require('./data');

const contract = require('truffle-contract');

const ERC1820RegistryArtifact = contract({
  abi: ERC1820_REGISTRY_ABI,
  unlinked_binary: ERC1820_REGISTRY_BYTECODE, /* eslint-disable-line camelcase */
});
ERC1820RegistryArtifact.setProvider(web3.currentProvider);

async function ERC1820Registry (funder) {
  // Read https://eips.ethereum.org/EIPS/eip-1820 for more information as to how the ERC1820 registry is deployed to
  // ensure its address is the same on all chains.

  if ((await web3.eth.getCode(ERC1820_REGISTRY_ADDRESS)).length > '0x'.length) {
    return ERC1820RegistryArtifact.at(ERC1820_REGISTRY_ADDRESS);
  }

  // 0.08 ether is needed to deploy the registry, and those funds need to be transferred to the account that will deploy
  // the contract.
  await send.ether(funder, '0x5808bA8E60E0367C9067b328D75C1f3d29de58cf', ether('0.08'));

  await web3.eth.sendSignedTransaction(ERC1820_REGISTRY_DEPLOY_TX);

  return ERC1820RegistryArtifact.at(ERC1820_REGISTRY_ADDRESS);
}

module.exports = {
  ERC1820Registry,
};
