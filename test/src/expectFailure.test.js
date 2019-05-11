const { expect } = require('chai');
const expectFailure = require('../../src/expectFailure');

const Failer = artifacts.require('Failer');

async function assertFailure (promise) {
  try {
    await promise;
  } catch (error) {
    return;
  }
  expect.fail();
}

describe('expectFailure', function () {
  beforeEach(async function () {
    this.failer = await Failer.new();
  });

  describe('expectFailure', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(expectFailure(this.failer.dontFail()));
    });

    it('accepts a revert', async function () {
      await expectFailure(this.failer.failWithRevert());
    });

    it('accepts a require() revert', async function () {
      await expectFailure(this.failer.failRequirement());
    });

    it('accepts a throw', async function () {
      await expectFailure(this.failer.failWithThrow());
    });

    it('accepts an out of gas', async function () {
      await expectFailure(this.failer.failWithOutOfGas({ gas: 2000000 }));
    });
  });

  describe('revert', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(expectFailure.revert(this.failer.dontFail()));
    });

    it('accepts a revert', async function () {
      await expectFailure.revert(this.failer.failWithRevert());
    });

    it('accepts a require() revert', async function () {
      await expectFailure.revert(this.failer.failRequirement());
    });

    it('rejects a throw', async function () {
      await assertFailure(expectFailure.revert(this.failer.failWithThrow()));
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(expectFailure.revert(this.failer.failWithOutOfGas({ gas: 2000000 })));
    });

    describe('revert.withMessage', function () {
      it('rejects if no failure occurs', async function () {
        await assertFailure(expectFailure.revert.withMessage(this.failer.dontFail()));
      });

      it('accepts a revert with an expected reason', async function () {
        await expectFailure.revert.withMessage(this.failer.failWithRevertReason(), 'Doomed to fail');
      });

      it('rejects a revert with an unexpected reason', async function () {
        await assertFailure(expectFailure.revert.withMessage(this.failer.failWithRevertReason(), 'Wrong reason'));
      });

      it('rejects if no reason string passed', async function () {
        await assertFailure(expectFailure.revert.withMessage(this.failer.failWithRevertReason()));
      });

      it('accepts require() revert with an expected reason', async function () {
        await expectFailure.revert.withMessage(this.failer.failRequirementWithReason(), 'Unsatisfied');
      });

      it('rejects a require() revert with an unexpected reason', async function () {
        await assertFailure(expectFailure.revert.withMessage(this.failer.failRequirementWithReason(), 'Wrong reason'));
      });
    });
  });

  describe('throw', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(expectFailure.throw(this.failer.dontFail()));
    });

    it('accepts a throw', async function () {
      await expectFailure.throw(this.failer.failWithThrow());
    });

    it('rejects a throw', async function () {
      await assertFailure(expectFailure.throw(this.failer.failWithRevert()));
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(expectFailure.throw(this.failer.failWithOutOfGas({ gas: 2000000 })));
    });
  });

  describe('outOfGas', function () {
    it('rejects if no failure occurs', async function () {
      await assertFailure(expectFailure.outOfGas(this.failer.dontFail()));
    });

    it('accepts an out of gas', async function () {
      await expectFailure.outOfGas(this.failer.failWithOutOfGas({ gas: 2000000 }));
    });

    it('rejects a revert', async function () {
      await assertFailure(expectFailure.outOfGas(this.failer.failWithRevert()));
    });

    it('rejects a throw', async function () {
      await assertFailure(expectFailure.outOfGas(this.failer.failWithThrow()));
    });
  });
});
