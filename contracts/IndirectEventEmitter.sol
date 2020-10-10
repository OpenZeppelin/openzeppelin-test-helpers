pragma solidity ^0.5.0;

contract IndirectEventEmitter {
    event IndirectString(string value);
    event IndexedConflictingUint(uint256 indexed indexedValue2, uint256 indexed indexedValue3);
    event IndexedUint(uint256 indexed indexedValue, uint256 normalValue);

    function emitStringIndirectly(string memory value) public {
        emit IndirectString(value);
    }

    function emitIndexedConflictingUint(uint256 indexedValue2, uint256 indexedValue3) public {
        emit IndexedConflictingUint(indexedValue2, indexedValue3);
    }

    function emitIndexedUint(uint256 indexedValue, uint256 normalValue) public {
        emit IndexedUint(indexedValue, normalValue);
    }
}
