const { BN } = require('../../src/setup');
const { expect } = require('chai');

const snapshot = require('../../src/snapshot');
const time = require('../../src/time');
const balance = require('../../src/balance');
const send = require('../../src/send');
const ether = require('../../src/ether');

describe('snapshot', function () {
  const TOLERANCE_SECONDS = new BN(1);

  beforeEach(async function () {
    await time.advanceBlock();
    this.start = await time.latest();
  });

  it('returns a snapshot object with restore method reverting time', async function () {
    const oldNow = await time.latest();
    const snapshotA = await snapshot();

    const future = this.start.add(time.duration.hours(1));
    await time.increaseTo(future);
    await snapshotA.restore();

    const now = await time.latest();
    expect(now).to.be.bignumber.closeTo(oldNow, TOLERANCE_SECONDS);
  });

  contract('reverting transactions', function ([sender, receiver]) {
    it('restores previous balances on revert', async function () {
      const snapshotA = await snapshot();
      const tracker = await balance.tracker(receiver);
      await send.ether(sender, receiver, ether('1'));
      expect(await tracker.delta()).to.be.bignumber.equal(ether('1'));
      await snapshotA.restore();
      expect(await tracker.delta()).to.be.bignumber.equal(ether('-1'));
    });

    it('can revert twice', async function () {
      const snapshotA = await snapshot();
      const tracker = await balance.tracker(receiver);
      await send.ether(sender, receiver, ether('1'));
      expect(await tracker.delta()).to.be.bignumber.equal(ether('1'));
      await snapshotA.restore();
      expect(await tracker.delta()).to.be.bignumber.equal(ether('-1'));
      await send.ether(sender, receiver, ether('1'));
      expect(await tracker.delta()).to.be.bignumber.equal(ether('1'));
      await snapshotA.restore();
      expect(await tracker.delta()).to.be.bignumber.equal(ether('-1'));
    });
  });
});
