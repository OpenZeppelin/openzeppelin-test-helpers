# OpenZeppelin Test Helpers

[![NPM Package](https://img.shields.io/npm/v/openzeppelin-test-helpers.svg)](https://www.npmjs.org/package/openzeppelin-test-helpers)
[![Build Status](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers.svg?branch=master)](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers)

**JavaScript testing helpers for Ethereum smart contract development.** These use [web3 1.2](https://www.npmjs.com/package/web3) under the hood, but include support for [`truffle-contract`](https://www.npmjs.com/package/@truffle/contract) objects. [Chai](http://chaijs.com/) [bn.js](https://github.com/indutny/bn.js) assertions using [chai-bn](https://github.com/OpenZeppelin/chai-bn) are also included.

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
    const receipt = this.erc20.transfer(receiver, this.value, { from: sender });
    // Log-checking will not only look at the event name, but also the values, which can be addresses, strings, numbers, etc.
    expectEvent(receipt, 'Transfer', { from: sender, to: receiver, value: this.value });
  });

  it('updates balances on successful transfers', async function () {
    this.erc20.transfer(receiver, this.value, { from: sender });
    // chai-bn is installed, which means BN values can be tested and compared using the bignumber property in chai
    expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(this.value);
  });
});
```

### Configuration

This library features support for both web3 and truffle contract instances. The default environment is `'web3'`, unless a `'truffle'` environment is automatically detected. In a `'truffle`' environment, the web3 provider will be pulled from truffle's global web3 instance, otherwise, it defaults to `http://localhost:8545`.

While automatic detection should cover most use cases, both the environment and provider can be manually supplied:

```javascript
require('openzeppelin-test-helpers/configure')({ environment: 'web3', provider: 'http://localhost:8080' });

const { expectEvent } = require('openzeppelin-test-helpers');
```

#### truffle migrations

Automatic environment detection does not work inside truffle migrations, so the helpers must be manually configured.

```javascript
require('openzeppelin-test-helpers/configure')({ environment: 'truffle', provider: web3.currentProvider });
```

## Reference

This documentation is a work in progress: if in doubt, head over to the [tests directory](https://github.com/OpenZeppelin/openzeppelin-test-helpers/tree/master/test/src) to see examples of how each helper can be used.

All returned numbers are of type [BN](https://github.com/indutny/bn.js).

---

### balance

Helpers to inspect Ether balances of a specific account.

All of these functions return `BN` instances, with balances in 'wei' by default.

#### balance current
##### async balance.current(account, unit = 'wei')
Returns the current balance of an account.
```javascript
const balance = await balance.current(account)
// same as new BN(web3.eth.getBalance(account))

const balanceEth = await balance.current(account, 'ether')
// same as new BN(web3.utils.fromWei(await web3.eth.getBalance(account), 'ether'))
```

#### balance tracker
Allows you to keep track of the changes in an account's Ether balance.

##### async balance.tracker(account, unit = 'wei')
Creates an instance of a balance tracker.

```javascript
const tracker = await balance.tracker(account)
```

##### async tracker.get(unit = tracker.unit)
Returns the current balance of an account.

```javascript
const tracker = await balance.tracker(account) // instantiation
const currentBalance = await tracker.get() // returns the current balance of account
```
##### async tracker.delta(unit = tracker.unit)
Returns the change in the balance since the last time it was checked (with either `get()` or `delta()`).

```javascript
const tracker = await balance.tracker(receiver, 'ether')
send.ether(sender, receiver, ether('10'))
(await tracker.delta()).should.be.bignumber.equal('10');
(await tracker.delta()).should.be.bignumber.equal('0');
```
Or using `get()`:
```javascript
const tracker = await balance.tracker(account) // instantiation
const currentBalance = await tracker.get() // returns the current balance of account
(await tracker.delta()).should.be.bignumber.equal('0');
```

A tracker can also return all balances and deltas in a specific unit:

```javascript
const tracker = await balance.tracker(account, 'gwei');
const balanceGwei = tracker.get(); // in gigawei
const balanceEther = tracker.get('ether'); // in ether
````

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

### expectEvent (receipt, eventName, eventArgs = {})
Asserts the logs in `receipt` contain an entry for an event with name `eventName`, for which all entries in `eventArgs` match. `receipt` is the object returned by either a web3 Contract or a truffle-contract call.

```javascript
const web3Receipt = await MyWeb3Contract.methods.foo('bar').send();
expectEvent(web3Receipt, 'Foo', { value: 'bar' });

const truffleReceipt = await MyTruffleContract.foo('bar');
expectEvent(truffleReceipt, 'Foo', { value: 'bar' });
```

#### async inTransaction (txHash, emitter, eventName, eventArgs = {})
Same as `expectEvent`, but for events emitted in an arbitrary transaction (of hash `txHash`), by an arbitrary contract (`emitter`, the contract instance), even if it was indirectly called (i.e. if it was called by another smart contract and not an externally owned account).

```javascript
// With web3 contracts
const contract = await MyContract.deploy().send();
const { transactionHash } = await contract.methods.foo('bar').send();
await expectEvent.inTransaction(transactionHash, contract, 'Foo', { value: 'bar' });

// With truffle contracts
const contract = await MyContract.new();
const { txHash } = await contract.foo('bar');
await expectEvent.inTransaction(txHash, contract, 'Foo', { value: 'bar' });
```

#### async function inConstruction (emitter, eventName, eventArgs = {})
Same as `inTransaction`, but for events emitted during the construction of `emitter`. Note that this is currently only supported for truffle contracts.

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
