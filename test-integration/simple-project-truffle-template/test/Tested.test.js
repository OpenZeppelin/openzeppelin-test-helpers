const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers');

const Tested = artifacts.require('Tested');

contract('Tested', function (accounts) {
  it('detects events during construction', async function () {
    await expectEvent.inConstruction(await Tested.new(3), 'Constructed', { value: new BN(3) });
  });

  context('with deployed instance', function () {
    beforeEach(async function () {
      this.contract = await Tested.new(0);
    })

    it('detect reverts', async function () {
      await expectRevert.unspecified(this.contract.reverts());
    });

    it('accepts calls with non-zero address', async function () {
      const { logs } = await this.contract.nonZeroAddress(accounts[0]);
      expectEvent.inLogs(logs, 'Address', { account: accounts[0] });
    });

    it('reverts with calls with non-zero address', async function () {
      await expectRevert.unspecified(this.contract.nonZeroAddress(constants.ZERO_ADDRESS));
    });
  });
});
