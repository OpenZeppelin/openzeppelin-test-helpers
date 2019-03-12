require('../../src/setup');
const singletons = require('../../src/singletons');
const shouldFail = require('../../src/shouldFail');
const { ERC1820_REGISTRY_BYTECODE } = require('../../src/data');

contract('singletons', function ([funder]) {
  describe('ERC1820Registry', function () {
    before(async function () {
      this.registry = await singletons.ERC1820Registry(funder);
    });

    it('returns the canonical registry address', async function () {
      this.registry.should.equal('0x1820b744B33945482C17Dc37218C01D858EBc714');
    });

    it('stores the correct code at the registry address', async function () {
      (await web3.eth.getCode(this.registry)).should.equal(ERC1820_REGISTRY_BYTECODE);
    });

    it('fails to deploy a second registry', async function () {
      await shouldFail(singletons.ERC1820Registry(funder));
    });
  });
});
