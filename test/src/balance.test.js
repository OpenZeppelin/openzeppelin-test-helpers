require('../../src/setup');

const balance = require('../../src/balance');
const send = require('../../src/send');
const ether = require('../../src/ether');

contract('balance', function ([sender, receiver]) {
  describe('current', function () {
    it('returns the current balance of an account as a BN', async function () {
      (await balance.current(sender)).should.be.bignumber.equal(await web3.eth.getBalance(sender));
    });
  });

  describe('balance tracker', function () {
    it('returns current balance ', async function () {
      const tracker = await balance.tracker(receiver);
      (await tracker.get()).should.be.bignumber.equal(await web3.eth.getBalance(receiver));
    });

    it('get() adds a new checkpoint ', async function () {
      const tracker = await balance.tracker(sender);
      await send.ether(sender, receiver, ether('1'));
      await tracker.get();
      (await tracker.delta()).should.be.bignumber.equal('0');
    });

    it('returns correct deltas after get() checkpoint', async function () {
      const tracker = await balance.tracker(receiver);
      await send.ether(sender, receiver, ether('1'));
      await tracker.get();
      await send.ether(sender, receiver, ether('1'));
      (await tracker.delta()).should.be.bignumber.equal(ether('1'));
    });

    it('returns balance increments', async function () {
      const tracker = await balance.tracker(receiver);
      await send.ether(sender, receiver, ether('1'));
      (await tracker.delta()).should.be.bignumber.equal(ether('1'));
    });

    it('returns balance decrements', async function () {
      const tracker = await balance.tracker(sender);
      await send.ether(sender, receiver, ether('1'));
      (await tracker.delta()).should.be.bignumber.equal(ether('-1'));
    });

    it('returns consecutive deltas', async function () {
      const tracker = await balance.tracker(sender);
      await send.ether(sender, receiver, ether('1'));
      await tracker.delta();
      (await tracker.delta()).should.be.bignumber.equal('0');
    });
  });
});
