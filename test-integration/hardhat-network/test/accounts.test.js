const { balance, BN, ether, send } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('accounts', function (accounts) {
  it('sends ether and tracks balances', async function () {
    const value = ether('42', 'ether');
    const tracker = await balance.tracker(accounts[0]);
    await send.ether(accounts[0], accounts[1], value);
    expect(await tracker.delta()).to.be.bignumber.equals(value.neg());
  });
});
