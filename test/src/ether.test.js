const { BN } = require('../../src/setup');
const ether = require('../../src/ether');

describe('ether', function () {
  it('returns a BN', function () {
    ether('1', 'ether').should.be.bignumber.equal(new BN('1000000000000000000'));
  });

  it('works with negative amounts', function () {
    ether('-1', 'ether').should.be.bignumber.equal(new BN('-1000000000000000000'));
  });
});
