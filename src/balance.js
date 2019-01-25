const { BN } = require('./setup');

function Tracker(acc){
  let balances = [];
  let account = acc;
  this.delta = async function() {
    let current = await this.get();
    return current.sub(balances[balances.length - 2]);
  },
  this.get = async function() {
    let bal = new BN(await web3.eth.getBalance(account));
    balances.push(bal);
    return bal;
  }
}

async function balanceTracker(owner) {
  let tracker = new Tracker(owner);
  await tracker.get();
  return tracker;
}

module.exports = balanceTracker
