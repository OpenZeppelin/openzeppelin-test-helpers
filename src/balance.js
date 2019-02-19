const { BN } = require('./setup');

class Tracker {
  constructor (acc) {
    this.account = acc;
    this.balances = [];
  }
  async delta () {
    const current = await this.get();
    return current.sub(this.balances[0]);
  }
  async get () {
    const bal = new BN(await web3.eth.getBalance(this.account));
    const len = this.balances.push(bal);
    if (len > 2) { this.balances.shift(); }
    return bal;
  }
}

async function balanceTracker (owner) {
  const tracker = new Tracker(owner);
  await tracker.get();
  return tracker;
}

async function balanceCurrent (account) {
  return new BN(await web3.eth.getBalance(account));
}

module.exports = {
  current: balanceCurrent,
  tracker: balanceTracker,
};
