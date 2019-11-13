const { expect } = require('chai');
const singletons = require('../../src/singletons');
const { ERC1820_REGISTRY_BYTECODE } = require('../../src/data');

contract('singletons', function ([funder]) {
  describe('ERC1820Registry', function () {
    context('with truffle environment', function () {
      beforeEach(async function () {
        require('../../configure')({ environment: 'truffle' });
        this.registry = await singletons.ERC1820Registry(funder);
      });

      it('returns a truffle contract instance', function () {
        expect(this.registry.constructor.name).to.equal('TruffleContract');
      });

      it('the registry is stored at the correct address', function () {
        expect(this.registry.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
      });

      it('stores the correct code at the registry address', async function () {
        expect((await web3.eth.getCode(this.registry.address))).to.equal(ERC1820_REGISTRY_BYTECODE);
      });

      it('returns the same contract when attempting to deploy a second registry', async function () {
        const newRegistry = await singletons.ERC1820Registry(funder);
        expect(newRegistry.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
      });
    });

    context('with web3 environment', function () {
      beforeEach(async function () {
        require('../../configure')({ environment: 'web3' });
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

      it('returns the same contract when attempting to deploy a second registry', async function () {
        const newRegistry = await singletons.ERC1820Registry(funder);
        expect(newRegistry.options.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
      });
    });
  });

  after(function () {
    // Restore default configuration
    require('../../configure')();
  });
});
