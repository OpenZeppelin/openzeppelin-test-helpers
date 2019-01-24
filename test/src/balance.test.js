require('../../src/setup');

const balance = require('../../src/balance');
const send = require('../../src/send');
const ether = require('../../src/ether');

contract('balance', function ([sender, receiver]) {
  describe('current', function () {
    it('returns the current balance of an account as a BN', async function () {
      let tracker = await balance(sender);
      (await tracker.get()).should.be.bignumber.equal(await web3.eth.getBalance(sender));
    });
  });

  describe('difference', function () {
    it('returns balance increments', async function () {
      let tracker = await balance(receiver);
      await send.ether(sender, receiver, ether('1'));
      (await tracker.delta()).should.be.bignumber.equal(ether('1'));
    });

    it('returns balance decrements', async function () {
      let tracker = await balance(sender);
      await send.ether(sender, receiver, ether('1'));
      (await tracker.delta()).should.be.bignumber.equal(ether('-1'));
    });

    it('returns consecutive deltas', async function () {
      let tracker = await balance(sender);
      await send.ether(sender, receiver, ether('1'));
      let d1 = await tracker.delta();
      (await tracker.delta()).should.be.bignumber.equal('0');
    })
  });
});
