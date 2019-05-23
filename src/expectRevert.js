const { web3 } = require('./setup');

const colors = require('ansi-colors');
const semver = require('semver');

async function expectException (promise, expectedError) {
  try {
    await promise;
  } catch (error) {
    if (error.message.indexOf(expectedError) === -1) {
      throw Error(`Wrong failure type, expected '${expectedError}' and got '${error.message}'`);
    }
    return;
  }

  throw Error('Expected failure not received');
}

const expectRevert = async function (promise, expectedError) {
  if (!expectedError) {
    promise.catch(() => { });
    throw Error('No revert reason specified: call expectRevert with the reason string, or use expectRevert.unspecified \
if your \'require\' statement doesn\'t have one.');
  }

  // Find out if current version of ganache-core supports revert reason i.e >= 2.2.0.
  // https://github.com/trufflesuite/ganache-core/releases/tag/v2.2.0
  const nodeInfo = await web3.eth.getNodeInfo();
  const matches = /TestRPC\/v([\w.-]+)\/ethereum-js/.exec(nodeInfo);

  const warn = function (msg) {
    console.log(`${colors.white.bgBlack('openzeppelin-test-helpers')} ${colors.black.bgYellow('WARN')} \
      expectRevert: ` + msg);
  };

  if (matches === null || !(1 in matches)) {
    // warn users and skip reason check.
    warn('revert reason checking only supported on Ganache v2.2.0 or newer.');
    expectedError = 'revert';
  } else if (!semver.gte(matches[1], '2.2.0')) {
    // warn users and skip reason check.
    warn(`current version of Ganache (v${matches[1]}) doesn't return revert reason. Use v2.2.0 or newer.`);
    expectedError = 'revert';
  }

  await expectException(promise, expectedError);
};

expectRevert.assertion = (promise) => expectException(promise, 'invalid opcode');
expectRevert.outOfGas = (promise) => expectException(promise, 'out of gas');
expectRevert.unspecified = (promise) => expectException(promise, 'revert');

module.exports = expectRevert;
