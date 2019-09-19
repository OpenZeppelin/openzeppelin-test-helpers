const { web3, BN } = require('./setup');
const { expect } = require('chai');

function expectEvent(tx, eventName, eventArgs = {}) {
  if ('events' in tx) { // web3 contract detection
    //inEvents(tx.events, eventName, eventArgs);

    const logs = Object.keys(tx.events).map(name =>
      ({ event: name, args: tx.events[name].returnValues })
    );

    inLogs(logs, eventName, eventArgs);

  } else if (!('logs' in tx)) { // truffle-contract detection
    inLogs(tx.logs, eventName, eventArgs);
  } else {
    throw new Error('Unknown tx object');
  }
}

function inEvents (events, eventName, eventArgs = {}) {
  expect(events).to.have.property(eventName);

  const exception = [];
  const event = events.find(function (e) {
    for (const [k, v] of Object.entries(eventArgs)) {
      try {
        contains(e.args, k, v);
      } catch (error) {
        exception.push(error);
        return false;
      }
    }
    return true;
  });

  if (event === undefined) {
    throw exception[0];
  }

  return event;
}

function inLogs (logs, eventName, eventArgs = {}) {
  const events = logs.filter(e => e.event === eventName);
  expect(events.length > 0).to.equal(true, `No '${eventName}' events found`);

  const exception = [];
  const event = events.find(function (e) {
    for (const [k, v] of Object.entries(eventArgs)) {
      try {
        contains(e.args, k, v);
      } catch (error) {
        exception.push(error);
        return false;
      }
    }
    return true;
  });

  if (event === undefined) {
    throw exception[0];
  }

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
  expect(key in args).to.equal(true, `Event argument '${key}' not found`);

  if (value === null) {
    expect(args[key]).to.equal(null);
  } else if (isBN(args[key]) || isBN(value)) {
    expect(args[key]).to.be.bignumber.equal(value);
  } else {
    expect(args[key]).to.be.equal(value);
  }
}

function isBN (object) {
  return BN.isBN(object) || object instanceof BN;
}

expectEvent.inEvents = inEvents;
expectEvent.inLogs = inLogs;
expectEvent.inConstruction = inConstruction;
expectEvent.inTransaction = inTransaction;
module.exports = expectEvent;


