pragma solidity ^0.5.0;

contract Tested {
    event Constructed();

    constructor () public {
        emit Constructed();
    }
}
