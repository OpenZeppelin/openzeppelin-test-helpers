pragma solidity ^0.5.0;

contract IndirectEventEmitter {
    event IndirectString(string value);

    function emitStringIndirectly(string memory value) public {
        emit IndirectString(value);
    }
}
