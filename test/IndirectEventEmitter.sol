pragma solidity ^0.4.24;

contract IndirectEventEmitter {
    event IndirectString(string value);

    function emitStringIndirectly(string value) public {
        emit IndirectString(value);
    }
}
