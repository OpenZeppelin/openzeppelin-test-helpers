const { BN } = require('./setup');

function Tracker(acc){
  this.balances = [];
  this.account = acc;
  this.delta = async function() {
    let current = await this.get();
    return current.sub(this.balances[this.balances.length - 2]);
  },
  this.intial = function(){
    return this.balances[0];
  },

  this.get = async function() {
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

module.exports = balanceTracker
