pragma solidity ^0.5.0;

contract IndirectEventEmitter {
    event IndirectString(string value);
    event IndexedUint(uint256 indexed indexedValue, uint256 indexed indexedConflictValue);

    function emitStringIndirectly(string memory value) public {
        emit IndirectString(value);
    }

    function emitIndexedUint(uint256 indexedValue, uint256 indexedConflictValue) public {
        emit IndexedUint(indexedValue, indexedConflictValue);
    }
}
