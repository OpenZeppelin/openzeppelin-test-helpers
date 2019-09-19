const { web3, BN } = require('./setup');
const { expect } = require('chai');
const flatten = require('lodash.flatten');

function expectEvent(tx, eventName, eventArgs = {}) {
  // truffle contract receipts have a 'logs' object, with an array of objects
  // with 'event' and 'args' properties, containing the event name and actual
  // values.
  // web3 contract receipts instead have an 'events' object, with properties
  // named after emitted events, each containing an object with 'returnValues'
  // holding the event data, or an array of these if multiple were emitted.

  // The simplest way to handle both of these receipts is to convert the web3
  // event format into the truffle one.

  if ('events' in tx) { // web3 contract detection
    const logs = flatten(Object.keys(tx.events).map(name => {
      if (Array.isArray(tx.events[name])) {
        return tx.events[name].map(event => ({ event: name, args: event.returnValues }));
      } else {
        return ({ event: name, args: tx.events[name].returnValues });
      }
    }));

    inLogs(logs, eventName, eventArgs);

  } else if ('logs' in tx) { // truffle-contract detection
    inLogs(tx.logs, eventName, eventArgs);

  } else {
    throw new Error('Unknown transaction receipt object');
  }
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

expectEvent.inLogs = inLogs;
expectEvent.inConstruction = inConstruction;
expectEvent.inTransaction = inTransaction;
module.exports = expectEvent;


