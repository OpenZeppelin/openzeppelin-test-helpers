const { BN } = require('../../src/setup');
const { expect } = require('chai');
const assertFailure = require('../helpers/assertFailure');
const send = require('../../src/send');
const expectEvent = require('../../src/expectEvent');
const ether = require('../../src/ether');

const Acknowledger = artifacts.require('Acknowledger');

contract('send', function ([sender, receiver]) {
  describe('ether', function () {
    it('sends ether with no gas cost', async function () {
      const value = ether('1');

      const initialSenderBalance = new BN(await web3.eth.getBalance(sender));
      const initialReceiverBalance = new BN(await web3.eth.getBalance(receiver));

      await send.ether(sender, receiver, value);

      const finalSenderBalance = new BN(await web3.eth.getBalance(sender));
      const finalReceiverBalance = new BN(await web3.eth.getBalance(receiver));

      expect(finalSenderBalance.sub(initialSenderBalance)).to.be.bignumber.equal(value.neg());
      expect(finalReceiverBalance.sub(initialReceiverBalance)).to.be.bignumber.equal(value);
    });

    it('throws if the sender balance is insufficient', async function () {
      const value = new BN(await web3.eth.getBalance(sender)).add(new BN(1));

      await assertFailure(send.ether(sender, receiver, value));
    });

    it('calls fallback function', async function () {
      this.acknowledger = await Acknowledger.new();
      const receipt = await send.ether(sender, this.acknowledger.address, 0);
      await expectEvent.inTransaction(
        receipt.transactionHash, Acknowledger, 'AcknowledgeFallback'
      );
    });
  });

  describe('transaction', function () {
    beforeEach(async function () {
      this.acknowledger = await Acknowledger.new();
    });

    context('with explicit from address', function () {
      testSendTransaction({ from: sender });
    });

    context('without explicit from address', function () {
      testSendTransaction();
    });

    function testSendTransaction (opts) {
      it('calls a function from its signature ', async function () {
        const receipt = await send.transaction(this.acknowledger, 'foo', 'uint256', [3], opts);
        await expectEvent.inTransaction(receipt.transactionHash, Acknowledger, 'AcknowledgeFoo', { a: '3' });
      });

      it('calls overloaded functions with less arguments', async function () {
        const receipt = await send.transaction(this.acknowledger, 'bar', 'uint256', [3], opts);
        await expectEvent.inTransaction(receipt.transactionHash, Acknowledger, 'AcknowledgeBarSingle', { a: '3' });
      });

      it('calls overloaded functions with more arguments', async function () {
        const receipt = await send.transaction(this.acknowledger, 'bar', 'uint256,uint256', [3, 5], opts);
        await expectEvent.inTransaction(
          receipt.transactionHash, Acknowledger, 'AcknowledgeBarDouble', { a: '3', b: '5' }
        );
      });

      it('throws if the number of arguments does not match', async function () {
        await assertFailure(send.transaction(this.acknowledger, 'foo', 'uint256, uint256', [3, 5], opts));
      });

      it('throws if the method does not exist', async function () {
        await assertFailure(send.transaction(this.acknowledger, 'baz', 'uint256', [3], opts));
      });

      it('throws if there is a mismatch in the number of types and values', async function () {
        await assertFailure(send.transaction(this.acknowledger, 'foo', 'uint256', [3, 3], opts));
      });
    }
  });
});
