# OpenZeppelin Test Helpers

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/test-helpers.svg)](https://www.npmjs.org/package/@openzeppelin/test-helpers)
[![Build Status](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers.svg?branch=master)](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers)

**JavaScript testing helpers for Ethereum smart contract development.** With support for Truffle and plain web3.js workflows.

## Installation

```bash
npm install --save-dev @openzeppelin/test-helpers
```

## Usage

```javascript
// Import the modules you want from @openzeppelin/test-helpers
const { BN, constants, balance, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Optionally import Chai to write your assertions (must be installed separately)
const { expect } = require('chai');

const ERC20 = artifacts.require('ERC20');

contract('ERC20', function ([sender, receiver]) {
  beforeEach(async function () {
    this.erc20 = await ERC20.new();
    this.value = new BN(1); // The bundled BN library is the same one truffle and web3 use under the hood
  });

  it('reverts when transferring tokens to the zero address', async function () {
    // Conditions that trigger a require statement can be precisely tested
    await expectRevert(
      this.erc20.transfer(constants.ZERO_ADDRESS, this.value, { from: sender }),
      'ERC20: transfer to the zero address',
    );
  });

  it('emits a Transfer event on successful transfers', async function () {
    const receipt = await this.erc20.transfer(receiver, this.value, { from: sender });

    // Event assertions can verify that the arguments are the expected ones
    expectEvent(receipt, 'Transfer', {
      from: sender,
      to: receiver,
      value: this.value,
    });
  });

  it('updates balances on successful transfers', async function () {
    this.erc20.transfer(receiver, this.value, { from: sender });

    // If Chai is installed, big number assertions are automatically available thanks to chai-bn
    assert(await balance(receiver)).to.be.bignumber.equal(this.value);
  });
});
```

## Documentation 

- [Configuration](docs/modules/ROOT/pages/configuration.adoc)
- [API Reference](docs/modules/ROOT/pages/api.adoc)

## License

[MIT](LICENSE)
