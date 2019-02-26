const { BN } = require('./setup');

class Tracker {
  constructor (acc) {
    this.account = acc;
    this.current = async () => new BN(await web3.eth.getBalance(this.account));
  };
  async delta () {
    const current = await this.current();
    const delta = current.sub(this.prev);
    this.prev = current;
    return delta;
  }
  async get () {
    this.prev = await this.current();
    return this.prev;
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
