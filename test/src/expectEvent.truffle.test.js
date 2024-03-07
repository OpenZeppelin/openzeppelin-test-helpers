const { BN } = require('../../src/setup');
const { expect, AssertionError } = require('chai');
const assertFailure = require('../helpers/assertFailure');
const expectEvent = require('../../src/expectEvent');

const EventEmitter = artifacts.require('EventEmitter');
const IndirectEventEmitter = artifacts.require('IndirectEventEmitter');

contract('expectEvent (truffle contracts)', function ([deployer]) {
  const errorRegex = /expected event argument .* to have value .* but got .*/;

  beforeEach(async function () {
    this.constructionValues = {
      uint: 42,
      boolean: true,
      string: 'OpenZeppelin',
      stringsArray: ['hello', 'world!'],
    };

    this.emitter = await EventEmitter.new(
      this.constructionValues.uint,
      this.constructionValues.boolean,
      this.constructionValues.string,
      this.constructionValues.stringsArray
    );

    this.secondEmitter = await IndirectEventEmitter.new();
  });

  describe('inConstructor', function () {
    context('short uint value', function () {
      it('accepts emitted events with correct BN', async function () {
        await expectEvent.inConstruction(this.emitter, 'ShortUint',
          { value: new BN(this.constructionValues.uint) }
        );
      });

      it('throws if a correct JavaScript number is passed', async function () {
        const { message } = await assertFailure(
          expectEvent.inConstruction(this.emitter, 'ShortUint', { value: this.constructionValues.uint })
        );
        expect(message).to.match(errorRegex);
      });

      it('throws if an incorrect value is passed', async function () {
        const { message } = await assertFailure(expectEvent.inConstruction(this.emitter, 'ShortUint',
          { value: new BN(23) }));
        expect(message).to.match(errorRegex);
      });
    });

    context('boolean value', function () {
      it('accepts emitted events with correct value', async function () {
        await expectEvent.inConstruction(this.emitter, 'Boolean', { value: this.constructionValues.boolean });
      });

      it('throws if an incorrect value is passed', async function () {
        const { message } = await assertFailure(expectEvent.inConstruction(this.emitter, 'Boolean',
          { value: !this.constructionValues.boolean }
        ));
        expect(message).to.match(errorRegex);
      });
    });

    context('string value', function () {
      it('accepts emitted events with correct string', async function () {
        await expectEvent.inConstruction(this.emitter, 'String', { value: this.constructionValues.string });
      });

      it('throws if an incorrect string is passed', async function () {
        const { message } = await assertFailure(expectEvent.inConstruction(this.emitter, 'String',
          { value: 'ClosedZeppelin' }));
        expect(message).to.match(errorRegex);
      });
    });

    context('string array value', function () {
      it('accepts emitted events with correct string array', async function () {
        await expectEvent.inConstruction(this.emitter, 'StringArray',
          { value: this.constructionValues.stringsArray });
      });

      it('throws if an incorrect string array is passed', async function () {
        const { message } = await assertFailure(expectEvent.inConstruction(this.emitter, 'StringArray',
          { value: ['shalom', 'world!'] }));
        expect(message).to.match(errorRegex);
      });
    });

    it('throws if an unemitted event is requested', async function () {
      await assertFailure(expectEvent.inConstruction(this.emitter, 'UnemittedEvent'));
    });
  });

  describe('default', function () {
    describe('with no arguments', function () {
      beforeEach(async function () {
        this.receipt = await this.emitter.emitArgumentless();
      });

      it('accepts emitted events', function () {
        expectEvent(this.receipt, 'Argumentless');
      });

      it('returns the event', function () {
        expect(expectEvent(this.receipt, 'Argumentless').event).to.equal('Argumentless');
      });

      it('throws if an unemitted event is requested', function () {
        expect(() => expectEvent(this.receipt, 'UnemittedEvent')).to.throw();
      });
    });

    describe('with single argument', function () {
      context('short uint value', function () {
        beforeEach(async function () {
          this.value = 42;
          this.receipt = await this.emitter.emitShortUint(this.value);
        });

        it('accepts emitted events with correct BN', function () {
          expectEvent(this.receipt, 'ShortUint', { value: new BN(this.value) });
        });

        it('throws if an emitted event with correct JavaScript number is requested', function () {
          expect(() => expectEvent(this.receipt, 'ShortUint', { value: this.value })).to.throw();
        });

        it('throws if an emitted event with correct BN and incorrect name is requested', function () {
          expect(() => expectEvent(this.receipt, 'ShortUint', { number: new BN(this.value) })).to.throw();
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.receipt, 'ShortUint', { value: new BN(23) })).to.throw(
            AssertionError, 'expected event argument \'value\' to have value 23 but got 42');
        });
      });

      context('short int value', function () {
        beforeEach(async function () {
          this.value = -42;
          this.receipt = await this.emitter.emitShortInt(this.value);
        });

        it('accepts emitted events with correct BN', function () {
          expectEvent(this.receipt, 'ShortInt', { value: new BN(this.value) });
        });

        it('throws if an emitted event with correct JavaScript number is requested', function () {
          expect(() => expectEvent(this.receipt, 'ShortInt', { value: this.value })).to.throw();
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.receipt, 'ShortInt', { value: -23 })).to.throw();
        });
      });

      context('long uint value', function () {
        beforeEach(async function () {
          this.bigNumValue = new BN('123456789012345678901234567890');
          this.receipt = await this.emitter.emitLongUint(this.bigNumValue);
        });

        it('accepts emitted events with correct BN', function () {
          expectEvent(this.receipt, 'LongUint', { value: this.bigNumValue });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.bigNumValue })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.receipt, 'LongUint', { value: 2300 })).to.throw();
        });
      });

      context('long int value', function () {
        beforeEach(async function () {
          this.bigNumValue = new BN('-123456789012345678901234567890');
          this.receipt = await this.emitter.emitLongInt(this.bigNumValue);
        });

        it('accepts emitted events with correct BN', function () {
          expectEvent(this.receipt, 'LongInt', { value: this.bigNumValue });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.bigNumValue })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.receipt, 'LongInt', { value: -2300 })).to.throw();
        });
      });

      context('address value', function () {
        beforeEach(async function () {
          this.value = '0x811412068E9Fbf25dc300a29E5E316f7122b282c';
          this.receipt = await this.emitter.emitAddress(this.value);
        });

        it('accepts emitted events with correct address', function () {
          expectEvent(this.receipt, 'Address', { value: this.value });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() =>
            expectEvent(this.receipt, 'Address', { value: '0x21d04e022e0b52b5d5bcf90b7f1aabf406be002d' })
          ).to.throw();
        });
      });

      context('boolean value', function () {
        beforeEach(async function () {
          this.value = true;
          this.receipt = await this.emitter.emitBoolean(this.value);
        });

        it('accepts emitted events with correct address', function () {
          expectEvent(this.receipt, 'Boolean', { value: this.value });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.receipt, 'Boolean', { value: false })).to.throw();
        });
      });

      context('string value', function () {
        beforeEach(async function () {
          this.value = 'OpenZeppelin';
          this.receipt = await this.emitter.emitString(this.value);
        });

        it('accepts emitted events with correct string', function () {
          expectEvent(this.receipt, 'String', { value: this.value });
        });

        it('throws if an unemitted event is requested', function () {
          expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.value })).to.throw();
        });

        it('throws if an incorrect value is passed', function () {
          expect(() => expectEvent(this.receipt, 'String', { value: 'ClosedZeppelin' })).to.throw();
        });
      });

      context('bytes value', function () {
        context('with non-null value', function () {
          beforeEach(async function () {
            this.value = '0x12345678';
            this.receipt = await this.emitter.emitBytes(this.value);
          });

          it('accepts emitted events with correct bytes', function () {
            expectEvent(this.receipt, 'Bytes', { value: this.value });
          });

          it('throws if an unemitted event is requested', function () {
            expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.value })).to.throw();
          });

          it('throws if an incorrect value is passed', function () {
            expect(() => expectEvent(this.receipt, 'Bytes', { value: '0x123456' })).to.throw();
          });
        });

        context('with null value', function () {
          beforeEach(async function () {
            this.value = '0x';
            this.receipt = await this.emitter.emitBytes(this.value);
          });

          it('accepts emitted events with correct bytes', function () {
            expectEvent(this.receipt, 'Bytes', { value: null });
          });

          it('throws if an unemitted event is requested', function () {
            expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: null })).to.throw();
          });

          it('throws if an incorrect value is passed', function () {
            expect(() => expectEvent(this.receipt, 'Bytes', { value: '0x123456' })).to.throw();
          });
        });
      });
    });

    describe('with multiple arguments', function () {
      beforeEach(async function () {
        this.uintValue = new BN('123456789012345678901234567890');
        this.booleanValue = true;
        this.stringValue = 'OpenZeppelin';
        this.receipt = await this.emitter.emitLongUintBooleanString(
          this.uintValue, this.booleanValue, this.stringValue
        );
      });

      it('accepts correct values', function () {
        expectEvent(this.receipt, 'LongUintBooleanString', {
          uintValue: this.uintValue, booleanValue: this.booleanValue, stringValue: this.stringValue,
        });
      });

      it('throws with correct values assigned to wrong arguments', function () {
        expect(() => expectEvent(this.receipt, 'LongUintBooleanString', {
          uintValue: this.booleanValue, booleanValue: this.uintValue, stringValue: this.stringValue,
        })).to.throw();
      });

      it('throws when any of the values is incorrect', function () {
        expect(() => expectEvent(this.receipt, 'LongUintBooleanString', {
          uintValue: 23, booleanValue: this.booleanValue, stringValue: this.stringValue,
        })).to.throw();

        expect(() => expectEvent(this.receipt, 'LongUintBooleanString', {
          uintValue: this.uintValue, booleanValue: false, stringValue: this.stringValue,
        })).to.throw();

        expect(() => expectEvent(this.receipt, 'LongUintBooleanString', {
          uintValue: this.uintValue, booleanValue: this.booleanValue, stringValue: 'ClosedZeppelin',
        })).to.throw();
      });
    });

    describe('with multiple events', function () {
      beforeEach(async function () {
        this.uintValue = 42;
        this.booleanValue = true;
        this.receipt = await this.emitter.emitLongUintAndBoolean(this.uintValue, this.booleanValue);
      });

      it('accepts all emitted events with correct values', function () {
        expectEvent(this.receipt, 'LongUint', { value: new BN(this.uintValue) });
        expectEvent(this.receipt, 'Boolean', { value: this.booleanValue });
      });

      it('throws if an unemitted event is requested', function () {
        expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.uintValue })).to.throw();
      });

      it('throws if incorrect values are passed', function () {
        expect(() => expectEvent(this.receipt, 'LongUint', { value: 23 })).to.throw();
        expect(() => expectEvent(this.receipt, 'Boolean', { value: false })).to.throw();
      });
    });

    describe('with multiple events of the same type', function () {
      beforeEach(async function () {
        this.firstUintValue = 42;
        this.secondUintValue = 24;
        this.receipt = await this.emitter.emitTwoLongUint(this.firstUintValue, this.secondUintValue);
      });

      it('accepts all emitted events of the same type', function () {
        expectEvent(this.receipt, 'LongUint', { value: new BN(this.firstUintValue) });
        expectEvent(this.receipt, 'LongUint', { value: new BN(this.secondUintValue) });
      });

      it('throws if an unemitted event is requested', function () {
        expect(() => expectEvent(this.receipt, 'UnemittedEvent', { value: this.uintValue })).to.throw();
      });

      it('throws if incorrect values are passed', function () {
        expect(() => expectEvent(this.receipt, 'LongUint', { value: new BN(41) })).to.throw();
        expect(() => expectEvent(this.receipt, 'LongUint', { value: 24 })).to.throw();
      });
    });

    describe('with events emitted by an indirectly called contract', function () {
      beforeEach(async function () {
        this.value = 'OpenZeppelin';
        this.receipt = await this.emitter.emitStringAndEmitIndirectly(this.value, this.secondEmitter.address);
      });

      it('accepts events emitted by the directly called contract', function () {
        expectEvent(this.receipt, 'String', { value: this.value });
      });

      it('throws when passing events emitted by the indirectly called contract', function () {
        expect(() => expectEvent(this.receipt, 'IndirectString', { value: this.value })).to.throw();
      });
    });

    describe('with events containing indexed parameters', function () {
      beforeEach(async function () {
        this.indexedValue = new BN(42);
        this.normalValue = new BN(2014);
        this.receipt = await this.emitter.emitIndexedUint(
          this.indexedValue,
          this.normalValue,
        );
      });

      it('accepts events emitted by the directly called contract', function () {
        expectEvent(this.receipt, 'IndexedUint', {
          indexedValue: this.indexedValue,
          normalValue: this.normalValue,
        });
      });
    });

    describe('with events containing conflicting indexed parameters', function () {
      beforeEach(async function () {
        this.indexedValue1 = new BN(42);
        this.normalValue1 = new BN(2014);
        this.indexedValue2 = new BN(2016);
        this.indexedValue3 = new BN(2009);
        this.receipt = await this.emitter.emitIndexedConflictingUint(
          this.indexedValue1,
          this.normalValue1,
          this.indexedValue2,
          this.indexedValue3,
          this.secondEmitter.address
        );
      });

      it('accepts events emitted by the directly called contract', function () {
        expectEvent(this.receipt, 'IndexedConflictingUint', {
          indexedValue1: this.indexedValue1,
          normalValue1: this.normalValue1,
        });
      });
    });
  });

  describe('inTransaction', function () {
    describe('when emitting from called contract and indirect calls', function () {
      context('string value', function () {
        beforeEach(async function () {
          this.value = 'OpenZeppelin';
          const { receipt } = await this.emitter.emitStringAndEmitIndirectly(this.value, this.secondEmitter.address);
          this.txHash = receipt.transactionHash;
        });

        context('with directly called contract', function () {
          it('accepts emitted events with correct string and emitter object', async function () {
            await expectEvent.inTransaction(this.txHash, this.emitter, 'String', { value: this.value });
          });

          it('accepts emitted events with correct string and emitter class', async function () {
            await expectEvent.inTransaction(this.txHash, EventEmitter, 'String', { value: this.value });
          });

          it('throws if an unemitted event is requested', async function () {
            await assertFailure(expectEvent.inTransaction(this.txHash, EventEmitter, 'UnemittedEvent',
              { value: this.value }
            ));
          });

          it('throws if an incorrect string is passed', async function () {
            const { message } = await assertFailure(expectEvent.inTransaction(this.txHash, EventEmitter, 'String',
              { value: 'ClosedZeppelin' }
            ));
            expect(message).to.match(errorRegex);
          });

          it('throws if an event emitted from other contract is passed', async function () {
            await assertFailure(expectEvent.inTransaction(this.txHash, EventEmitter, 'IndirectString',
              { value: this.value }
            ));
          });

          it('throws if an incorrect emitter class is passed', async function () {
            await assertFailure(expectEvent.inTransaction(this.txHash, IndirectEventEmitter, 'String',
              { value: this.value }
            ));
          });

          it('throws if an incorrect emitter object is passed', async function () {
            await assertFailure(
              expectEvent.inTransaction(
                this.txHash,
                await EventEmitter.new(0, false, '', []),
                'String',
                { value: this.value }
              )
            );
          });
        });

        context('with indirectly called contract', function () {
          it('accepts events emitted from other contracts and emitter object', async function () {
            await expectEvent.inTransaction(this.txHash, this.secondEmitter, 'IndirectString',
              { value: this.value }
            );
          });

          it('accepts events emitted from other contracts and emitter class', async function () {
            await expectEvent.inTransaction(this.txHash, IndirectEventEmitter, 'IndirectString',
              { value: this.value }
            );
          });

          it('throws if an unemitted event is requested', async function () {
            await assertFailure(expectEvent.inTransaction(this.txHash, IndirectEventEmitter, 'UnemittedEvent',
              { value: this.value }
            ));
          });

          it('throws if an incorrect string is passed', async function () {
            await assertFailure(expectEvent.inTransaction(this.txHash, IndirectEventEmitter, 'IndirectString',
              { value: 'ClosedZeppelin' }
            ));
          });

          it('throws if an event emitted from other contract is passed', async function () {
            await assertFailure(expectEvent.inTransaction(this.txHash, IndirectEventEmitter, 'String',
              { value: this.value }
            ));
          });

          it('throws if an incorrect emitter class is passed', async function () {
            await assertFailure(expectEvent.inTransaction(this.txHash, EventEmitter, 'IndirectString',
              { value: this.value }
            ));
          });

          it('throws if an incorrect emitter object is passed', async function () {
            await assertFailure(
              expectEvent.inTransaction(
                this.txHash,
                await IndirectEventEmitter.new(),
                'IndirectString',
                { value: this.value }
              )
            );
          });
        });
      });
    });

    describe('with indexed event parameters', function () {
      beforeEach(async function () {
        this.indexedValue = new BN(42);
        this.normalValue = new BN(2014);
        this.indexedValue2 = new BN(2016);
        this.normalValue2 = new BN(2020);
        const { receipt } = await this.emitter.emitIndexedUintAndEmitIndirectly(
          this.indexedValue,
          this.normalValue,
          this.indexedValue2,
          this.normalValue2,
          this.secondEmitter.address
        );
        this.txHash = receipt.transactionHash;
      });

      context('with directly called contract', function () {
        it('accepts emitted events with correct indexed parameter and emitter object', async function () {
          await expectEvent.inTransaction(this.txHash, this.emitter, 'IndexedUint', {
            indexedValue: this.indexedValue,
            normalValue: this.normalValue,
          });
        });

        it('accepts emitted indexed events with correct indexed parameter and emitter class', async function () {
          await expectEvent.inTransaction(this.txHash, EventEmitter, 'IndexedUint', {
            indexedValue: this.indexedValue,
            normalValue: this.normalValue,
          });
        });
      });

      context('with indirectly called contract', function () {
        it('accepts events emitted from other contracts with emitter object', async function () {
          await expectEvent.inTransaction(this.txHash, this.secondEmitter, 'IndexedUint', {
            indexedValue: this.indexedValue2,
            normalValue: this.normalValue2,
          });
        });

        it('accepts emitted indexed events with emitter class', async function () {
          await expectEvent.inTransaction(this.txHash, IndirectEventEmitter, 'IndexedUint', {
            indexedValue: this.indexedValue2,
            normalValue: this.normalValue2,
          });
        });
      });
    });

    describe('with conflicting indexed event parameters', function () {
      beforeEach(async function () {
        this.indexedValue1 = new BN(42);
        this.normalValue1 = new BN(2014);
        this.indexedValue2 = new BN(2016);
        this.indexedValue3 = new BN(2009);
        const { receipt } = await this.emitter.emitIndexedConflictingUint(
          this.indexedValue1,
          this.normalValue1,
          this.indexedValue2,
          this.indexedValue3,
          this.secondEmitter.address
        );
        this.txHash = receipt.transactionHash;
      });

      context('with directly called contract', function () {
        it('accepts emitted events with correct indexed parameter', async function () {
          await expectEvent.inTransaction(this.txHash, this.emitter, 'IndexedConflictingUint', {
            indexedValue1: this.indexedValue1,
            normalValue1: this.normalValue1,
          });
        });

        it('throws if the emitter class is passed', async function () {
          await assertFailure(expectEvent.inTransaction(this.txHash, EventEmitter, 'IndexedConflictingUint', {
            indexedValue1: this.indexedValue1,
            normalValue1: this.normalValue1,
          }));
        });

        it('throws if the event value emitted from other contract is passed', async function () {
          await assertFailure(expectEvent.inTransaction(this.txHash, this.emitter, 'IndexedConflictingUint', {
            indexedValue1: this.indexedValue2,
            normalValue1: this.indexedValue3,
          }));
        });

        it('throws if the event emitted from other contract is passed', async function () {
          await assertFailure(expectEvent.inTransaction(this.txHash, this.emitter, 'IndexedConflictingUint', {
            normalValue: this.normalValue,
            indexedValue2: this.indexedValue2,
          }));
        });

        it('throws if the wrong event is requested', async function () {
          await assertFailure(expectEvent.inTransaction(this.txHash, this.secondEmitter, 'IndexedConflictingUint', {
            indexedValue2: this.indexedValue1,
            indexedValue3: this.normalValue1,
          }));
        });
      });

      context('with indirectly called contract', function () {
        it('accepts events emitted from other contracts', async function () {
          await expectEvent.inTransaction(this.txHash, this.secondEmitter, 'IndexedConflictingUint', {
            indexedValue2: this.indexedValue2,
            indexedValue3: this.indexedValue3,
          });
        });

        it('throws if the emitter class is passed', async function () {
          await assertFailure(expectEvent.inTransaction(this.txHash, IndirectEventEmitter, 'IndexedConflictingUint', {
            indexedValue2: this.indexedValue2,
            indexedValue3: this.indexedValue3,
          }));
        });

        it('throws if the event value from other contract is passed', async function () {
          await assertFailure(expectEvent.inTransaction(this.txHash, this.secondEmitter, 'IndexedConflictingUint', {
            indexedValue2: this.indexedValue1,
            indexedValue3: this.normalValue1,
          }));
        });
      });

      it('throws if the event from other contract is passed', async function () {
        await assertFailure(expectEvent.inTransaction(this.txHash, this.secondEmitter, 'IndexedConflictingUint', {
          indexedValue1: this.indexedValue1,
          normalValue1: this.normalValue1,
        }));
      });

      it('throws if the wrong event is requested', async function () {
        await assertFailure(expectEvent.inTransaction(this.txHash, this.secondEmitter, 'IndexedConflictingUint', {
          indexedValue1: this.indexedValue2,
          normalValue1: this.indexedValue3,
        }));
      });
    });

    it('accepts events with non-unique event names', async function () {
      const { tx } = await this.emitter.emitRepeated('0x01');
      await expectEvent.inTransaction(tx, EventEmitter, 'Repeated', { value: '0x01' });
    });

    describe('with non-existing event names', function () {
      it('throws', async function () {
        // Which function we call is not important for this test
        const { tx } = await this.emitter.emitArgumentless();
        await assertFailure(expectEvent.inTransaction(tx, EventEmitter, 'Nonexistant'));
      });
    });
  });

  describe('not', function () {
    describe('notEmitted', function () {
      beforeEach(async function () {
        this.receipt = await this.emitter.emitArgumentless();
      });

      it('accepts not-emitted events', function () {
        expectEvent.notEmitted(this.receipt, 'UnemittedEvent');
      });

      it('throws if an emitted event is requested', function () {
        expect(() => expectEvent.notEmitted(this.receipt, 'Argumentless')).to.throw();
      });
    });
    describe('inTransaction', function () {
      context('with no arguments', function () {
        beforeEach(async function () {
          const { receipt } = await this.emitter.emitArgumentless();
          this.txHash = receipt.transactionHash;
        });
        it('accepts not emitted events', async function () {
          await expectEvent.notEmitted.inTransaction(this.txHash, EventEmitter, 'WillNeverBeEmitted');
        });
        it('throws when event does not exist in ABI', async function () {
          await assertFailure(expectEvent.notEmitted.inTransaction(this.txHash, EventEmitter, 'Nonexistant'));
        });
        it('throws when event its emitted', async function () {
          await assertFailure(expectEvent.notEmitted.inTransaction(this.txHash, EventEmitter, 'Argumentless'));
        });
      });
      context('with arguments', function () {
        beforeEach(async function () {
          this.value = 42;
          const { receipt } = await this.emitter.emitShortUint(this.value);
          this.txHash = receipt.transactionHash;
        });
        it('accepts not emitted events', async function () {
          await expectEvent.notEmitted.inTransaction(this.txHash, EventEmitter, 'WillNeverBeEmitted');
        });
        it('throws when event its emitted', async function () {
          await assertFailure(expectEvent.notEmitted.inTransaction(this.txHash, EventEmitter, 'ShortUint'));
        });
      });
      context('with events emitted by an indirectly called contract', function () {
        beforeEach(async function () {
          this.value = 'OpenZeppelin';
          const { receipt } = await this.emitter.emitStringAndEmitIndirectly(this.value, this.secondEmitter.address);
          this.txHash = receipt.transactionHash;
        });
        it('accepts not emitted events', async function () {
          await expectEvent.notEmitted.inTransaction(this.txHash, EventEmitter, 'WillNeverBeEmitted');
        });
        it('throws when event its emitted', async function () {
          await assertFailure(
            expectEvent.notEmitted.inTransaction(this.txHash, IndirectEventEmitter, 'IndirectString')
          );
        });
      });
    });
    describe('inConstructor', function () {
      it('accepts not emitted events', async function () {
        await expectEvent.notEmitted.inConstruction(this.emitter, 'WillNeverBeEmitted');
      });
      it('throws when event does not exist in ABI', async function () {
        await assertFailure(expectEvent.notEmitted.inConstruction(this.emitter, 'Nonexistant'));
      });
      it('throws when event its emitted', async function () {
        await assertFailure(expectEvent.notEmitted.inConstruction(this.emitter, 'ShortUint'));
        await assertFailure(expectEvent.notEmitted.inConstruction(this.emitter, 'Boolean'));
        await assertFailure(expectEvent.notEmitted.inConstruction(this.emitter, 'String'));
      });
    });
  });
});
