require('../../src/setup');
const singletons = require('../../src/singletons');
const { ERC1820_REGISTRY_BYTECODE } = require('../../src/data');

contract('singletons', function ([funder]) {
  describe('ERC1820Registry', function () {
    before(async function () {
      this.registry = await singletons.ERC1820Registry(funder);
    });

    it('returns a truffle-contract instance', function () {
      this.registry.constructor.name.should.equal('TruffleContract');
    });

    it('the registry is stored at the correct address', function () {
      this.registry.address.should.equal('0x1820b744B33945482C17Dc37218C01D858EBc714');
    });

    it('stores the correct code at the registry address', async function () {
      (await web3.eth.getCode(this.registry.address)).should.equal(ERC1820_REGISTRY_BYTECODE);
    });

    it('returns the same truffle-contract when attempting to deploy a second registry', async function () {
      const newRegistry = await singletons.ERC1820Registry(funder);
      newRegistry.address.should.equal('0x1820b744B33945482C17Dc37218C01D858EBc714');
    });
  });
});
