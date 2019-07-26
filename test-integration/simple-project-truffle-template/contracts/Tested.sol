pragma solidity ^0.5.0;

contract Tested {
    event Constructed(uint256 value);
    event Address(address account);

    constructor (uint256 foo) public {
        emit Constructed(foo);
    }

    function reverts() public {
        revert();
    }

    function nonZeroAddress(address account) public {
        require(account != address(0));

        emit Address(account);
    }
}
