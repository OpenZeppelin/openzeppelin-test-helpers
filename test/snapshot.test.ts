import assert from 'assert';

import { factory } from './utils';
import { snapshot } from '../src/snapshot';

const Test = factory('Test');

describe('snapshot', function () {
  it('reverts the state', async function () {
    const t = await Test.deploy();
    assert.equal(await t.k(), '0');
    const reset = await snapshot();
    await t.inc();
    assert.equal(await t.k(), '1');
    await reset();
    assert.equal(await t.k(), '0');
    await t.inc();
    assert.equal(await t.k(), '1');
    await reset();
    assert.equal(await t.k(), '0');
  });
});
