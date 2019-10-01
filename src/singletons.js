const { web3 } = require('./setup');
const ether = require('./ether');
const send = require('./send');

const truffleContract = require('truffle-contract');

const {
  ERC1820_REGISTRY_ABI,
  ERC1820_REGISTRY_ADDRESS,
  ERC1820_REGISTRY_DEPLOY_TX,
} = require('./data');

const web3ERC1820Registry = new web3.eth.Contract(ERC1820_REGISTRY_ABI, ERC1820_REGISTRY_ADDRESS);

const truffleERC1820Registry = truffleContract({ abi: ERC1820_REGISTRY_ABI });
truffleERC1820Registry.setProvider(web3.currentProvider);

async function ERC1820Registry (funder) {
  // Read https://eips.ethereum.org/EIPS/eip-1820 for more information as to how the ERC1820 registry is deployed to
  // ensure its address is the same on all chains.

  if ((await web3.eth.getCode(ERC1820_REGISTRY_ADDRESS)).length > '0x0'.length) {
    return getDeployedERC1820Registry();
  }

  // 0.08 ether is needed to deploy the registry, and those funds need to be transferred to the account that will deploy
  // the contract.
  await send.ether(funder, '0xa990077c3205cbDf861e17Fa532eeB069cE9fF96', ether('0.08'));

  await web3.eth.sendSignedTransaction(ERC1820_REGISTRY_DEPLOY_TX);

  return getDeployedERC1820Registry();
}

function getDeployedERC1820Registry () {
  const environment = require('./configure-environment').getEnviroment();

  if (environment === 'truffle') {
    return truffleERC1820Registry.at(ERC1820_REGISTRY_ADDRESS);
  } else if (environment === 'web3') {
    return web3ERC1820Registry.clone();
  } else {
    throw new Error(`Unknown runtime environment: '${environment}'`);
  }
}

module.exports = {
  ERC1820Registry,
};
