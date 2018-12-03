const { balanceDifference } = require('../src/balanceDifference');
const send = require('../src/send');
const { ether } = require('../src/ether');

const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('balanceDifference', function ([sender, receiver]) {
  it('returns balance increments', async function () {
    (await balanceDifference(receiver, () =>
      send.ether(sender, receiver, ether(1)))
    ).should.be.bignumber.equal(ether(1));
  });

  it('returns balance decrements', async function () {
    (await balanceDifference(sender, () =>
      send.ether(sender, receiver, ether(1)))
    ).should.be.bignumber.equal(ether(-1));
  });
});
