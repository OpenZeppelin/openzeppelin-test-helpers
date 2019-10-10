const { expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const Tested = artifacts.require('Tested');

contract('Tested', function (accounts) {
  context('expectRevert', async function () {
    beforeEach(async function () {
      this.contract = await Tested.new();
    });

    context('with ganache-core < 2.2.0', async function () {
      it('throws when specifying a revert reason', async function () {
        // Asserting that locally installed ganache-core is v2.1.0.
        const nodeInfo = await web3.eth.getNodeInfo();
        expect(nodeInfo).to.include('2.1.0');

        try {
          await expectRevert(this.contract.failWithRevertReason(), 'lorem ipsum');
          expect.fail('expectRevert did not throw');
        } catch (e) {
          expect(e.message).to.include(`doesn't return revert reasons`);
        }
      });

      it('works when using expectRevert.unspecified', async function () {
        await expectRevert.unspecified(this.contract.failWithRevertReason());
      });
    });
  });
});
