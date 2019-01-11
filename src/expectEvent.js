const { BN, expect, should } = require('./setup');

function inLogs (logs, eventName, eventArgs = {}) {
  const event = logs.find(function (e) {
    if (e.event === eventName) {
      for (const [k, v] of Object.entries(eventArgs)) {
        contains(e.args, k, v);
      }
      return true;
    }
  });
  should.exist(event);
  return event;
}

async function inConstruction (contract, eventName, eventArgs = {}) {
  return inTransaction(contract.transactionHash, contract.constructor, eventName, eventArgs);
}

async function inTransaction (txHash, emitter, eventName, eventArgs = {}) {
  const receipt = await web3.eth.getTransactionReceipt(txHash);
  const logs = emitter.decodeLogs(receipt.logs);
  return inLogs(logs, eventName, eventArgs);
}

function contains (args, key, value) {
  (key in args).should.equal(true, `Unknown event argument '${key}'`);

  if (value === null) {
    expect(args[key]).to.equal(null);
  } else if (isBN(args[key])) {
    expect(args[key]).to.be.bignumber.equal(value);
  } else {
    expect(args[key]).to.be.equal(value);
  }
}

function isBN (object) {
  return BN.isBN(object) || object instanceof BN;
}

module.exports = {
  inLogs,
  inConstruction,
  inTransaction,
};
