const { web3 } = require('./setup');

const { expect } = require('chai');
const colors = require('ansi-colors');
const semver = require('semver');

async function expectFailureWithMessage (promise, message) {
  try {
    await promise;
  } catch (error) {
    if (message) {
      expect(error.message).to.include(message, `Wrong failure type, expected '${message}'`);
    } else {
      expect.fail('Message not provided');
    }
    return;
  }

  expect.fail('Expected failure not received');
}

async function expectFailure (promise) {
  try {
    await promise;
  } catch (error) {
    return;
  }
  expect.fail('Failure not received');
}

async function withMessage (promise, message) {
  // Find out if current version of ganache-core supports revert reason i.e >= 2.2.0.
  // https://github.com/trufflesuite/ganache-core/releases/tag/v2.2.0
  const nodeInfo = await web3.eth.getNodeInfo();
  const matches = /TestRPC\/v([0-9.]+)\/ethereum-js/.exec(nodeInfo);
  const warn = function (msg) {
    console.log(`${colors.white.bgBlack('openzeppelin-test-helpers')} ${colors.black.bgYellow('WARN')} \
expectFailure.revert.withMessage: ` + msg);
  };
  if (matches === null || !(1 in matches)) {
    // warn users and skip reason check.
    warn('revert reason checking only supported on Ganache>=2.2.0');
    return expectFailure(promise);
  } else if (!semver.satisfies(matches[1], '>=2.2.0')) {
    // warn users and skip reason check.
    warn(`current version of Ganache (${matches[1]}) doesn't return revert reason.`);
    return expectFailure(promise);
  } else {
    // actually perform revert reason check.
    return expectFailureWithMessage(promise, message);
  }
}

expectFailure.revert = (promise) => expectFailureWithMessage(promise, 'revert');
expectFailure.revert.withMessage = withMessage;
expectFailure.throw = (promise) => expectFailureWithMessage(promise, 'invalid opcode');
expectFailure.outOfGas = (promise) => expectFailureWithMessage(promise, 'out of gas');

module.exports = expectFailure;
