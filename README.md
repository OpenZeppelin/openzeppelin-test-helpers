# OpenZeppelin Test Helpers

[![NPM Package](https://img.shields.io/npm/v/openzeppelin-test-helpers.svg)](https://www.npmjs.org/package/openzeppelin-test-helpers)
[![Build Status](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers.svg?branch=master)](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers)

**JavaScript testing helpers for Ethereum smart contract development.** These are specially suited for [Truffle 5](https://truffleframework.com/truffle) (using [web3 1.0](https://github.com/ethereum/web3.js/)). [Chai](http://chaijs.com/) [bn.js](https://github.com/indutny/bn.js) assertions using [chai-bn](https://github.com/OpenZeppelin/chai-bn) are also included.

## Installation

```bash
npm install --save-dev openzeppelin-test-helpers chai
```

## Usage

```javascript
// Import all required modules from openzeppelin-test-helpers
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers');

// Import preferred chai flavor: both expect and should are supported
const { expect } = require('chai');

const ERC20 = artifacts.require('ERC20');

contract('ERC20', ([sender, receiver]) => {
  beforeEach(async function () {
    this.erc20 = await ERC20.new();
    this.value = new BN(1); // The bundled BN library is the same one truffle and web3 use under the hood
  });

  it('reverts when transferring tokens to the zero address', async function () {
    // Edge cases that trigger a require statement can be tested for
    await expectRevert(
      this.erc20.transfer(constants.ZERO_ADDRESS, this.value, { from: sender }), 'ERC20: transfer to the zero address'
    );
  });

  it('emits a Transfer event on successful transfers', async function () {
    const { logs } = this.erc20.transfer(receiver, this.value, { from: sender });
    // Log-checking will not only look at the event name, but also the values, which can be addresses, strings, numbers, etc.
    expectEvent.inLogs(logs, 'Transfer', { from: sender, to: receiver, value: this.value });
  });

  it('updates balances on successful transfers', async function () {
    this.erc20.transfer(receiver, this.value, { from: sender });
    // chai-bn is installed, which means BN values can be tested and compared using the bignumber property in chai
    expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(this.value);
  });
});
```

### Configuration

By default, this library will look for a global web3 instance, but you can run a manual configuration and supply a custom one.

```javascript
require('openzeppelin-test-helpers/configure')({ web3: ... });

const { expectEvent } = require('openzeppelin-test-helpers');
```

## Reference

This documentation is a work in progress: if in doubt, head over to the [tests directory](https://github.com/OpenZeppelin/openzeppelin-test-helpers/tree/master/test/src) to see examples of how each helper can be used.

All returned numbers are of type [BN](https://github.com/indutny/bn.js).

---

### balance
Helper to keep track of ether balances of a specific account

#### balance current
##### async balance.current(account)
Returns the current balance of an account
```javascript
const balance = await balance.current(account)
```

#### balance tracker
##### async balance.get
Returns the current Ether balance of an account.
```javascript
const balanceTracker = await balance.tracker(account) //instantiation
const accounBalance = await balanceTracker.get() //returns the current balance of account
```
##### async balance.delta
Returns the change in the Ether since the last check(either `get()` or `delta()`)

```javascript
const balanceTracker = await balance.tracker(receiver)
send.ether(sender, receiver, ether('10'))
(await balanceTracker.delta()).should.be.bignumber.equal('10');
(await balanceTracker.delta()).should.be.bignumber.equal('0');
```
Or using `get()`:
```javascript
const balanceTracker = await balance.tracker(account) //instantiation
const accounBalance = await balanceTracker.get() //returns the current balance of account
(await balanceTracker.delta()).should.be.bignumber.equal('0');
```

---

### BN
A [bn.js](https://github.com/indutny/bn.js) object. Use `new BN(number)` to create `BN` instances.

---

### constants
A collection of useful [constants](src/constants.js).

#### constants.ZERO_ADDRESS
The initial value of a type `address` variable, i.e., `address(0)` in Solidity.

#### constants.MAX_UINT256
The maximum unsigned integer `2^256 - 1` represented in `BN`.

#### constants.MAX_INT256
The maximum signed integer `2^255 - 1` represented in `BN`.

#### constants.MIN_INT256
The minimum signed integer `-2^255` represented in `BN`.

---

### ether
Converts a value in Ether to wei.

---

### expect
A chai [expect](https://www.chaijs.com/api/bdd/) instance, containing the `bignumber` property (via [chai-bn](https://github.com/ZeppelinSolutions/chai-bn)).

```javascript
expect(new BN('2')).to.be.bignumber.equal('2');
```

---

### expectEvent
#### inLogs (logs, eventName, eventArgs = {})
Asserts `logs` contains an entry for an event with name `eventName`, for which all entries in `eventArgs` match.

#### async function inConstruction (contract, eventName, eventArgs = {})
Same as `inLogs`, but for events emitted during the construction of `contract`.

```javascript
const contract = await MyContract.new(5);
await expectEvent.inConstruction(contract, 'Created', { value: 5 });
```

#### async inTransaction (txHash, emitter, eventName, eventArgs = {})
Same as `inLogs`, but for events emitted in an arbitrary transaction (of hash `txHash`), by an arbitrary contract (`emitter`), even if it was indirectly called (i.e. if it was called by another smart contract and not an externally owned account).

---

### expectRevert
Collection of assertions for transaction errors (similar to [chai's `throw`](https://www.chaijs.com/api/bdd/#method_throw)).

#### async expectRevert (promise, message)
This helper asserts that `promise` was rejected due to a reverted transaction, and it will check that the revert reason includes `message`. Use `expectRevert.unspecified` when the revert reason is unknown. For example:

```solidity
contract Owned {
    address private _owner;

    constructor () {
        _owner = msg.sender;
    }

    function doOwnerOperation() public view {
        require(msg.sender == _owner, "Unauthorized");
        ....
    }
}
```

Can be tested as follows:
```javascript
const { expectRevert } = require('openzeppelin-test-helpers');

const Owned = artifacts.require('Owned');

contract('Owned', ([owner, other]) => {
  beforeEach(async function () {
    this.owned = Owned.new();
  });

  describe('doOwnerOperation', function() {
    it('Fails when called by a non-owner account', async function () {
      await expectRevert(this.owned.doOwnerOperation({ from: other }), "Unauthorized");
    });
  });
  ...
```

#### async expectRevert.unspecified (promise)
This helper asserts that `promise` was rejected due to a reverted transaction caused by a `require` or `revert` statement.

#### async expectRevert.assertion (promise)
This helper asserts that `promise` was rejected due to a reverted transaction caused by an `assert` statement or an invalid opcode.

#### async expectRevert.outOfGas (promise)
This helper asserts that `promise` was rejected due to a transaction running out of gas.

---

### makeInterfaceId
#### ERC165 (interfaces = [])
Calculates the [ERC165](https://eips.ethereum.org/EIPS/eip-165) interface ID of a contract, given a series of function signatures.

#### ERC1820 (name)
Calculates the [ERC1820](https://eips.ethereum.org/EIPS/eip-1820) interface hash of a contract, given its name.

---

### send
#### async send.ether (from, to, value)
Sends `value` Ether from `from` to `to`.

#### async function send.transaction (target, name, argsTypes, argsValues, opts = {})
Sends a transaction to contract `target`, calling method `name` with `argValues`, which are of type `argTypes` (as per the method's signature).

---

### should
A chai [should](https://www.chaijs.com/api/bdd/) instance, containing the `bignumber` property (via [chai-bn](https://github.com/ZeppelinSolutions/chai-bn)).

---

### singletons
#### async singletons.ERC1820Registry (funder)
Returns an instance of an [ERC1820Registry](https://eips.ethereum.org/EIPS/eip-1820) deployed as per the specification (i.e. the registry is located at the canonical address). This can be called multiple times to retrieve the same instance.

---

### time
#### async time.advanceBlock ()
Forces a block to be mined, incrementing the block height.

#### async time.latest ()
Returns the timestamp of the latest mined block. Should be coupled with `advanceBlock` to retrieve the current blockchain time.

#### async time.latestBlock ()
Returns the latest mined block number.

#### async time.increase (duration)
Increases the time of the blockchain by [`duration`](#timeduration) (in seconds), and mines a new block with that timestamp.

#### async time.increaseTo (target)
Same as `increase`, but a target time is specified instead of a duration.

#### time.duration
Helpers to convert different time units to seconds. Available helpers are: `seconds`, `minutes`, `hours`, `days`, `weeks` and `years`.

```javascript
await time.increase(time.duration.years(2));
```

## License

[MIT](LICENSE)
