# OpenZeppelin test helpers

[![NPM Package](https://img.shields.io/npm/v/openzeppelin-test-helpers.svg?style=flat-square)](https://www.npmjs.org/package/openzeppelin-test-helpers)
[![Build Status](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers.svg?branch=master)](https://travis-ci.com/OpenZeppelin/openzeppelin-test-helpers)

JavaScript testing helpers for Ethereum smart contract development. These are specially suited for [truffle 5](https://truffleframework.com/truffle) (using [web3 1.0](https://github.com/ethereum/web3.js/)). [chai](http://chaijs.com/) [bn.js](https://github.com/indutny/bn.js) assertions using [chai-bn](https://github.com/ZeppelinSolutions/chai-bn) are also included.

## Installation

```bash
npm install --save-dev openzeppelin-test-helpers
```

## Usage

```javascript
const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const ERC20 = artifacts.require('ERC20');

contract('ERC20', ([sender, receiver]) => {
  beforeEach(async function () {
    this.erc20 = ERC20.new();
    this.value = new BN(1);
  });

  it('reverts when transferring tokens to the zero address', async function () {
    await shouldFail.reverting(this.erc20.transfer(constants.ZERO_ADDRESS, this.value, { from: sender }));
  });

  it('emits a Transfer event on successful transfers', async function () {
    const { logs } = this.erc20.transfer(receiver, this.value, { from: sender });
    expectEvent.inLogs(logs, 'Transfer', { from: sender, to: receiver, value: this.value });
  });

  it('updates balances on succesful transfers', async function () {
    this.erc20.transfer(receiver, this.value, { from: sender });
    (await this.token.balanceOf(receiver)).should.be.bignumber.equal(this.value);
  });
});
```

## Reference

This documentation is a work in progress: if in doubt, head over to the [tests directory](https://github.com/OpenZeppelin/openzeppelin-test-helpers/tree/master/test/src) to see examples of how each helper can be used.

All returned numbers are of type [BN](https://github.com/indutny/bn.js).

---

### balance
#### async balance.current (account)
Returns the current Ether balance of an account.

#### async balance.difference (account, promiseFunc)
Returns the change in the Ether balance of an account caused by executing `promiseFunc` (which will be awaited on).

```javascript
(await balance.difference(receiver, () =>
  send.ether(sender, receiver, ether('1')))
).should.be.bignumber.equal(ether('1'));
```

---

### BN
A [bn.js](https://github.com/indutny/bn.js) object. Use `new BN(number)` to create `BN` instances.

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
Same as `inLogs`, but for events emitted in an arbitrary transaction (of hash `txHash`), by an arbitrary contract (`emitter`), even it it was indirectly called (i.e. if it was called another smart contract and not an externally owned account).

---


### makeInterfaceId (interfaces = [])
Calculates the [EIP 165](https://eips.ethereum.org/EIPS/eip-165) interface ID of a contract, given a series of function signatures.

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

### shouldFail
Collection of assertions for failures (similar to [chai's `throw`](https://www.chaijs.com/api/bdd/#method_throw)). `shouldFail` will accept any exception type, but more specific functions exist and their usage is encouraged.

#### async shouldFail.reverting (promise)
Only accepts failures caused due to an EVM revert (e.g. a failed `require`).

#### async shouldFail.reverting.withMessage (promise, message)
Like `shouldFail.reverting`, this helper only accepts failures caused due to an EVM revert (e.g. a failed `require`). Furthermore, it checks whether revert reason string includes passed `message`. For example:

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
const { shouldFail } = require('openzeppelin-test-helpers');

const Owned = artifacts.require('Owned');

contract('Owned', ([owner, other]) => {
  beforeEach(async function () {
    this.owned = Owned.new();
  });

  describe('doOwnerOperation', function() {
    it('Fails when called by a non-owner account', async function () {
      await shouldFail.reverting.withMessage(this.owned.doOwnerOperation({ from: other }), "Unauthorized");
    });
  });
  ...
```

Use this helper to specify the expected error message, when you're testing a function that can revert for multiple reasons.

#### async shouldFail.throwing (promise)
Only accepts failures due to a failed `assert` (which executes an invalid opcode).

#### async shouldFail.outOfGas (promise)
Only accepts failures due to the transaction running out of gas.

---

### time
#### async time.advanceBlock()
Forces a block to be mined, incrementing the block height.

#### async time.latest()
Returns the timestamp of the latest mined block. Should be coupled with `advanceBlock` to retrieve the current blockchain time.

#### async time.latestBlock()
Returns the latest mined block number.

#### async time.increase(duration)
Increases the time of the blockchain by `duration` (in seconds), and mines a new block with that timestamp.

#### async time.increaseTo(target)
Same as `increase`, but a target time is specified instead of a duration.

#### async time.duration
Helpers to convert different time units to seconds. Available helpers are: `seconds`, `minutes`, `hours`, `days`, `weeks` and `years`.

```javascript
await time.increase(time.years(2));
```

## License

[MIT](LICENSE)
