const { BN, load } = require('../../src/setup');
const { expect } = require('chai');
const assertFailure = require('../helpers/assertFailure');
const expectEvent = require('../../src/expectEvent');

const EventEmitter = load('EventEmitter');
const IndirectEventEmitter = load('IndirectEventEmitter');

contract.only('expectEvent (web3 contracts) ', function ([deployer]) {
  beforeEach(async function () {
    this.constructionValues = {
      uint: 42,
      boolean: true,
      string: 'OpenZeppelin',
    };

    this.emitter = await EventEmitter.deploy({ arguments: [
      this.constructionValues.uint,
      this.constructionValues.boolean,
      this.constructionValues.string
    ] }).send({ from: deployer, gas: 2e6 });

    this.secondEmitter = await IndirectEventEmitter.deploy().send({ from: deployer, gas: 2e6 });
  });

  describe('default', function () {
    describe('with no arguments', function () {
      beforeEach(async function () {
        this.tx = await this.emitter.methods.emitArgumentless().send({ from: deployer, gas: 2e6 });
      });

      it('accepts emitted events', function () {
        expectEvent(this.tx, 'Argumentless');
      });

      it('throws if an unemitted event is requested', function () {
        expect(() => expectEvent(this.tx, 'UnemittedEvent')).to.throw();
      });
    });

    describe('with single argument', function () {
      context('short uint value', function () {
        beforeEach(async function () {
          this.value = 42;
          this.tx = await this.emitter.methods.emitShortUint(this.value).send({ from: deployer, gas: 2e6 });
        });

        it('accepts emitted events with correct BN', function () {
          expectEvent(this.tx, 'ShortUint', { value: new BN(this.value) });
        });

        it('throws if an emitted event with correct JavaScript number is requested', function () {
          expect(() => expectEvent(this.tx, 'ShortUint', { value: this.value })).to.throw();
        });

        it('throws if an emitted event with correct BN and incorrect name is requested', function () {
          expect(() => expectEvent(this.tx, 'ShortUint', { number: new BN(this.value) })).to.throw();
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.tx, 'ShortUint', { value: 23 })).to.throw();
        });
      });

      context('short int value', function () {
        beforeEach(async function () {
          this.value = -42;
          this.tx = await this.emitter.methods.emitShortInt(this.value).send({ from: deployer, gas: 2e6 });
        });

        it('accepts emitted events with correct BN', function () {
          expectEvent(this.tx, 'ShortInt', { value: new BN(this.value) });
        });

        it('throws if an emitted event with correct JavaScript number is requested', function () {
          expect(() => expectEvent(this.tx, 'ShortInt', { value: this.value })).to.throw();
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.tx, 'ShortInt', { value: -23 })).to.throw();
        });
      });

      context('long uint value', function () {
        beforeEach(async function () {
          this.bigNumValue = '123456789012345678901234567890';
          this.tx = await this.emitter.methods.emitLongUint(this.bigNumValue).send({ from: deployer, gas: 2e6 });
        });

        it('accepts emitted events with correct BN', function () {
          expectEvent(this.tx, 'LongUint', { value: this.bigNumValue });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.bigNumValue })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.tx, 'LongUint', { value: 2300 })).to.throw();
        });
      });

      context('long int value', function () {
        beforeEach(async function () {
          this.bigNumValue = '-123456789012345678901234567890';
          this.tx = await this.emitter.methods.emitLongInt(this.bigNumValue).send({ from: deployer, gas: 2e6 });
        });

        it('accepts emitted events with correct BN', function () {
          expectEvent(this.tx, 'LongInt', { value: this.bigNumValue });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.bigNumValue })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.tx, 'LongInt', { value: -2300 })).to.throw();
        });
      });

      context('address value', function () {
        beforeEach(async function () {
          this.value = '0x811412068E9Fbf25dc300a29E5E316f7122b282c';
          this.tx = await this.emitter.methods.emitAddress(this.value).send({ from: deployer, gas: 2e6 });
        });

        it('accepts emitted events with correct address', function () {
          expectEvent(this.tx, 'Address', { value: this.value });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() =>
            expectEvent(this.tx, 'Address', { value: '0x21d04e022e0b52b5d5bcf90b7f1aabf406be002d' })
          ).to.throw();
        });
      });

      context('boolean value', function () {
        beforeEach(async function () {
          this.value = true;
          this.tx = await this.emitter.methods.emitBoolean(this.value).send({ from: deployer, gas: 2e6 });
        });

        it('accepts emitted events with correct address', function () {
          expectEvent(this.tx, 'Boolean', { value: this.value });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.tx, 'Boolean', { value: false })).to.throw();
        });
      });

      context('string value', function () {
        beforeEach(async function () {
          this.value = 'OpenZeppelin';
          this.tx = await this.emitter.methods.emitString(this.value).send({ from: deployer, gas: 2e6 });
        });

        it('accepts emitted events with correct string', function () {
          expectEvent(this.tx, 'String', { value: this.value });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.tx, 'String', { value: 'ClosedZeppelin' })).to.throw();
        });
      });

      context('bytes value', function () {
        context('with non-null value', function () {
          beforeEach(async function () {
            this.value = '0x12345678';
            this.tx = await this.emitter.methods.emitBytes(this.value).send({ from: deployer, gas: 2e6 });
          });

          it('accepts emitted events with correct bytes', function () {
            expectEvent(this.tx, 'Bytes', { value: this.value });
          });

          it('throws if an unemitted event is requested', function () {
            expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.value })).to.throw();
          });

          it('throws if an incorrect value is passed', function () {
            expect(() => expectEvent(this.tx, 'Bytes', { value: '0x123456' })).to.throw();
          });
        });

        context('with null value', function () {
          beforeEach(async function () {
            this.value = '0x';
            this.tx = await this.emitter.methods.emitBytes(this.value).send({ from: deployer, gas: 2e6 });
          });

          it('accepts emitted events with correct bytes', function () {
            expectEvent(this.tx, 'Bytes', { value: null });
          });

          it('throws if an unemitted event is requested', function () {
            expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: null })).to.throw();
          });

          it('throws if an incorrect value is passed', function () {
            expect(() => expectEvent(this.tx, 'Bytes', { value: '0x123456' })).to.throw();
          });
        });
      });
    });

    describe('with multiple arguments', function () {
      beforeEach(async function () {
        this.uintValue = '123456789012345678901234567890';
        this.booleanValue = true;
        this.stringValue = 'OpenZeppelin';
        this.tx = await this.emitter.methods.emitLongUintBooleanString(this.uintValue, this.booleanValue, this.stringValue).send({ from: deployer, gas: 2e6 });
      });

      it('accepts correct values', function () {
        expectEvent(this.tx, 'LongUintBooleanString', {
          uintValue: this.uintValue, booleanValue: this.booleanValue, stringValue: this.stringValue,
        });
      });

      it('throws with correct values assigned to wrong arguments', function () {
        expect(() => expectEvent(this.tx, 'LongUintBooleanString', {
          uintValue: this.booleanValue, booleanValue: this.uintValue, stringValue: this.stringValue,
        })).to.throw();
      });

      it('throws when any of the values is incorrect', function () {
        expect(() => expectEvent(this.tx, 'LongUintBooleanString', {
          uintValue: 23, booleanValue: this.booleanValue, stringValue: this.stringValue,
        })).to.throw();

        expect(() => expectEvent(this.tx, 'LongUintBooleanString', {
          uintValue: this.uintValue, booleanValue: false, stringValue: this.stringValue,
        })).to.throw();

        expect(() => expectEvent(this.tx, 'LongUintBooleanString', {
          uintValue: this.uintValue, booleanValue: this.booleanValue, stringValue: 'ClosedZeppelin',
        })).to.throw();
      });
    });

    describe('with multiple events', function () {
      beforeEach(async function () {
        this.uintValue = 42;
        this.booleanValue = true;
        this.tx = await this.emitter.methods.emitLongUintAndBoolean(this.uintValue, this.booleanValue).send({ from: deployer, gas: 2e6 });
      });

      it('accepts all emitted events with correct values', function () {
        expectEvent(this.tx, 'LongUint', { value: new BN(this.uintValue) });
        expectEvent(this.tx, 'Boolean', { value: this.booleanValue });
      });

      it('throws if an unemitted event is requested', function () {
        expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.uintValue })).to.throw();
      });

      it('throws if incorrect values are passed', function () {
        expect(() => expectEvent(this.tx, 'LongUint', { value: 23 })).to.throw();
        expect(() => expectEvent(this.tx, 'Boolean', { value: false })).to.throw();
      });
    });

    describe('with multiple events of the same type', function () {
      beforeEach(async function () {
        this.firstUintValue = 42;
        this.secondUintValue = 24;
        this.tx = await this.emitter.methods.emitTwoLongUint(this.firstUintValue, this.secondUintValue).send({ from: deployer, gas: 2e6 });
      });

      it('accepts all emitted events of the same type', function () {
        expectEvent(this.tx, 'LongUint', { value: new BN(this.firstUintValue) });
        expectEvent(this.tx, 'LongUint', { value: new BN(this.secondUintValue) });
      });

      it('throws if an unemitted event is requested', function () {
        expect(() => expectEvent(this.tx, 'UnemittedEvent', { value: this.uintValue })).to.throw();
      });

      it('throws if incorrect values are passed', function () {
        expect(() => expectEvent(this.tx, 'LongUint', { value: new BN(41) })).to.throw();
        expect(() => expectEvent(this.tx, 'LongUint', { value: 24 })).to.throw();
      });
    });

    describe('with events emitted by an indirectly called contract', function () {
      beforeEach(async function () {
        this.value = 'OpenZeppelin';
        this.tx = await this.emitter.methods.emitStringAndEmitIndirectly(this.value, this.secondEmitter.options.address).send({ from: deployer, gas: 2e6 });
      });

      it('accepts events emitted by the directly called contract', function () {
        expectEvent(this.tx, 'String', { value: this.value });
      });

      it('throws when passing events emitted by the indirectly called contract', function () {
        expect(() => expectEvent(this.tx, 'IndirectString', { value: this.value })).to.throw();
      });
    });
  });
});
