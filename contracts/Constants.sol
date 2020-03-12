pragma solidity ^0.5.0;

contract Constants {
    function isZeroBytes32(bytes32 value) public pure returns (bool) {
        return value == bytes32(0x00);
    }

    function isBytesLength32(bytes memory value) public pure returns (bool) {
        return value.length == 32;
    }

    function returnZeroBytes32() public pure returns (bytes32) {
        return bytes32(0x00);
    }

    function isZeroAddress(address value) public pure returns (bool) {
        return value == address(0);
    }

    function returnZeroAddress() public pure returns (address) {
        return address(0);
    }
}
