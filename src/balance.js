const { BN } = require('./setup');

class Tracker {
  constructor(acc){
    this.account = acc;
    this.balances = [];
  }
  async delta() {
    let current = await this.get();
    return current.sub(this.balances[this.balances.length - 2]);
  }
  async get() {
    let bal = new BN(await web3.eth.getBalance(this.account));
    this.balances.push(bal);
    return bal;
  }
}

async function balanceTracker(owner) {
  let tracker = new Tracker(owner);
  await tracker.get();
  return tracker;
}

async function balanceCurrent (account) {
  return new BN(await web3.eth.getBalance(account));
}

module.exports = {
  balanceCurrent,
  balanceTracker
}
