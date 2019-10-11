// Validate that this is testing what we want: that this package uses a
// different chai module than the one being used internally by test-helpers.
// This is verified by checking that the chai versions don't intersect, so that
// the package manager is unable to dedupe them.
const assert = require('assert');
const semver = require('semver');

const our = require('./package.json');
const testHelpers = require('@openzeppelin/test-helpers/package.json');

assert(
  !semver.intersects(our.dependencies.chai, testHelpers.dependencies.chai),
  'Integration test is not set up correctly: chai module may be deduped',
);

// Even though we're using different chai modules, chai-bn is still being
// installed.
require('@openzeppelin/test-helpers');

const { expect } = require('chai');

// If chai-bn is not installed the following line will fail.
expect('1').to.bignumber.equal('1');
