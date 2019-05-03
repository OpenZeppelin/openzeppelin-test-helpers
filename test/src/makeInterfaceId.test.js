require('../../src/setup');
const { expect } = require('chai');
const makeInterfaceId = require('../../src/makeInterfaceId');

const OwnableInterfaceId = artifacts.require('OwnableInterfaceId');

describe('makeInterfaceId', function () {
  describe('ERC165', function () {
    it('calculates the interface id from function signatures', async function () {
      const calculator = await OwnableInterfaceId.new();
      const ownableId = await calculator.getInterfaceId();

      expect(makeInterfaceId.ERC165([
        'owner()',
        'isOwner()',
        'renounceOwnership()',
        'transferOwnership(address)',
      ])).to.equal(ownableId);
    });
  });

  describe('ERC1820', function () {
    it('calculates the interface hash a from a contract name', async function () {
      expect(makeInterfaceId.ERC1820('ERC777Token')).to.equal(
        '0xac7fbab5f54a3ca8194167523c6753bfeb96a445279294b6125b68cce2177054'
      );
    });
  });
});
