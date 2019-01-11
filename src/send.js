const ethjsABI = require('ethjs-abi');

function findMethod (abi, name, args) {
  for (let i = 0; i < abi.length; i++) {
    const methodArgs = abi[i].inputs.map(input => input.type).join(',');
    if ((abi[i].name === name) && (methodArgs === args)) {
      return abi[i];
    }
  }
}

async function transaction (target, name, argsTypes, argsValues, opts = {}) {
  const abiMethod = findMethod(target.abi, name, argsTypes);
  const encodedData = ethjsABI.encodeMethod(abiMethod, argsValues);

  opts.from = opts.from || (await web3.eth.getAccounts())[0];
  return web3.eth.sendTransaction({ data: encodedData, to: target.address, ...opts });
}

function ether (from, to, value) {
  return web3.eth.sendTransaction({ from, to, value, gasPrice: 0 });
}

module.exports = {
  ether,
  transaction,
};
