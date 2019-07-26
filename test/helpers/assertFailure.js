const { expect } = require('chai');
const AssertionError = require('assert').AssertionError;

async function assertFailure (promise) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  expect.fail();
}

module.exports = assertFailure;
