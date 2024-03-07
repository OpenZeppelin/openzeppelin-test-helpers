const { BN, web3 } = require('../../src/setup');
const { expect } = require('chai');
const assertFailure = require('../helpers/assertFailure');
const expectEvent = require('../../src/expectEvent');

const { setupLoader } = require('@openzeppelin/contract-loader');

const web3Loader = setupLoader({
  provider: web3.eth.currentProvider,
  defaultGas: 2e6,
}).web3;

const EventEmitter = web3Loader.fromArtifact('EventEmitter');
const IndirectEventEmitter = web3Loader.fromArtifact('IndirectEventEmitter');

contract('expectEvent (web3 contracts) ', function ([deployer]) {
  before(function () {
    EventEmitter.options.from = deployer;
    IndirectEventEmitter.options.from = deployer;
  });

  beforeEach(async function () {
    this.constructionValues = {
      uint: 42,
      boolean: true,
      string: 'OpenZeppelin',
      stringsArray: ['hello', 'world!'],
    };

    this.emitter = await EventEmitter.deploy({ arguments: [
      this.constructionValues.uint,
      this.constructionValues.boolean,
      this.constructionValues.string,
      this.constructionValues.stringsArray,
    ] }).send();

    this.secondEmitter = await IndirectEventEmitter.deploy().send();
  });

  describe('default', function () {
    describe('with no arguments', function () {
      beforeEach(async function () {
        this.receipt = await this.emitter.methods.emitArgumentless().send();
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
          this.receipt = await this.emitter.methods.emitShortUint(this.value).send();
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
          expect(() => expectEvent(this.receipt, 'ShortUint', { value: 23 })).to.throw();
        });
      });

      context('short int value', function () {
        beforeEach(async function () {
          this.value = -42;
          this.receipt = await this.emitter.methods.emitShortInt(this.value).send();
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
          this.bigNumValue = '123456789012345678901234567890';
          this.receipt = await this.emitter.methods.emitLongUint(this.bigNumValue).send();
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
          this.bigNumValue = '-123456789012345678901234567890';
          this.receipt = await this.emitter.methods.emitLongInt(this.bigNumValue).send();
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
          this.receipt = await this.emitter.methods.emitAddress(this.value).send();
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
          this.receipt = await this.emitter.methods.emitBoolean(this.value).send();
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
          this.receipt = await this.emitter.methods.emitString(this.value).send();
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
            this.receipt = await this.emitter.methods.emitBytes(this.value).send();
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
            this.receipt = await this.emitter.methods.emitBytes(this.value).send();
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
        this.uintValue = '123456789012345678901234567890';
        this.booleanValue = true;
        this.stringValue = 'OpenZeppelin';
        this.receipt = await this.emitter.methods.emitLongUintBooleanString(
          this.uintValue, this.booleanValue, this.stringValue
        ).send();
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
        this.receipt = await this.emitter.methods.emitLongUintAndBoolean(this.uintValue, this.booleanValue).send();
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
        this.receipt = await this.emitter.methods.emitTwoLongUint(this.firstUintValue, this.secondUintValue).send();
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
        this.receipt = await this.emitter.methods.emitStringAndEmitIndirectly(
          this.value, this.secondEmitter.options.address
        ).send();
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
        this.receipt = await this.emitter.methods.emitIndexedUint(
          this.indexedValue,
          this.normalValue
        ).send();
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
        this.receipt = await this.emitter.methods.emitIndexedConflictingUint(
          this.indexedValue1,
          this.normalValue1,
          this.indexedValue2,
          this.indexedValue3,
          this.secondEmitter.options.address
        ).send();
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
          ({ transactionHash: this.txHash } = await this.emitter.methods.emitStringAndEmitIndirectly(
            this.value, this.secondEmitter.options.address
          ).send());
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
            await assertFailure(expectEvent.inTransaction(this.txHash, EventEmitter, 'String',
              { value: 'ClosedZeppelin' }
            ));
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
                await EventEmitter.deploy({ arguments: [0, false, '', []] }).send(),
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
                await IndirectEventEmitter.deploy().send(),
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
        this.receipt = await this.emitter.methods.emitIndexedUintAndEmitIndirectly(
          this.indexedValue,
          this.normalValue,
          this.indexedValue2,
          this.normalValue2,
          this.secondEmitter.options.address
        ).send();
        this.txHash = this.receipt.transactionHash;
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
        it('accepts events emitted from other contracts', async function () {
          await expectEvent.inTransaction(this.txHash, this.secondEmitter, 'IndexedUint', {
            indexedValue: this.indexedValue2,
            normalValue: this.normalValue2,
          });
        });
        it('accepts emitted indexed events with correct indexed parameter and emitter class', async function () {
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
        this.receipt = await this.emitter.methods.emitIndexedConflictingUint(
          this.indexedValue1,
          this.normalValue1,
          this.indexedValue2,
          this.indexedValue3,
          this.secondEmitter.options.address
        ).send();
        this.txHash = this.receipt.transactionHash;
      });

      context('with directly called contract', function () {
        it('accepts emitted events with correct indexed parameter and emitter object', async function () {
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
            indexedValue2: this.indexedValue2,
            indexedValue3: this.indexedValue3,
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

    describe('with non-unique event names', function () {
      it('throws', async function () {
        const { transactionHash } = await this.emitter.methods.emitRepeated('0x01').send();
        await expectEvent.inTransaction(transactionHash, EventEmitter, 'Repeated', { value: '0x01' });
      });
    });

    describe('with non-existing event names', function () {
      it('throws', async function () {
        // Which function we call is not important for this test
        const { transactionHash } = await this.emitter.methods.emitArgumentless().send();
        await assertFailure(expectEvent.inTransaction(transactionHash, EventEmitter, 'Nonexistant'));
      });
    });
  });

  describe('inConstruction', function () {
    it('is unsupported', async function () {
      await assertFailure(expectEvent.inConstruction(this.emitter, 'ShortUint'));
    });
  });

  describe('not', function () {
    describe('notEmitted', function () {
      beforeEach(async function () {
        this.receipt = await this.emitter.methods.emitArgumentless().send();
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
          ({ transactionHash: this.txHash } = await this.emitter.methods.emitArgumentless().send());
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
          ({ transactionHash: this.txHash } = await this.emitter.methods.emitShortUint(this.value).send());
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
          ({ transactionHash: this.txHash } = await this.emitter.methods.emitStringAndEmitIndirectly(
            this.value, this.secondEmitter.options.address
          ).send());
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
    describe('inConstruction', function () {
      it('is unsupported', async function () {
        await assertFailure(expectEvent.notEmitted.inConstruction(this.emitter, 'ShortUint'));
      });
    });
  });
});
