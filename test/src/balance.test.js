require('../../src/setup');

const { balanceTracker, balanceCurrent } = require('../../src/balance');
const send = require('../../src/send');
const ether = require('../../src/ether');

contract('balance', function ([sender, receiver]) {
  describe('current', function () {
    it('returns the current balance of an account as a BN', async function () {
      (await balanceCurrent(sender)).should.be.bignumber.equal(await web3.eth.getBalance(sender));
    });
  });

  describe('balance tracker', function () {
    it('returns balance increments', async function () {
      const tracker = await balanceTracker(receiver);
      await send.ether(sender, receiver, ether('1'));
      (await tracker.delta()).should.be.bignumber.equal(ether('1'));
    });

    it('returns balance decrements', async function () {
      const tracker = await balanceTracker(sender);
      await send.ether(sender, receiver, ether('1'));
      (await tracker.delta()).should.be.bignumber.equal(ether('-1'));
    });

    it('returns consecutive deltas', async function () {
      const tracker = await balanceTracker(sender);
      await send.ether(sender, receiver, ether('1'));
      await tracker.delta();
      (await tracker.delta()).should.be.bignumber.equal('0');
    });
  });
});
