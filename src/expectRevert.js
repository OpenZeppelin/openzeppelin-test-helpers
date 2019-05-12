const { web3 } = require('./setup');

const { expect } = require('chai');
const colors = require('ansi-colors');
const semver = require('semver');

async function expectException (promise, expectedErrors) {
  try {
    await promise;
  } catch (error) {
    for (const expectedError of expectedErrors) {
      expect(error.message).to.include(expectedError, `Wrong failure type, expected '${expectedError}'`);
    }
    return;
  }

  throw Error('Expected failure not received');
}

const expectRevert = async function (promise, expectedError) {
  if (!expectedError) {
    try { await promise; } catch (error) { }
    throw Error('No revert reason specified: call expectRevert with the reason string, or use expectRevert.unspecified\
      if your \'require\' statement doesn\'t have one.');
  }

  // Find out if current version of ganache-core supports revert reason i.e >= 2.2.0.
  // https://github.com/trufflesuite/ganache-core/releases/tag/v2.2.0
  const nodeInfo = await web3.eth.getNodeInfo();
  const matches = /TestRPC\/v([0-9.]+)\/ethereum-js/.exec(nodeInfo);

  const warn = function (msg) {
    console.log(`${colors.white.bgBlack('openzeppelin-test-helpers')} ${colors.black.bgYellow('WARN')} \
      expectRevert: ` + msg);
  };

  let expectedErrors;

  if (matches === null || !(1 in matches)) {
    // warn users and skip reason check.
    warn('revert reason checking only supported on Ganache v2.2.0 or newer.');
    expectedErrors = ['revert'];
  } else if (!semver.satisfies(matches[1], '>=2.2.0')) {
    // warn users and skip reason check.
    warn(`current version of Ganache (v${matches[1]}) doesn't return revert reason. Use v2.2.0 or newer.`);
    expectedErrors = ['revert'];
  } else {
    // actually perform revert reason check.
    expectedErrors = ['revert', expectedError];
  }

  await expectException(promise, expectedErrors);
};

expectRevert.assertion = (promise) => expectException(promise, ['invalid opcode']);
expectRevert.outOfGas = (promise) => expectException(promise, ['out of gas']);
expectRevert.unspecified = (promise) => expectException(promise, ['revert']);

module.exports = expectRevert;
