const { expect } = require('chai');
const singletons = require('../../src/singletons');
const { ERC1820_REGISTRY_BYTECODE } = require('../../src/data');

contract('singletons', function ([funder]) {
  describe('ERC1820Registry', function () {
    before(async function () {
      this.registry = await singletons.ERC1820Registry(funder);
    });

    it('returns a web3 contract instance', function () {
      expect(this.registry.constructor.name).to.equal('Contract');
    });

    it('the registry is stored at the correct address', function () {
      expect(this.registry.options.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
    });

    it('stores the correct code at the registry address', async function () {
      expect((await web3.eth.getCode(this.registry.options.address))).to.equal(ERC1820_REGISTRY_BYTECODE);
    });

    it('returns the same truffle-contract when attempting to deploy a second registry', async function () {
      const newRegistry = await singletons.ERC1820Registry(funder);
      expect(newRegistry.options.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
    });
  });
});
