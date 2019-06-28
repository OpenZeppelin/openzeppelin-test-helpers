const { expect } = require('chai');
const AssertionError = require('assert').AssertionError;

async function assertFailure (promise) {
  try {
    await promise;
  } catch (error) {
    if (error instanceof AssertionError) {
      expect(error.message).to.equal('Wrong failure type');
    }
    return;
  }
  expect.fail();
}

module.exports = assertFailure;
