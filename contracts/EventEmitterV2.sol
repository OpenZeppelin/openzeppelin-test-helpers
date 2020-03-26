pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract EventEmitterV2 {
    event StringArray(string[] value);

    constructor(string[] memory stringArray) public {
        emit StringArray(stringArray);
    }
}
