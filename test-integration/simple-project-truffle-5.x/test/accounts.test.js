const { balance, BN, ether, send } = require('openzeppelin-test-helpers');

contract('accounts', function (accounts) {
  it('sends ether and tracks balances', async function () {
    const value = ether('42', 'ether');

    (await balance.difference(accounts[0], () =>
      send.ether(accounts[0], accounts[1], value)
    )).should.be.bignumber.equals(value.neg());
  });
});
