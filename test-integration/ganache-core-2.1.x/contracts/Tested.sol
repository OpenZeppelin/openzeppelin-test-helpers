pragma solidity ^0.5.0;

contract Tested {
    function failWithRevertReason() public pure {
        revert("lorem ipsum");
    }
}
