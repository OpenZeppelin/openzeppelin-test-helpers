const { web3, BN } = require('./setup');
const { fromWei } = require('web3-utils');

class Tracker {
  constructor (acc, units) {
    this.account = acc;
    this.units = units;
  }
  async delta (units = this.units) {
    const current = await balanceCurrent(this.account);
    const delta = current.sub(this.prev);
    this.prev = current;

    return new BN(fromWei(delta, units));
  }
  async get (units = this.units) {
    this.prev = await balanceCurrent(this.account);

    return new BN(fromWei(this.prev, units));
  }
}

async function balanceTracker (owner, units = 'wei') {
  const tracker = new Tracker(owner, units);
  await tracker.get();
  return tracker;
}

async function balanceCurrent (account, units = 'wei') {
  return new BN(fromWei(await web3.eth.getBalance(account), units));
}

module.exports = {
  current: balanceCurrent,
  tracker: balanceTracker,
};
