require('../../src/setup');
const { expect } = require('chai');

const { ZERO_ADDRESS, ZERO_BYTES32 } = require('../../src/constants');

const Constants = artifacts.require('Constants');

contract('consants', function () {
  beforeEach(async function () {
    this.constants = await Constants.new();
  });

  describe('ZERO_ADDRESS', function () {
    it('contracts interpret it as the zero address', async function () {
      expect(await this.constants.isZeroAddress(ZERO_ADDRESS)).to.equal(true);
    });

    it('contracts return it as the zero address', async function () {
      expect(await this.constants.returnZeroAddress()).to.equal(ZERO_ADDRESS);
    });
  });

  describe('ZERO_BYTES32', function () {
    it('contracts interpret it as zero bytes32', async function () {
      expect(await this.constants.isZeroBytes32(ZERO_BYTES32)).to.equal(true);
    });

    it('contracts interpret it as an array of 32 bytes', async function () {
      expect(await this.constants.isBytesLength32(ZERO_BYTES32)).to.equal(true);
    });

    it('contracts return it as zero bytes32', async function () {
      expect(await this.constants.returnZeroBytes32()).to.equal(ZERO_BYTES32);
    });
  });
});
