const { expect } = require('chai');

async function assertFailure (promise) {
  try {
    await promise;
  } catch (error) {
    return;
  }
  expect.fail();
}

module.exports = assertFailure;
