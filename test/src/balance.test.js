require('../../src/setup');
const { expect } = require('chai');

const { fromWei } = require('web3-utils');

const balance = require('../../src/balance');
const send = require('../../src/send');
const ether = require('../../src/ether');

contract('balance', function ([sender, receiver]) {
  describe('current', function () {
    it('returns the current balance of an account as a BN in wei', async function () {
      expect(await balance.current(sender)).to.be.bignumber.equal(await web3.eth.getBalance(sender));
    });

    it('returns the current balance of an account as a BN in a specified unit', async function () {
      expect(await balance.current(sender, 'ether')).to.be.bignumber.equal(
        fromWei(await web3.eth.getBalance(sender), 'ether')
      );
    });
  });

  describe('balance tracker', function () {
    describe('default units (wei)', function () {
      it('returns current balance ', async function () {
        const tracker = await balance.tracker(receiver);
        expect(await tracker.get()).to.be.bignumber.equal(await web3.eth.getBalance(receiver));
      });

      it('get() adds a new checkpoint ', async function () {
        const tracker = await balance.tracker(sender);
        await send.ether(sender, receiver, ether('1'));
        await tracker.get();
        expect(await tracker.delta()).to.be.bignumber.equal('0');
      });

      it('returns correct deltas after get() checkpoint', async function () {
        const tracker = await balance.tracker(receiver);
        await send.ether(sender, receiver, ether('1'));
        await tracker.get();
        await send.ether(sender, receiver, ether('1'));
        expect(await tracker.delta()).to.be.bignumber.equal(ether('1'));
      });

      it('returns balance increments', async function () {
        const tracker = await balance.tracker(receiver);
        await send.ether(sender, receiver, ether('1'));
        expect(await tracker.delta()).to.be.bignumber.equal(ether('1'));
      });

      it('returns balance decrements', async function () {
        const tracker = await balance.tracker(sender);
        await send.ether(sender, receiver, ether('1'));
        expect(await tracker.delta()).to.be.bignumber.equal(ether('-1'));
      });

      it('returns consecutive deltas', async function () {
        const tracker = await balance.tracker(sender);
        await send.ether(sender, receiver, ether('1'));
        await tracker.delta();
        expect(await tracker.delta()).to.be.bignumber.equal('0');
      });
    });

    describe('user-provided units', function () {
      const units = 'gwei';

      beforeEach(async function () {
        this.tracker = await balance.tracker(sender, units);
      });

      it('returns current balance in tracker-specified units', async function () {
        expect(await this.tracker.get()).to.be.bignumber.equal(fromWei(await web3.eth.getBalance(sender), units));
      });

      it('returns deltas in tracker-specified units', async function () {
        await send.ether(sender, receiver, ether('1'));
        expect(await this.tracker.delta()).to.be.bignumber.equal(fromWei(ether('-1'), units));
      });

      describe('overrides', function () {
        const override = 'nanoether';

        it('returns current balance in overridden units', async function () {
          expect(await this.tracker.get(override)).to.be.bignumber.equal(
            fromWei(await web3.eth.getBalance(sender), override)
          );
        });

        it('returns deltas in overridden units', async function () {
          await send.ether(sender, receiver, ether('1'));
          expect(await this.tracker.delta(override)).to.be.bignumber.equal(fromWei(ether('-1'), override));
        });
      });
    });
  });
});
