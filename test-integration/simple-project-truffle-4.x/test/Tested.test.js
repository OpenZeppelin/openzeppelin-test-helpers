const Tested = artifacts.require('Tested');

const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const { expectEvent } = require('openzeppelin-test-helpers');

contract('Tested', function (accounts) {
  it('can be deployed', async function () {
    await expectEvent.inConstruction(await Tested.new(), 'Constructed');
  });
});
