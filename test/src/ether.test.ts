const { BN } = require('../../src/setup');
const { expect } = require('chai');
const ether = require('../../src/ether');

describe('ether', function () {
  it('returns a BN', function () {
    expect(ether('1')).to.be.bignumber.equal(new BN('1000000000000000000'));
  });

  it('works with negative amounts', function () {
    expect(ether('-1')).to.be.bignumber.equal(new BN('-1000000000000000000'));
  });
});
