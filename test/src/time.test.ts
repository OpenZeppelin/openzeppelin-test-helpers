const { BN } = require('../../src/setup');
const { expect } = require('chai');
const assertFailure = require('../helpers/assertFailure');
const time = require('../../src/time');

describe('time', function () {
  const TOLERANCE_SECONDS = new BN(1);

  describe('duration', function () {
    it('converts seconds to seconds', function () {
      expect(time.duration.seconds(1)).to.be.bignumber.equal(new BN(1));
    });

    it('converts minutes to seconds', function () {
      expect(time.duration.minutes(1)).to.be.bignumber.equal(new BN(60));
    });

    it('converts hours to seconds', function () {
      expect(time.duration.hours(1)).to.be.bignumber.equal(new BN(60 * 60));
    });

    it('converts days to seconds', function () {
      expect(time.duration.days(1)).to.be.bignumber.equal(new BN(60 * 60 * 24));
    });

    it('converts weeks to seconds', function () {
      expect(time.duration.weeks(1)).to.be.bignumber.equal(new BN(60 * 60 * 24 * 7));
    });

    it('converts years to seconds', function () {
      expect(time.duration.years(1)).to.be.bignumber.equal(new BN(60 * 60 * 24 * 365));
    });
  });

  describe('latestBlock', function () {
    it('returns a BN with the current block number', async function () {
      expect(await time.latestBlock()).to.be.bignumber.equal(new BN(await web3.eth.getBlockNumber()));
    });
  });

  describe('advanceBlock', function () {
    it('increases the block number by one', async function () {
      const startingBlock = await time.latestBlock();
      await time.advanceBlock();
      expect(await time.latestBlock()).to.be.bignumber.equal(startingBlock.add(new BN(1)));
    });
  });

  describe('advanceBlockTo', function () {
    it('increases the block number to target', async function () {
      const startingBlock = await time.latestBlock();
      const endBlock = startingBlock.addn(10);
      await time.advanceBlockTo(endBlock);
      expect(await time.latestBlock()).to.be.bignumber.equal(endBlock);
    });
  });

  describe('latest', function () {
    it('returns a BN', async function () {
      expect(await time.latest()).to.be.bignumber.equal(await time.latest()); // Hacky, but this triggers BN type check
    });
  });

  context('with starting time', function () {
    beforeEach(async function () {
      await time.advanceBlock();
      this.start = await time.latest();
    });

    describe('increase', function () {
      it('increases time by a duration', async function () {
        await time.increase(time.duration.hours(1));

        const end = this.start.add(time.duration.hours(1));

        const now = await time.latest();
        expect(now).to.be.bignumber.closeTo(end, TOLERANCE_SECONDS);
      });

      it('throws with negative durations', async function () {
        await assertFailure(time.increase(-1));
      });
    });

    describe('increaseTo', function () {
      it('increases time to a time in the future', async function () {
        const end = this.start.add(time.duration.hours(1));
        await time.increaseTo(end);

        const now = await time.latest();
        expect(now).to.be.bignumber.closeTo(end, TOLERANCE_SECONDS);
      });

      it('throws with a time in the past', async function () {
        await assertFailure(time.increaseTo(this.start.sub(new BN(30))));
      });
    });
  });
});
