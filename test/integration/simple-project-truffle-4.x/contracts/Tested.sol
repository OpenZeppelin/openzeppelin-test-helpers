pragma solidity ^0.4.24;

contract Tested {
    event Constructed();

    constructor () public {
        emit Constructed();
    }
}
