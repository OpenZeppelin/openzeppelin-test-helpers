const { BN, constants, expectEvent, expectRevert, singletons } = require('@openzeppelin/test-helpers');

const Tested = artifacts.require('Tested');

contract('Tested', function ([sender]) {
  it('detects events during construction', async function () {
    await expectEvent.inConstruction(await Tested.new(3), 'Constructed', { value: new BN(3) });
  });

  it('singletons return truffle contract intstances', async function () {
    const registry = await singletons.ERC1820Registry(sender);
    expect(registry.constructor.name).to.equal('TruffleContract');
  })

  context('with deployed instance', function () {
    beforeEach(async function () {
      this.contract = await Tested.new(0);
    })

    it('detect reverts', async function () {
      await expectRevert.unspecified(this.contract.reverts());
    });

    it('accepts calls with non-zero address', async function () {
      const { logs } = await this.contract.nonZeroAddress(sender);
      expectEvent.inLogs(logs, 'Address', { account: sender });
    });

    it('reverts with calls with non-zero address', async function () {
      await expectRevert.unspecified(this.contract.nonZeroAddress(constants.ZERO_ADDRESS));
    });
  });
});
