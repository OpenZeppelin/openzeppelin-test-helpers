const { expect } = require('chai');

async function assertFailure (promise) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  expect.fail();
}

module.exports = assertFailure;
