const { BN } = require('../../src/setup');
const send = require('../../src/send');
const shouldFail = require('../../src/shouldFail');
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

      finalSenderBalance.sub(initialSenderBalance).should.be.bignumber.equal(value.neg());
      finalReceiverBalance.sub(initialReceiverBalance).should.be.bignumber.equal(value);
    });

    it('throws if the sender balance is insufficient', async function () {
      const value = new BN(await web3.eth.getBalance(sender)).add(new BN(1));

      await shouldFail(send.ether(sender, receiver, value));
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
        await shouldFail(send.transaction(this.acknowledger, 'foo', 'uint256, uint256', [3, 5]), opts);
      });

      it('throws if the method does not exist', async function () {
        await shouldFail(send.transaction(this.acknowledger, 'baz', 'uint256', [3]), opts);
      });

      it('throws if there is a mismatch in the number of types and values', async function () {
        await shouldFail(send.transaction(this.acknowledger, 'foo', 'uint256', [3, 3]), opts);
      });
    }
  });
});
