const { expect } = require('chai');

const assertFailure = require('../helpers/assertFailure');
const expectRevert = require('../../src/expectRevert');

const Reverter = artifacts.require('Reverter');

describe('expectRevert', function () {
  beforeEach(async function () {
    this.reverter = await Reverter.new();
  });

  describe('expectRevert', function () {
    it('rejects if no revert occurs', async function () {
      const assertion =
        await assertFailure(expectRevert(this.reverter.dontRevert(), 'reason'));

      expect(assertion.message).to.equal('Expected an exception but none was received');
    });

    it('rejects a revert', async function () {
      await assertFailure(expectRevert(this.reverter.revertFromRevert()));
    });

    it('rejects a revert with reason and none expected', async function () {
      await assertFailure(expectRevert(this.reverter.revertFromRevertWithReason()));
    });

    it('rejects a revert with incorrect expected reason', async function () {
      const assertion =
        await assertFailure(expectRevert(this.reverter.revertFromRevertWithReason(), 'Wrong reason'));

      expect(assertion.message).to.include('Wrong kind of exception received');
      expect(assertion.actual).to.equal('Call to revert');
      expect(assertion.expected).to.equal('Wrong reason');
    });

    it('accepts a revert with correct expected reason', async function () {
      await expectRevert(this.reverter.revertFromRevertWithReason(), 'Call to revert');
    });

    it('rejects a failed requirement', async function () {
      await assertFailure(expectRevert(this.reverter.revertFromRequire()));
    });

    it('rejects a failed requirement with reason and none expected', async function () {
      await assertFailure(expectRevert(this.reverter.revertFromRequireWithReason()));
    });

    it('rejects a failed requirement with incorrect expected reason', async function () {
      await assertFailure(expectRevert(this.reverter.revertFromRequireWithReason(), 'Wrong reason'));
    });

    it('accepts a failed requirement with correct expected reason', async function () {
      await expectRevert(this.reverter.revertFromRequireWithReason(), 'Failed requirement');
    });

    it('rejects a failed assertion', async function () {
      await assertFailure(expectRevert(this.reverter.revertFromAssert()));
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(expectRevert(this.reverter.revertFromOutOfGas({ gas: 2000000 })));
    });
  });

  describe('unspecified', function () {
    it('rejects if no revert occurs', async function () {
      await assertFailure(expectRevert.unspecified(this.reverter.dontRevert()));
    });

    it('accepts a revert', async function () {
      await expectRevert.unspecified(this.reverter.revertFromRevert());
    });

    it('accepts a revert with reason', async function () {
      await expectRevert.unspecified(this.reverter.revertFromRevertWithReason());
    });

    it('accepts a failed requirement', async function () {
      await expectRevert.unspecified(this.reverter.revertFromRequire());
    });

    it('accepts a failed requirement with reason', async function () {
      await expectRevert.unspecified(this.reverter.revertFromRequireWithReason());
    });

    it('rejects a failed assertion', async function () {
      await assertFailure(expectRevert.unspecified(this.reverter.revertFromAssert()));
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(expectRevert.unspecified(this.reverter.revertFromOutOfGas({ gas: 2000000 })));
    });
  });

  describe('assertion', function () {
    it('rejects if no revert occurs', async function () {
      await assertFailure(expectRevert.assertion(this.reverter.dontRevert()));
    });

    it('rejects a revert', async function () {
      await assertFailure(expectRevert.assertion(this.reverter.revertFromRevert()));
    });

    it('rejects a revert with reason', async function () {
      await assertFailure(expectRevert.assertion(this.reverter.revertFromRevertWithReason()));
    });

    it('rejects a failed requirement', async function () {
      await assertFailure(expectRevert.assertion(this.reverter.revertFromRequire()));
    });

    it('rejects a failed requirement with reason', async function () {
      await assertFailure(expectRevert.assertion(this.reverter.revertFromRequireWithReason()));
    });

    it('accepts a failed assertion', async function () {
      await expectRevert.assertion(this.reverter.revertFromAssert());
    });

    it('rejects an outOfGas', async function () {
      await assertFailure(expectRevert.assertion(this.reverter.revertFromOutOfGas({ gas: 2000000 })));
    });
  });

  describe('outOfGas', function () {
    it('rejects if no revert occurs', async function () {
      await assertFailure(expectRevert.outOfGas(this.reverter.dontRevert()));
    });

    it('rejects a revert', async function () {
      await assertFailure(expectRevert.outOfGas(this.reverter.revertFromRevert()));
    });

    it('rejects a revert with reason', async function () {
      await assertFailure(expectRevert.outOfGas(this.reverter.revertFromRevertWithReason()));
    });

    it('rejects a failed requirement', async function () {
      await assertFailure(expectRevert.outOfGas(this.reverter.revertFromRequire()));
    });

    it('rejects a failed requirement with reason', async function () {
      await assertFailure(expectRevert.outOfGas(this.reverter.revertFromRequireWithReason()));
    });

    it('accepts a failed assertion', async function () {
      await assertFailure(expectRevert.outOfGas(this.reverter.revertFromAssert()));
    });

    it('accepts an outOfGas', async function () {
      await expectRevert.outOfGas(this.reverter.revertFromOutOfGas({ gas: 2000000 }));
    });
  });
});
