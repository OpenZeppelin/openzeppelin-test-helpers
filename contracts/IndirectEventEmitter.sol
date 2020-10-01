pragma solidity ^0.5.0;

contract IndirectEventEmitter {
    event IndirectString(string value);
    event IndexedConflictingUint(uint256 normalValue, uint256 indexed indexedConflictValue);
    event IndexedUint(uint256 indexed indexedValue, uint256 normalValue);

    function emitStringIndirectly(string memory value) public {
        emit IndirectString(value);
    }

    function emitIndexedConflictingUint(uint256 normalValue, uint256 indexedConflictValue) public {
        emit IndexedConflictingUint(normalValue, indexedConflictValue);
    }

    function emitIndexedUint(uint256 indexedValue, uint256 normalValue) public {
        emit IndexedUint(indexedValue, normalValue);
    }
}
