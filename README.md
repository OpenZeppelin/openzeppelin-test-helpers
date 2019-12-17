# OpenZeppelin Test Helpers

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/test-helpers.svg)](https://www.npmjs.org/package/@openzeppelin/test-helpers)
[![Build Status](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers.svg?branch=master)](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers)

**Assertion library for Ethereum smart contract testing.** Make sure your contracts behave as expected!

 * Check that [transactions revert](docs/modules/ROOT/pages/api.adoc#expect-revert) for the correct reason
 * Verify [events](docs/modules/ROOT/pages/api.adoc#expect-event) where emitted with the right values
 * Track [balance changes](docs/modules/ROOT/pages/api.adoc#balance) elegantly
 * Handle [very large numbers](docs/modules/ROOT/pages/api.adoc#bn)
 * Simulate the [passing of time](docs/modules/ROOT/pages/api.adoc#time)

Test Helpers integrates seamlessly with [OpenZeppelin Test Environment](https://github.com/OpenZeppelin/openzeppelin-test-environment), but it also supports both Truffle tests and regular web3 workflows.

## Overview

### Installation

```bash
npm install --save-dev @openzeppelin/test-helpers
```

### Usage

Import `@openzeppelin/test-helpers` in your test files to access the different assertions and utilities.

```javascript
const { accounts, contract } = require('@openzeppelin/test-environment');

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const ERC20 = contract.fromArtifacts('ERC20');

describe('ERC20', function () {
  const [sender, receiver] =  accounts;

  beforeEach(async function () {
    // The bundled BN library is the same one web3 uses under the hood
    this.value = new BN(1);

    this.erc20 = await ERC20.new();
  });

  it('reverts when transferring tokens to the zero address', async function () {
    // Conditions that trigger a require statement can be precisely tested
    await expectRevert(
      this.erc20.transfer(constants.ZERO_ADDRESS, this.value, { from: sender }),
      'ERC20: transfer to the zero address',
    );
  });

  it('emits a Transfer event on successful transfers', async function () {
    const receipt = await this.erc20.transfer(
      receiver, this.value, { from: sender }
    );

    // Event assertions can verify that the arguments are the expected ones
    expectEvent(receipt, 'Transfer', {
      from: sender,
      to: receiver,
      value: this.value,
    });
  });

  it('updates balances on successful transfers', async function () {
    this.erc20.transfer(receiver, this.value, { from: sender });

    // BN assertions are automatically available via chai-bn (if using Chai)
    expect(await this.erc20.balanceOf(receiver))
      .to.be.bignumber.equal(this.value);
  });
});
```

## Learn More

* Head to [Configuration](docs/modules/ROOT/pages/configuration.adoc) for advanced settings.
* For detailed usage information, take a look at the [API Reference](docs/modules/ROOT/pages/api.adoc).


## License

[MIT](LICENSE)
