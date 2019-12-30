pragma solidity ^0.5.0;

import "./IndirectEventEmitter.sol";

contract EventEmitter {
    event Argumentless();
    event WillNeverBeEmitted();
    event ShortUint(uint8 value);
    event ShortInt(int8 value);
    event LongUint(uint256 value);
    event LongInt(int256 value);
    event Address(address value);
    event Boolean(bool value);
    event String(string value);
    event LongUintBooleanString(uint256 uintValue, bool booleanValue, string stringValue);
    event Bytes(bytes value);

    event Repeated();
    event Repeated(bytes value);

    constructor (uint8 uintValue, bool booleanValue, string memory stringValue) public {
        emit ShortUint(uintValue);
        emit Boolean(booleanValue);
        emit String(stringValue);
    }

    function emitArgumentless() public {
        emit Argumentless();
    }

    function emitShortUint(uint8 value) public {
        emit ShortUint(value);
    }

    function emitShortInt(int8 value) public {
        emit ShortInt(value);
    }

    function emitLongUint(uint256 value) public {
        emit LongUint(value);
    }

    function emitLongInt(int256 value) public {
        emit LongInt(value);
    }

    function emitAddress(address value) public {
        emit Address(value);
    }

    function emitBoolean(bool value) public {
        emit Boolean(value);
    }

    function emitString(string memory value) public {
        emit String(value);
    }

    function emitBytes(bytes memory value) public {
        emit Bytes(value);
    }

    function emitLongUintBooleanString(uint256 uintValue, bool booleanValue, string memory stringValue) public {
        emit LongUintBooleanString(uintValue, booleanValue, stringValue);
    }

    function emitLongUintAndBoolean(uint256 uintValue, bool boolValue) public {
        emit LongUint(uintValue);
        emit Boolean(boolValue);
    }

    function emitStringAndEmitIndirectly(string memory value, IndirectEventEmitter emitter) public {
        emit String(value);
        emitter.emitStringIndirectly(value);
    }

    function emitTwoLongUint(uint256 firstValue, uint256 secondValue) public {
        emit LongUint(firstValue);
        emit LongUint(secondValue);
    }

    function emitRepeated(bytes memory value) public {
        emit Repeated();
        emit Repeated(value);
    }
}
