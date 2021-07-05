const { web3 } = require('./setup');
const { promisify } = require('util');

/**
 * Returns a snapshot object with the 'restore' function, which reverts blockchain to the captured state
 */
const snapshot = async function () {
  const snapshotData = await promisify(web3.currentProvider.send.bind(web3.currentProvider))({
    jsonrpc: '2.0',
    method: 'evm_snapshot',
    id: new Date().getTime(),
  });

  return {
    restore: async function () {
      await promisify(web3.currentProvider.send.bind(web3.currentProvider))({
        jsonrpc: '2.0',
        method: 'evm_revert',
        params: [snapshotData.result],
        id: new Date().getTime(),
      });
    },
  };
};

module.exports = snapshot;
