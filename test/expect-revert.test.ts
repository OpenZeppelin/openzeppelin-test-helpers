import assert from 'assert';

import { env, factory, gasLimit } from './utils';
import { expectRevert } from '../src/expect-revert';

const Revert = factory('Revert');

describe('expectRevert', function () {
  const reason = 'a wild reason';

  beforeEach(async function () {
    this.r = await Revert.deploy();
  });

  it('accepts all reverts', async function () {
    await expectRevert(this.r.revertWithoutReason());
    await expectRevert(this.r.revertWithStringReason(reason));
    await expectRevert(this.r.revertWithCustomError());
    await expectRevert(this.r.outOfGas({ [gasLimit]: 25000 }));
  });

  it('accepts revert with expected reason', async function () {
    await expectRevert(this.r.revertWithStringReason(reason), reason);
  });

  it('accepts revert with custom error', async function () {
    if (env === 'truffle') {
      // doesn't appear to work yet
      return this.skip();
    }
    await expectRevert(this.r.revertWithCustomError(), 'CustomError');
  });

  it('rejects revert with other reason', async function () {
    await assert.rejects(
      expectRevert(this.r.revertWithStringReason(), 'not the reason'),
    );
  });

  it('rejects non-revert error', async function () {
    await assert.rejects(
      expectRevert(Promise.reject(new Error('not a revert'))),
    );
  });
});
