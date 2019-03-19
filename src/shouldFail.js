const { expect } = require('chai');
const colors = require('ansi-colors');
const semver = require('semver');

async function shouldFailWithMessage (promise, message) {
  try {
    await promise;
  } catch (error) {
    if (message) {
      expect(error.message).to.include(message, `Wrong failure type, expected '${message}'`);
    }
    return;
  }

  expect.fail('Expected failure not received');
}

async function reverting (promise) {
  await shouldFailWithMessage(promise, 'revert');
}

async function throwing (promise) {
  await shouldFailWithMessage(promise, 'invalid opcode');
}

async function outOfGas (promise) {
  await shouldFailWithMessage(promise, 'out of gas');
}

async function shouldFail (promise) {
  await shouldFailWithMessage(promise);
}

async function withMessage (promise, message) {
  // Find out if current version of ganache-core supports revert reason i.e >= 2.2.0.
  // https://github.com/trufflesuite/ganache-core/releases/tag/v2.2.0
  const nodeInfo = await web3.eth.getNodeInfo();
  const matches = /TestRPC\/v([0-9.]+)\/ethereum-js/.exec(nodeInfo);
  if (1 in matches && semver.satisfies(matches[1], '>=2.2.0')) {
    return shouldFailWithMessage(promise, message);
  } else {
    // Otherwise, warn users and skip reason check.
    console.log(`${colors.white.bgBlack('openzeppelin-test-helpers')} ${colors.black.bgYellow('WARN')} \
shouldFail.reverting.withMessage: current version of Ganache (${matches[1]}) doesn't return revert reason.`);
    return shouldFailWithMessage(promise);
  }
}

shouldFail.reverting = reverting;
shouldFail.reverting.withMessage = withMessage;
shouldFail.throwing = throwing;
shouldFail.outOfGas = outOfGas;

module.exports = shouldFail;
