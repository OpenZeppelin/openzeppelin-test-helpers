require('../../src/setup');
const deploy = require('../../src/deploy');
const shouldFail = require('../../src/shouldFail');
const { ERC1820_REGISTRY_BYTECODE } = require('../../src/data');

contract('deploy', function ([deployer]) {
  describe('ERC1820Registry', function () {
    before(async function () {
      this.registry = await deploy.ERC1820Registry(deployer);
    });

    it('returns the canonical registry address', async function () {
      this.registry.should.equal('0x1820b744B33945482C17Dc37218C01D858EBc714');
    });

    it('stores the correct code at the registry address', async function () {
      (await web3.eth.getCode(this.registry)).should.equal(ERC1820_REGISTRY_BYTECODE);
    });

    it('fails to deploy a second registry', async function () {
      await shouldFail(deploy.ERC1820Registry(deployer));
    });
  });
});
