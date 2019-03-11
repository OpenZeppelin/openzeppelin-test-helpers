const { balance, BN, ether, send } = require('openzeppelin-test-helpers');

contract('accounts', function (accounts) {
  it('sends ether and tracks balances', async function () {
    const value = ether('42', 'ether');
    const tracker = await balance.tracker(accounts[0]);
    await send.ether(accounts[0], accounts[1], value);
    (await tracker.delta()).should.be.bignumber.equals(value.neg());
  });
});
