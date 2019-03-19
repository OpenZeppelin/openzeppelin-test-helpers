const { expect } = require('chai');
const shouldFail = require('../../src/shouldFail');

const Failer = artifacts.require('Failer');

async function assertFailure (promise) {
  try {
    await promise;
  } catch (error) {
    return;
  }
  expect.fail();
}

describe('shouldFail', function () {
  beforeEach(async function () {
    this.failer = await Failer.new();
  });

  describe('shouldFail', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(shouldFail(this.failer.dontFail()));
    });

    it('accepts a revert', async function () {
      await shouldFail(this.failer.failWithRevert());
    });

    it('accepts a require() revert', async function () {
      await shouldFail(this.failer.failRequirement());
    });

    it('accepts a throw', async function () {
      await shouldFail(this.failer.failWithThrow());
    });

    it('accepts an out of gas', async function () {
      await shouldFail(this.failer.failWithOutOfGas({ gas: 2000000 }));
    });
  });

  describe('reverting', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(shouldFail.reverting(this.failer.dontFail()));
    });

    it('accepts a revert', async function () {
      await shouldFail.reverting(this.failer.failWithRevert());
    });

    it('accepts a require() revert', async function () {
      await shouldFail.reverting(this.failer.failRequirement());
    });

    it('rejects a throw', async function () {
      await assertFailure(shouldFail.reverting(this.failer.failWithThrow()));
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(shouldFail.reverting(this.failer.failWithOutOfGas({ gas: 2000000 })));
    });

    describe('reverting.withMessage', function () {
      it('rejects if no failure occurs', async function () {
        await assertFailure(shouldFail.reverting.withMessage(this.failer.dontFail()));
      });

      it('accepts a revert with an expected reason', async function () {
        await shouldFail.reverting.withMessage(this.failer.failWithRevertReason(), 'Doomed to fail');
      });

      it('rejects a revert with an unexpected reason', async function () {
        await assertFailure(shouldFail.reverting.withMessage(this.failer.failWithRevertReason(), 'Wrong reason'));
      });

      it('accepts require() revert with an expected reason', async function () {
        await shouldFail.reverting.withMessage(this.failer.failRequirementWithReason(), 'Unsatisfied');
      });

      it('rejects a require() revert with an unexpected reason', async function () {
        await assertFailure(shouldFail.reverting.withMessage(this.failer.failRequirementWithReason(), 'Wrong reason'));
      });
    });
  });

  describe('throwing', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(shouldFail.throwing(this.failer.dontFail()));
    });

    it('accepts a throw', async function () {
      await shouldFail.throwing(this.failer.failWithThrow());
    });

    it('rejects a throw', async function () {
      await assertFailure(shouldFail.throwing(this.failer.failWithRevert()));
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(shouldFail.throwing(this.failer.failWithOutOfGas({ gas: 2000000 })));
    });
  });

  describe('outOfGas', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(shouldFail.outOfGas(this.failer.dontFail()));
    });

    it('accepts an out of gas', async function () {
      await shouldFail.outOfGas(this.failer.failWithOutOfGas({ gas: 2000000 }));
    });

    it('rejects a revert', async function () {
      await assertFailure(shouldFail.outOfGas(this.failer.failWithRevert()));
    });

    it('rejects a throw', async function () {
      await assertFailure(shouldFail.outOfGas(this.failer.failWithThrow()));
    });
  });
});
