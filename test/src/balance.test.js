require('../../src/setup');

const balance = require('../../src/balance');
const send = require('../../src/send');
const ether = require('../../src/ether');

contract('balance', function ([sender, receiver]) {
  describe('difference', function () {
    it('returns balance increments', async function () {
      (await balance.difference(receiver, () =>
        send.ether(sender, receiver, ether('1')))
      ).should.be.bignumber.equal(ether('1'));
    });

    it('returns balance decrements', async function () {
      (await balance.difference(sender, () =>
        send.ether(sender, receiver, ether('1')))
      ).should.be.bignumber.equal(ether('-1'));
    });
  });
});
